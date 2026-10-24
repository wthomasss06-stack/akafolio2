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

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const force = args.has('--force');
const showHelp = args.has('--help') || args.has('-h');

if (showHelp) {
  console.log(`Synchronisation différentielle des médias Cloudinary

Utilisation :
  node scripts/upload-cloudinary.cjs [--dry-run] [--force]
  npm run cloudinary:sync -- [--dry-run] [--force]

Options :
  --dry-run  Compare local/Cloudinary et affiche le plan, sans upload ni écriture du manifeste.
  --force    Ré-uploade tous les fichiers locaux, même s'ils sont identiques.
  --help     Affiche cette aide.

Le script ne supprime jamais automatiquement les assets présents uniquement sur Cloudinary.`);
  process.exit(0);
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
const MAX_RESULTS = 500;
const ADMIN_AUTH = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;

function getFilesRecursively(dir) {
  const results = [];
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) results.push(...getFilesRecursively(filePath));
    else if (stat.isFile()) results.push(filePath);
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

function resourceTypeFor(relativePath) {
  return VIDEO_EXTENSIONS.has(path.extname(relativePath).toLowerCase()) ? 'video' : 'image';
}

function publicIdFor(relativePath) {
  const ext = path.extname(relativePath);
  return `${BASE_FOLDER}/${relativePath.slice(0, relativePath.length - ext.length).replace(/\\/g, '/')}`;
}

function resourceKey(resourceType, publicId) {
  return `${resourceType}:${publicId}`;
}

function normalizeEtag(etag) {
  return typeof etag === 'string' ? etag.replace(/^\"|\"$/g, '').toLowerCase() : '';
}

function hashFile(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);
    stream.on('error', reject);
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

function readExistingManifest() {
  if (!fs.existsSync(manifestPath)) return {};
  const source = fs.readFileSync(manifestPath, 'utf8');
  const match = source.match(/export const CLOUDINARY_VERSIONS = (\{[\s\S]*?\})\s*(?=export const CLOUDINARY_PUBLIC_IDS|$)/);
  if (!match) return {};
  try {
    return Function(`"use strict"; return (${match[1]})`)();
  } catch {
    console.warn('⚠️  Manifest Cloudinary illisible : il sera régénéré avec les versions confirmées.');
    return {};
  }
}

function writeManifest(versions, publicIds) {
  const entries = Object.keys(versions)
    .sort()
    .map(key => `  ${JSON.stringify(key)}: ${JSON.stringify(versions[key])},`)
    .join('\n');
  const publicIdEntries = Object.keys(publicIds)
    .sort()
    .map(key => `  ${JSON.stringify(key)}: ${JSON.stringify(publicIds[key])},`)
    .join('\n');
  const content = `// Fichier généré automatiquement par scripts/upload-cloudinary.cjs.\n// Ne pas modifier manuellement : relancer la synchronisation après chaque changement de média.\nexport const CLOUDINARY_VERSIONS = {\n${entries}\n}\n\nexport const CLOUDINARY_PUBLIC_IDS = {\n${publicIdEntries}\n}\n`;
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, content, 'utf8');
}

async function readJsonResponse(response, operation) {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`${operation} a retourné une réponse non JSON (HTTP ${response.status}). Vérifie les identifiants Cloudinary.`);
  }
  if (!response.ok) {
    const message = data.error?.message || JSON.stringify(data);
    const hint = response.status === 420 ? ' Limite de requêtes Admin API atteinte ; réessaie après son renouvellement.' : '';
    throw new Error(`${operation} a échoué (HTTP ${response.status}) : ${message}.${hint}`);
  }
  return data;
}

