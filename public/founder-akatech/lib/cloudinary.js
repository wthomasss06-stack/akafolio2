// lib/cloudinary.js — images : Cloudinary d'abord, dossier local en secours.
//
// Même convention que l'ancien portfolio (js/main.js) et le script d'upload :
//   cloud   → CLOUD   (modifiable ici)
//   dossier → FOLDER  → akatech/assets/images/projects/<nom> (identifiant public = chemin sans extension)
// Les numéros de version (cloudinaryVersions.js) évitent qu'une image remplacée reste en cache.
//
// cld(chemin)      → URL Cloudinary (chaîne) ; le chemin local d'origine est mémorisé.
// localOf(valeur)  → chemin local d'une URL produite par cld(), ou la valeur telle quelle.
// mediaSources(v,w)→ [url CDN, chemin local] à essayer dans l'ordre.
// asset(chemin)    → '/assets/x' devient 'assets/x' (relatif) : fonctionne en double-clic comme sur Vercel.
//
// Script classique (pas de module) : expose window.PF_CLOUD.
(() => {
'use strict'
const CLOUDINARY_VERSIONS = window.CLOUDINARY_VERSIONS || {}

const CLOUD = 'gks3f2st'
const FOLDER = 'akatech'

const origins = new Map()
const enc = (p) => p.split('/').map(encodeURIComponent).join('/')

function cld(path, { width } = {}) {
  const clean = path.startsWith('/') ? path : '/' + path
  const id = enc(FOLDER + clean.replace(/\.\w+$/, ''))
  const version = CLOUDINARY_VERSIONS[clean]
  const transforms = ['f_auto', 'q_auto', ...(width ? ['c_limit', `w_${width}`] : [])].join(',')
  const url = `https://res.cloudinary.com/${CLOUD}/image/upload/${transforms}/${version ? `v${version}/` : ''}${id}`
  origins.set(url, clean)
  return url
}

/** Chemin local « /assets/x » → « assets/x » : relatif, donc valable aussi depuis file://. */
function asset(p) { return p }

function localOf(value) {
  if (!value) return ''
  return origins.get(value) || (value.startsWith('http') ? '' : value)
}

/** Version redimensionnée d'une URL cld() (Cloudinary : w_<n>) ; chemin local inchangé. */
function mediaSources(value, width) {
  const local = localOf(value)
  if (!local) return [value]
  const cdn = cld(local, { width })
  return [cdn, asset(local)]
}
window.PF_CLOUD = { CLOUD, FOLDER, cld, localOf, mediaSources, asset }
})()
