const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Charge .env.local sans dépendance supplémentaire.
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const equalsIdx = trimmed.indexOf('=');
    if (equalsIdx === -1) return;
    const key = trimmed.slice(0, equalsIdx).trim();
    const value = trimmed.slice(equalsIdx + 1).trim().replace(/^(['"])(.*)\1$/, '$2');
    if (!process.env[key]) process.env[key] = value;
  });
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Erreur : CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY ou CLOUDINARY_API_SECRET manquant dans .env.local');
  process.exit(1);
}

// Ces deux chemins doivent toujours rester synchronisés avec src/lib/cloudinary.js.
const BASE_FOLDER = process.env.CLOUDINARY_BASE_FOLDER || 'elvis-portfolio/images';
const defaultImagesDir = path.join(__dirname, '..', 'public', 'assets', 'images');
const imagesDir = path.resolve(process.env.CLOUDINARY_SOURCE_DIR || defaultImagesDir);
const manifestPath = path.join(__dirname, '..', 'src', 'data', 'cloudinaryVersions.js');
const MEDIA_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif', '.webm', '.mp4', '.mov']);
const VIDEO_EXTENSIONS = new Set(['.webm', '.mp4', '.mov']);
const dryRun = process.argv.includes('--dry-run');

function getFilesRecursively(dir) {
  const results = [];
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) results.push(...getFilesRecursively(filePath));
    else results.push(filePath);
  }
  return results;
}

function generateSignature(params, secret) {
  const sortedKeys = Object.keys(params).sort();
  const toSign = sortedKeys.map(key => `${key}=${params[key]}`).join('&') + secret;
  return crypto.createHash('sha1').update(toSign).digest('hex');
}

function localKey(relativePath) {
  return `/assets/images/${relativePath.replace(/\\/g, '/')}`;
}

function readExistingManifest() {
  if (!fs.existsSync(manifestPath)) return {};
  const source = fs.readFileSync(manifestPath, 'utf8');
  const match = source.match(/export const CLOUDINARY_VERSIONS = (\{[\s\S]*\})\s*$/);
  if (!match) return {};
  try {
    return Function(`"use strict"; return (${match[1]})`)();
  } catch {
    console.warn('⚠️  Manifest Cloudinary illisible : il sera régénéré avec les nouveaux uploads.');
    return {};
  }
}

function writeManifest(versions) {
  const entries = Object.keys(versions)
    .sort()
    .map(key => `  ${JSON.stringify(key)}: ${JSON.stringify(versions[key])},`)
    .join('\n');
  const content = `// Fichier généré automatiquement par scripts/upload-cloudinary.cjs.\n// Ne pas modifier manuellement : relancer la migration après chaque nouvel upload.\nexport const CLOUDINARY_VERSIONS = {\n${entries}\n}\n`;
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, content, 'utf8');
}

async function uploadFile(filePath, relativePath) {
  const ext = path.extname(relativePath).toLowerCase();
  const relativePathNoExt = relativePath.slice(0, relativePath.length - ext.length);
  const publicId = `${BASE_FOLDER}/${relativePathNoExt}`;
  const resourceType = VIDEO_EXTENSIONS.has(ext) ? 'video' : 'image';

  // overwrite + invalidate garantissent qu’une nouvelle migration remplace le fichier
  // et purge l’ancienne URL CDN du même public_id.
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    invalidate: 'true',
    overwrite: 'true',
    public_id: publicId,
    timestamp,
  };
  const signature = generateSignature(paramsToSign, apiSecret);

  const formData = new FormData();
  formData.append('file', new Blob([fs.readFileSync(filePath)]), path.basename(filePath));
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('public_id', publicId);
  formData.append('overwrite', 'true');
  formData.append('invalidate', 'true');
  formData.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const response = await fetch(url, { method: 'POST', body: formData });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || JSON.stringify(data));
  if (!data.version) throw new Error('Cloudinary n’a pas retourné de version pour cet asset.');
  return data;
}

async function uploadAll() {
  if (!fs.existsSync(imagesDir)) {
    console.error(`❌ Le dossier source des médias n'existe pas : ${imagesDir}`);
    console.error('   Utilise CLOUDINARY_SOURCE_DIR si tes assets sont dans un autre dossier.');
    process.exitCode = 1;
    return;
  }

  const allFiles = getFilesRecursively(imagesDir);
  const files = allFiles.filter(file => MEDIA_EXTENSIONS.has(path.extname(file).toLowerCase()));
  const skipped = allFiles.length - files.length;
  const versions = readExistingManifest();

  if (skipped > 0) console.log(`ℹ️  ${skipped} fichier(s) ignoré(s) (extension non-média).\n`);
  if (dryRun) {
    console.log(`🔎 Simulation : ${files.length} fichier(s) seraient écrasés dans ${BASE_FOLDER}.`);
    files.forEach(filePath => {
      const relativePath = path.relative(imagesDir, filePath).replace(/\\/g, '/');
      console.log(`  • ${relativePath} → ${BASE_FOLDER}/${relativePath.replace(/\.[^.]+$/, '')}`);
    });
    console.log('✅ Dry-run terminé : aucun upload et aucun fichier généré.');
    return;
  }
  console.log(`🚀 Migration réexécutable de ${files.length} fichiers vers Cloudinary (${cloudName})`);
  console.log(`   Dossier : ${BASE_FOLDER}`);
  console.log('   overwrite=true · invalidate=true · registre de versions automatique\n');

  let successCount = 0;
  let failCount = 0;

  for (const filePath of files) {
    const relativePath = path.relative(imagesDir, filePath).replace(/\\/g, '/');
    try {
      console.log(`⏳ Uploading [${relativePath}]...`);
      const result = await uploadFile(filePath, relativePath);
      versions[localKey(relativePath)] = result.version;
      console.log(`  ✅ v${result.version} — ${result.secure_url}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Échec pour ${relativePath}: ${error.message}`);
      failCount++;
    }
  }

  writeManifest(versions);
  console.log(`\n🎉 Migration terminée ! Succès: ${successCount}, Échecs: ${failCount}`);
  console.log(`📝 Registre mis à jour : ${path.relative(process.cwd(), manifestPath)}`);
  if (failCount > 0) process.exitCode = 1;
}

uploadAll().catch(error => {
  console.error(`❌ Migration interrompue : ${error.message}`);
  process.exitCode = 1;
});
