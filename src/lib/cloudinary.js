// src/lib/cloudinary.js
// Convertit un chemin local ('/assets/images/xxx.ext') en URL Cloudinary.
// La version Cloudinary est lue automatiquement dans cloudinaryVersions.js,
// fichier généré par scripts/upload-cloudinary.cjs après chaque migration.

import { CLOUDINARY_VERSIONS } from '../data/cloudinaryVersions.js'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwuybrjxh'
const BASE_FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_BASE_FOLDER || 'elvis-portfolio/images'
const VIDEO_EXTENSIONS = new Set(['webm', 'mp4', 'mov'])

function normalizeLocalPath(localPath) {
  return `/${localPath.replace(/^\/?assets\/images\//i, 'assets/images/')}`
}

/**
 * @param {string} localPath - chemin local, ex: '/assets/images/projects/kokoeat-preview.webp'
 * @param {{ width?: number, version?: string|number }} [options]
 * @returns {string} URL Cloudinary prête à mettre dans un src/poster/background-image
 */
export function cld(localPath, options = {}) {
  const normalizedPath = normalizeLocalPath(localPath)
  const clean = normalizedPath.replace(/^\/assets\/images\//i, '')
  const dotIndex = clean.lastIndexOf('.')
  const base = dotIndex !== -1 ? clean.slice(0, dotIndex) : clean
  const ext = dotIndex !== -1 ? clean.slice(dotIndex + 1).toLowerCase() : 'jpg'
  const resourceType = VIDEO_EXTENSIONS.has(ext) ? 'video' : 'image'

  const transforms = ['f_auto', 'q_auto']
  if (options.width) transforms.push(`w_${options.width}`)

  const versionValue = options.version ?? CLOUDINARY_VERSIONS[normalizedPath]
  const version = versionValue == null ? '' : `v${String(versionValue).replace(/^v/i, '')}/`

  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${transforms.join(',')}/${version}${BASE_FOLDER}/${base}.${ext}`
}
