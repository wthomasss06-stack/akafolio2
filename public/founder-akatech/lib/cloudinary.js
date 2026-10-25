// lib/cloudinary.js — images et vidéos : Cloudinary d'abord, dossier local en secours.
//
// DEUX dossiers Cloudinary sont essayés, dans cet ordre, avant le fichier local :
//   1. NEW_FOLDER (« elvis-portfolio/images ») — celui de `npm run cloudinary:sync`
//      (scripts/upload-cloudinary.cjs) : les médias récents (services, process, vidéos…) y sont.
//   2. FOLDER (« akatech ») — l'ancien dossier des premières images du portfolio.
// Avant, seul l'ancien dossier était lu : les images envoyées par le script d'upload n'y étaient
// pas, ce qui donnait des 404 puis un repli local parfois absent. Les numéros de version
// (cloudinaryVersions.js) évitent qu'une image remplacée reste en cache.
//
// cld(chemin)          → URL Cloudinary (chaîne, nouveau dossier) ; le chemin local d'origine est mémorisé.
// localOf(valeur)      → chemin local d'une URL produite par cld(), ou la valeur telle quelle.
// mediaSources(v,w)    → [URL nouveau dossier, URL ancien dossier, chemin local] à essayer dans l'ordre.
// hasVideo(chemin)     → true si le .webm a été envoyé sur Cloudinary (présent dans cloudinaryVersions.js).
// videoSources(chemin) → [URL vidéo Cloudinary, chemin local] pour un <video>.
// asset(chemin)        → chemin local tel quel (absolu : valable grâce à <base href>).
//
// Script classique (pas de module) : expose window.PF_CLOUD.
(() => {
'use strict'
const CLOUDINARY_VERSIONS = window.CLOUDINARY_VERSIONS || {}

const CLOUD = 'gks3f2st'
const FOLDER = 'akatech'
const NEW_FOLDER = 'elvis-portfolio/images'

const origins = new Map()
const enc = (p) => p.split('/').map(encodeURIComponent).join('/')
const norm = (path) => (path.startsWith('/') ? path : '/' + path)
const stripExt = (p) => p.replace(/\.\w+$/, '')
const transformsOf = (width) => ['f_auto', 'q_auto', ...(width ? ['c_limit', `w_${width}`] : [])].join(',')
const versionOf = (clean) => (CLOUDINARY_VERSIONS[clean] ? `v${CLOUDINARY_VERSIONS[clean]}/` : '')

/** URL du nouveau dossier (« elvis-portfolio/images/service/api »). */
function cld(path, { width } = {}) {
  const clean = norm(path)
  const rel = clean.replace(/^\/assets\/images\//, '')
  const url = `https://res.cloudinary.com/${CLOUD}/image/upload/${transformsOf(width)}/${versionOf(clean)}${enc(NEW_FOLDER + '/' + stripExt(rel))}`
  origins.set(url, clean)
  return url
}

/** URL de l'ancien dossier (« akatech/assets/images/projects/… »). */
function legacy(path, { width } = {}) {
  const clean = norm(path)
  return `https://res.cloudinary.com/${CLOUD}/image/upload/${transformsOf(width)}/${versionOf(clean)}${enc(FOLDER + stripExt(clean))}`
}

/** Chemin local « /assets/x » : absolu, donc valable depuis /founder-akatech/ comme depuis la racine. */
function asset(p) { return p }

function localOf(value) {
  if (!value) return ''
  return origins.get(value) || (value.startsWith('http') ? '' : value)
}

/** [nouveau dossier, ancien dossier, local] — chaque source est essayée tant que la précédente échoue. */
function mediaSources(value, width) {
  const local = localOf(value)
  if (!local) return [value]
  return [cld(local, { width }), legacy(local, { width }), asset(local)]
}

/** Vidéo .webm : envoyée sur Cloudinary par le script d'upload ? (sinon on reste sur l'image). */
function hasVideo(path) { return !!CLOUDINARY_VERSIONS[norm(path)] }

/** [URL Cloudinary (resource_type video), chemin local] */
function videoSources(path) {
  const clean = norm(path)
  const rel = clean.replace(/^\/assets\/images\//, '')
  const cdn = `https://res.cloudinary.com/${CLOUD}/video/upload/q_auto/${versionOf(clean)}${enc(NEW_FOLDER + '/' + stripExt(rel))}.webm`
  return [cdn, asset(clean)]
}

window.PF_CLOUD = { CLOUD, FOLDER, NEW_FOLDER, cld, legacy, localOf, mediaSources, hasVideo, videoSources, asset }
})()