async function fetchCloudinaryInventory() {
  const expression = `public_id:${BASE_FOLDER}/* AND type=upload`;
  const resources = [];
  const seenCursors = new Set();
  let nextCursor;

  do {
    const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/resources/search`;
    const body = { expression, max_results: MAX_RESULTS };
    if (nextCursor) body.next_cursor = nextCursor;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: ADMIN_AUTH,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000),
    });
    const data = await readJsonResponse(response, 'Lecture de l’inventaire Cloudinary');
    const page = Array.isArray(data.resources) ? data.resources : [];
    resources.push(...page);

    nextCursor = data.next_cursor || undefined;
    if (nextCursor && seenCursors.has(nextCursor)) {
      throw new Error('Cloudinary a retourné un curseur de pagination déjà utilisé ; synchronisation arrêtée par sécurité.');
    }
    if (nextCursor) seenCursors.add(nextCursor);
    if (!nextCursor && Number.isFinite(data.total_count) && resources.length < data.total_count) {
      throw new Error(`Inventaire Cloudinary incomplet : ${resources.length}/${data.total_count} ressources lues, sans curseur de suite.`);
    }
  } while (nextCursor);

  const folderPrefix = `${BASE_FOLDER}/`;
  return resources.filter(resource =>
    resource?.public_id?.startsWith(folderPrefix) &&
    ['image', 'video'].includes(resource.resource_type) &&
    resource.type === 'upload'
  );
}

async function uploadFile(filePath, publicId, resourceType) {
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

  const url = `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resourceType}/upload`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(10 * 60 * 1000),
  });
  const data = await readJsonResponse(response, `Upload de ${path.basename(filePath)}`);
  if (!data.version) throw new Error('Cloudinary n’a pas retourné de version pour cet asset.');
  return data;
}

function collectLocalAssets(files) {
  const candidates = files.map(filePath => {
    const relativePath = path.relative(imagesDir, filePath).replace(/\\/g, '/');
    const resourceType = resourceTypeFor(relativePath);
    return {
      filePath,
      relativePath,
      resourceType,
      basePublicId: publicIdFor(relativePath),
      localKey: localKey(relativePath),
    };
  });
  const groups = new Map();

  for (const candidate of candidates) {
    const groupKey = resourceKey(candidate.resourceType, candidate.basePublicId);
    const group = groups.get(groupKey) || [];
    group.push(candidate);
    groups.set(groupKey, group);
  }

  const occupied = new Set();
  for (const [groupKey, group] of groups) {
    if (group.length === 1) occupied.add(groupKey);
  }

  const assets = [];
  const publicIds = {};
  for (const group of groups.values()) {
    for (const candidate of group) {
      if (group.length === 1) {
        assets.push({
          ...candidate,
          publicId: candidate.basePublicId,
          key: resourceKey(candidate.resourceType, candidate.basePublicId),
        });
        continue;
      }

      const extension = path.extname(candidate.relativePath).slice(1).toLowerCase();
      let publicId = `${candidate.basePublicId}--${extension}`;
      let suffix = 2;
      while (occupied.has(resourceKey(candidate.resourceType, publicId))) {
        publicId = `${candidate.basePublicId}--${extension}-${suffix++}`;
      }

      const key = resourceKey(candidate.resourceType, publicId);
      occupied.add(key);
      publicIds[candidate.localKey] = publicId.slice(BASE_FOLDER.length + 1);
      console.log(`ℹ️  ${candidate.relativePath} → ${publicId} (nom de fichier ambigu).`);
      assets.push({ ...candidate, publicId, key });
    }
  }

  return { assets, publicIds };
}

async function uploadAll() {
  if (!fs.existsSync(imagesDir)) {
    console.error(`❌ Le dossier source des médias n'existe pas : ${imagesDir}`);
    console.error('   Utilise CLOUDINARY_SOURCE_DIR si tes assets sont dans un autre dossier.');
    process.exitCode = 1;
    return;
  }
  if (/\s/.test(BASE_FOLDER)) {
    throw new Error('CLOUDINARY_BASE_FOLDER ne doit pas contenir d’espaces pour la recherche préfixée Cloudinary.');
  }

  const allFiles = getFilesRecursively(imagesDir);
  const files = allFiles.filter(file => MEDIA_EXTENSIONS.has(path.extname(file).toLowerCase())).sort();
  const skipped = allFiles.length - files.length;
  const { assets: localAssets, publicIds } = collectLocalAssets(files);

  if (skipped > 0) console.log(`ℹ️  ${skipped} fichier(s) ignoré(s) (extension non média).`);
  console.log(`🔎 Comparaison de ${localAssets.length} média(s) avec Cloudinary (${cloudName})…`);
  console.log(`   Dossier : ${BASE_FOLDER}`);
  console.log(`   Mode : ${dryRun ? 'simulation' : 'synchronisation'}${force ? ' forcée' : ''}`);

  // Si l’inventaire distant échoue, on s’arrête plutôt que de ré-uploader tout le dossier à l’aveugle.
  const remoteResources = await fetchCloudinaryInventory();
  const remoteByKey = new Map(remoteResources.map(resource => [resourceKey(resource.resource_type, resource.public_id), resource]));
  const localKeys = new Set(localAssets.map(asset => asset.key));
  const remoteOnlyCount = [...remoteByKey.keys()].filter(key => !localKeys.has(key)).length;
  const versions = readExistingManifest();
  const plan = [];

  for (const asset of localAssets) {
    const remote = remoteByKey.get(asset.key);
    const stat = fs.statSync(asset.filePath);
    const localEtag = await hashFile(asset.filePath);
    const sameSize = remote && Number(remote.bytes) === stat.size;
    const sameContent = remote && normalizeEtag(remote.etag) === localEtag && sameSize;

    if (remote && sameContent && !force) {
      plan.push({ ...asset, action: 'unchanged', remote, localEtag, size: stat.size });
      continue;
    }
    plan.push({
      ...asset,
      action: remote ? (force ? 'forced' : 'modified') : 'new',
      remote,
      localEtag,
      size: stat.size,
    });
  }

  const unchanged = plan.filter(item => item.action === 'unchanged');
  const uploads = plan.filter(item => item.action !== 'unchanged');
  const newCount = uploads.filter(item => item.action === 'new').length;
  const modifiedCount = uploads.filter(item => item.action === 'modified').length;
  const forcedCount = uploads.filter(item => item.action === 'forced').length;

  console.log(`\n📋 Plan : ${unchanged.length} inchangé(s), ${newCount} nouveau(x), ${modifiedCount} modifié(s)${forcedCount ? `, ${forcedCount} forcé(s)` : ''}.`);
  if (remoteOnlyCount > 0) console.log(`   ℹ️  ${remoteOnlyCount} asset(s) Cloudinary sans fichier local : conservés en ligne, jamais supprimés automatiquement.`);

  if (dryRun) {
    unchanged.forEach(item => console.log(`  = ${item.relativePath} — inchangé, ignoré`));
    uploads.forEach(item => console.log(`  ↑ ${item.relativePath} — ${item.action === 'new' ? 'nouveau' : item.action === 'modified' ? 'empreinte ou taille différente' : 'option --force'}`));
    console.log('\n✅ Simulation terminée : aucun upload et aucun manifeste modifié.');
    return;
  }

  let successCount = 0;
  let failCount = 0;

  // Les ressources identiques reprennent la version actuellement confirmée par Cloudinary.
  unchanged.forEach(item => {
    if (item.remote.version) versions[item.localKey] = item.remote.version;
  });

  for (const item of uploads) {
    try {
      console.log(`⏳ Upload [${item.relativePath}] — ${item.action}…`);
      const result = await uploadFile(item.filePath, item.publicId, item.resourceType);
      versions[item.localKey] = result.version;
      console.log(`  ✅ v${result.version} — ${result.secure_url}`);
      successCount++;
    } catch (error) {
      console.error(`  ❌ Échec pour ${item.relativePath}: ${error.message}`);
      failCount++;
    }
  }

  writeManifest(versions, publicIds);
  console.log(`\n🎉 Synchronisation terminée : ${successCount} upload(s), ${unchanged.length} inchangé(s) ignoré(s), ${failCount} échec(s).`);
  console.log(`📝 Registre de versions mis à jour : ${path.relative(process.cwd(), manifestPath)}`);
  if (failCount > 0) process.exitCode = 1;
}

uploadAll().catch(error => {
  console.error(`❌ Synchronisation Cloudinary interrompue : ${error.message}`);
  process.exitCode = 1;
});
