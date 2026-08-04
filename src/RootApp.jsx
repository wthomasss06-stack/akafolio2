'use client'

// ════════════════════════════════════════════════════════════════
// RootApp.jsx — migré Vite/React → Next.js App Router
//
// 3 changements par rapport à la version React/Vite, tout le reste
// (modes, switcher, logique CSS dynamique) est IDENTIQUE :
//
//   1. react-helmet-async retiré. Le SEO (title/meta/OG/Twitter/
//      JSON-LD) est maintenant géré par l'API Metadata native de
//      Next.js dans src/app/layout.js — vraiment rendu côté serveur
//      dans le HTML, donc lu par Google sans exécuter de JS (avant,
//      Helmet ne faisait ça QUE côté client, sans pipeline SSG réel
//      pour le figer dans le HTML statique).
//
//   2. React.lazy + Suspense → next/dynamic(..., { ssr: false }).
//      Chaque mode reste chargé à la demande (un seul bundle
//      téléchargé) ; next/dynamic est l'équivalent Next.js et gère
//      son propre fallback via `loading`.
//
//   3. CSS `?inline` (syntaxe propre à Vite, absente de Next.js) →
//      deux <link rel="stylesheet"> togglées via l'attribut
//      `disabled` selon le mode actif. Même résultat qu'avant (une
//      seule feuille active à la fois — indispensable : style.css et
//      stylemobile.css définissent les mêmes variables --border,
//      --fd, --fb, --muted... avec des valeurs différentes). Les
//      fichiers pointés sont pré-compilés par
//      scripts/compile-mode-styles.mjs (voir ce fichier).
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// ── Les trois portfolios — chargés à la demande, un seul monté à la fois.
const ModernApp = dynamic(() => import('./App.jsx'), { ssr: false, loading: () => <RootLoader /> })
const AppMobile = dynamic(() => import('./Appmobile.jsx'), { ssr: false, loading: () => <RootLoader /> })
const Win95App  = dynamic(() => import('./Win95Portfolio.jsx'), { ssr: false, loading: () => <RootLoader /> })

const MODE_KEY         = 'akafolio-mode'
const VALID_MODES      = ['app', 'appmobile', 'win95']
const DESKTOP_ONLY_MODES = ['app']
const MOBILE_ONLY_MODES  = ['appmobile']
const DESKTOP_CYCLE    = ['app', 'win95']
const MOBILE_CYCLE     = ['appmobile', 'win95']

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 900
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const check = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', check)
    return () => mq.removeEventListener('change', check)
  }, [])
  return isMobile
}

function readSavedMode() {
  try {
    const saved = localStorage.getItem(MODE_KEY)
    if (saved && VALID_MODES.includes(saved)) return saved
  } catch {}
  return null
}

const switcherStyle = {
  position: 'fixed', bottom: '50px', right: '12px', zIndex: 99999,
  display: 'flex', alignItems: 'center', gap: '6px',
  background: '#c0c0c0', border: '2px solid #000',
  borderTopColor: '#fff', borderLeftColor: '#fff',
  padding: '4px 10px', cursor: 'pointer',
  fontFamily: "'Nunito', sans-serif", fontWeight: 900,
  fontSize: '11px', boxShadow: '2px 2px 0 rgba(0,0,0,.5)',
  userSelect: 'none', whiteSpace: 'nowrap',
}

const NEXT_LABEL_DESKTOP = {
  app:   { label: '🖥 Mode Win95',   title: 'Passer au mode Win95' },
  win95: { label: '🌐 Mode Moderne', title: 'Revenir au mode moderne' },
}

const NEXT_LABEL_MOBILE = {
  win95:     { label: '🌐 Mode Moderne', title: 'Passer au portfolio moderne' },
  appmobile: { label: '🖥 Mode Win95',   title: 'Passer au mode Win95' },
}

function SwitcherBtn({ mode, isMobile, onToggle }) {
  const [hovered, setHovered] = useState(false)
  const map     = isMobile ? NEXT_LABEL_MOBILE : NEXT_LABEL_DESKTOP
  const current = map[mode] || NEXT_LABEL_DESKTOP.app
  return (
    <button
      style={{ ...switcherStyle, background: hovered ? '#d4d4d4' : '#c0c0c0', transition: 'background .1s' }}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={current.title}
    >
      {current.label}
    </button>
  )
}

function RootLoader() {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: '#0a0a0a', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      <div
        style={{
          width: 34, height: 34, borderRadius: '50%',
          border: '2.5px solid rgba(255,85,0,.25)',
          borderTopColor: '#FF5500',
          animation: 'root-loader-spin .7s linear infinite',
        }}
      />
      <style>{'@keyframes root-loader-spin { to { transform: rotate(360deg); } }'}</style>
    </div>
  )
}

export default function RootApp() {
  const isMobile = useIsMobile()

  const [mode, setMode] = useState(() => {
    const saved = readSavedMode()
    if (saved) return saved
    return isMobile ? 'appmobile' : 'app'
  })

  useEffect(() => {
    if (!VALID_MODES.includes(mode)) {
      setMode(isMobile ? 'appmobile' : 'app')
      return
    }
    if (isMobile  && DESKTOP_ONLY_MODES.includes(mode)) setMode('appmobile')
    if (!isMobile && MOBILE_ONLY_MODES.includes(mode))  setMode('app')
  }, [isMobile, mode])

  useEffect(() => {
    document.body.classList.toggle('mobile-root', isMobile)
  }, [isMobile])

  useEffect(() => {
    try { localStorage.setItem(MODE_KEY, mode) } catch {}
    const isWin95 = mode === 'win95'
    const elems = [document.documentElement, document.body]
    if (isWin95) {
      elems.forEach(el => { el.style.overflow = 'hidden'; el.style.height = '100%' })
      const root = document.getElementById('root')
      if (root) { root.style.overflow = 'hidden'; root.style.height = '100%' }
    } else {
      elems.forEach(el => { el.style.overflow = ''; el.style.height = ''; el.style.cursor = '' })
      const root = document.getElementById('root')
      if (root) { root.style.overflow = ''; root.style.height = '' }
      const w95css = document.getElementById('w95-v3-css')
      if (w95css) w95css.remove()
    }
  }, [mode])

  const toggle = () => {
    const cycle = isMobile ? MOBILE_CYCLE : DESKTOP_CYCLE
    setMode(m => {
      const idx = cycle.indexOf(m)
      return cycle[(idx === -1 ? 0 : idx + 1) % cycle.length]
    })
  }

  return (
    <div id="root">
      {/* CSS desktop/mobile togglée via `disabled` selon le mode actif —
          remplace l'injection de <style> par texte (`?inline` Vite).
          Une seule des deux est jamais active : leurs variables --border,
          --fd, --fb, --muted etc. portent les mêmes noms avec des valeurs
          incompatibles. */}
      <link rel="stylesheet" href="/styles/style.compiled.css" disabled={mode !== 'app'} />
      <link rel="stylesheet" href="/styles/stylemobile.compiled.css" disabled={mode !== 'appmobile'} />

      {mode === 'win95'     && <div style={{ height: '100%' }}><Win95App /></div>}
      {mode === 'appmobile' && <AppMobile />}
      {mode === 'app'       && <ModernApp />}
      <SwitcherBtn mode={mode} isMobile={isMobile} onToggle={toggle} />
    </div>
  )
}
