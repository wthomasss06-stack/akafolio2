// src/lib/cloudinary.js
// Convertit un chemin local ('/assets/images/xxx.ext') en URL Cloudinary — même
// arborescence, juste une autre origine + optimisation auto (format + qualité).
//
// Pourquoi : public/assets/images (hero compris) est aujourd'hui committé dans
// le repo Git et servi par Vercel à chaque build/déploiement. Ça alourdit le
// repo et les déploiements. Cloudinary sert exactement les mêmes fichiers
// depuis un CDN, dans le format/poids le plus léger que le navigateur du
// visiteur accepte (AVIF/WebP) — même rendu, en plus léger et sans alourdir
// le repo.
//
// Usage : cld('/assets/images/projects/akatech.webp') — le chemin d'entrée
// est identique à ce qui était utilisé en local, seule l'origine change.
// Ça suppose que les mêmes fichiers, avec les mêmes noms et la même
// arborescence, ont été uploadés sur Cloudinary sous BASE_FOLDER (via
// scripts/upload-cloudinary.js) — sinon les URL générées ici pointent vers
// des fichiers qui n'existent pas.
//
// (Adapté du helper AKATech — dossier corrigé pour coller à l'arborescence
// réelle d'elvis-portfolio-nextjs : public/assets/images/, pas public/images/.)

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwuybrjxh'

// Racine Cloudinary — à faire correspondre exactement au BASE_FOLDER utilisé
// dans scripts/upload-cloudinary.js au moment de l'upload.
const BASE_FOLDER = 'elvis-portfolio/images'

const VIDEO_EXTENSIONS = new Set(['webm', 'mp4', 'mov'])

/**
 * @param {string} localPath - chemin local tel qu'utilisé avant, ex: '/assets/images/foo/bar.webp'
 * @param {{ width?: number }} [options] - largeur optionnelle (sinon Cloudinary sert l'original, juste optimisé format/qualité)
 * @returns {string} URL Cloudinary prête à mettre dans un src/poster/background-image
 */
export function cld(localPath, options = {}) {
  const clean = localPath.replace(/^\/?assets\/images\//i, '')
  const dotIndex = clean.lastIndexOf('.')
  const base = dotIndex !== -1 ? clean.slice(0, dotIndex) : clean
  const ext = dotIndex !== -1 ? clean.slice(dotIndex + 1).toLowerCase() : 'jpg'
  const resourceType = VIDEO_EXTENSIONS.has(ext) ? 'video' : 'image'

  const transforms = ['f_auto', 'q_auto']
  if (options.width) transforms.push(`w_${options.width}`)

  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${transforms.join(',')}/${BASE_FOLDER}/${base}.${ext}`
}
