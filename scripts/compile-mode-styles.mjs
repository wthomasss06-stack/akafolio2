// ════════════════════════════════════════════════════════════════
// compile-mode-styles.mjs
//
// POURQUOI CE SCRIPT EXISTE :
// style.css (mode desktop) et stylemobile.css (mode mobile) doivent
// être actives UNE SEULE À LA FOIS (leurs variables --border, --fd,
// --fb, --muted, etc. ont les MÊMES noms mais des valeurs différentes
// et incompatibles entre les deux fichiers — les charger tous les
// deux en même temps casserait les couleurs/fonts/ombres de tout le
// site). Avant, RootApp.jsx utilisait l'import Vite `?inline` pour
// récupérer le CSS compilé sous forme de texte et l'injecter/retirer
// dynamiquement selon le mode actif.
//
// Next.js n'a pas d'équivalent à `?inline`/`?raw` qui préserve le
// pipeline PostCSS (cf. discussions GitHub vercel/next.js #75433,
// #64964 — confirmé absent en Turbopack comme en Webpack).
//
// Solution : on compile nous-mêmes ces deux fichiers avec EXACTEMENT
// les mêmes plugins PostCSS que le reste du projet (postcss.config.mjs)
// vers des fichiers CSS purs dans public/styles/. RootApp.jsx les
// charge ensuite via deux <link rel="stylesheet" disabled={...}>
// togglées selon le mode (voir src/RootApp.jsx).
//
// Ce script tourne automatiquement avant `npm run dev` et
// `npm run build` (hooks npm predev / prebuild dans package.json) —
// donc toute modification de src/style.css ou src/stylemobile.css
// est reprise au prochain démarrage. Seule différence avec avant :
// pendant `next dev`, il faut relancer `npm run dev` après avoir
// modifié un de ces deux fichiers (pas de hot-reload live dessus
// spécifiquement — tout le reste du projet garde le hot-reload
// normal de Next.js).
// ════════════════════════════════════════════════════════════════

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))

const JOBS = [
  ['src/style.css', 'public/styles/style.compiled.css'],
  ['src/stylemobile.css', 'public/styles/stylemobile.compiled.css'],
]

const processor = postcss([tailwindcss(), autoprefixer()])

for (const [fromRel, toRel] of JOBS) {
  const from = join(ROOT, fromRel)
  const to = join(ROOT, toRel)
  const css = readFileSync(from, 'utf8')
  const result = await processor.process(css, { from, to })
  mkdirSync(dirname(to), { recursive: true })
  writeFileSync(to, result.css, 'utf8')
  console.log(`[compile-mode-styles] ${fromRel} -> ${toRel} (${(result.css.length / 1024).toFixed(0)} Ko)`)
}
