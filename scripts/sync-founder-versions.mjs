// scripts/sync-founder-versions.mjs
// Recopie les numéros de version Cloudinary (src/data/cloudinaryVersions.js, écrit par
// `npm run cloudinary:sync`) vers le portfolio statique public/founder-akatech/lib/cloudinaryVersions.js,
// qui ne peut pas importer de module ES. Lancé automatiquement avant `dev` et `build`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, 'src', 'data', 'cloudinaryVersions.js')
const target = join(root, 'public', 'founder-akatech', 'lib', 'cloudinaryVersions.js')

if (!existsSync(source)) {
  console.warn('[sync-founder-versions] src/data/cloudinaryVersions.js introuvable : rien à faire.')
  process.exit(0)
}
const text = readFileSync(source, 'utf8').replace(/\r/g, '')
const match = text.match(/export const CLOUDINARY_VERSIONS\s*=\s*(\{[\s\S]*?\n\})/)
if (!match) {
  console.warn('[sync-founder-versions] bloc CLOUDINARY_VERSIONS introuvable : fichier inchangé.')
  process.exit(0)
}
const out = `// Fichier généré par scripts/sync-founder-versions.mjs (copie de src/data/cloudinaryVersions.js).
// Ne pas modifier à la main : relancer \`npm run cloudinary:sync\` puis \`npm run dev\`.
// (Script classique : window.CLOUDINARY_VERSIONS, pour que le site s'ouvre aussi en double-clic.)
window.CLOUDINARY_VERSIONS = ${match[1]}
`
if (!existsSync(target) || readFileSync(target, 'utf8') !== out) {
  writeFileSync(target, out)
  console.log('[sync-founder-versions] public/founder-akatech/lib/cloudinaryVersions.js mis à jour.')
}
