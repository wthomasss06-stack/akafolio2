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
//
// ── AKATECH V2 (ajout) ────────────────────────────────────────────
// 4e mode, chargé la même façon (dynamic + ssr:false). Contrairement
// à app/appmobile, il n'a pas besoin d'un <link> togglé séparément :
// AKATECH.jsx importe sa propre CSS scopée sous .akatech-root (voir
// src/akatech/AKATECH.css), donc rien à ajouter ici côté feuilles de
// style. C'est le mode PAR DÉFAUT pour un nouveau visiteur, et le
// premier des deux cycles du switcher (desktop : akatech → app →
// win95 ; mobile : akatech → appmobile → win95).
// ════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

// ── Les quatre portfolios — chargés à la demande, un seul monté à la fois.
const AkatechApp = dynamic(() => import('./akatech/AKATECH.jsx'), { ssr: false, loading: () => <RootLoader /> })
const ModernApp  = dynamic(() => import('./App.jsx'), { ssr: false, loading: () => <RootLoader /> })
const AppMobile  = dynamic(() => import('./Appmobile.jsx'), { ssr: false, loading: () => <RootLoader /> })
const Win95App   = dynamic(() => import('./Win95Portfolio.jsx'), { ssr: false, loading: () => <RootLoader /> })

const MODE_KEY           = 'akafolio-mode-v2'
const VALID_MODES        = ['akatech', 'app', 'appmobile', 'win95']
const DESKTOP_ONLY_MODES = ['app']
const MOBILE_ONLY_MODES  = ['appmobile']
// Le mode moderne est prioritaire : App sur desktop, Appmobile sur
// mobile. AKATech et Win95 restent accessibles dans le cycle secondaire.
const DESKTOP_CYCLE = ['app', 'akatech', 'win95']
const MOBILE_CYCLE  = ['appmobile', 'akatech', 'win95']

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

const panelStyle = {
  position: 'fixed',
  top: 'auto',
  right: 0,
  bottom: '24px',
  zIndex: 99999,
  display: 'flex',
  alignItems: 'stretch',
  transform: 'translateX(calc(100% - 42px))',
  transition: 'transform .32s cubic-bezier(.22,1,.36,1)',
  fontFamily: "'Nunito', system-ui, sans-serif",
}

const panelTabStyle = {
  width: '42px',
  minWidth: '42px',
  minHeight: '82px',
  border: '1px solid rgba(255,255,255,.22)',
  borderRight: 0,
  borderRadius: '14px 0 0 14px',
  background: 'rgba(10,10,10,.9)',
  color: '#ff5500',
  cursor: 'pointer',
  fontSize: '24px',
  lineHeight: 1,
  boxShadow: '0 10px 32px rgba(0,0,0,.34)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
}

const switcherStyle = {
  minWidth: '196px',
  minHeight: '82px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '12px 16px',
  border: '1px solid rgba(255,255,255,.22)',
  borderRadius: '14px 0 0 14px',
  background: 'rgba(10,10,10,.9)',
  color: '#f5f2ed',
  cursor: 'pointer',
  fontWeight: 800,
  fontSize: '11px',
  letterSpacing: '.02em',
  boxShadow: '0 10px 32px rgba(0,0,0,.34)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  userSelect: 'none',
  whiteSpace: 'nowrap',
}

const MODE_LABELS = {
  akatech:   { label: 'AKATech', short: 'AKATech', title: 'Passer au portfolio AKATech', accent: '#ff5500' },
  app:       { label: 'Moderne', short: 'App desktop', title: 'Passer au mode AKATech', accent: '#f5f2ed' },
  appmobile: { label: 'Mobile', short: 'App mobile', title: 'Passer au mode AKATech', accent: '#55c7ff' },
  win95:     { label: 'Win95', short: 'Windows 95', title: 'Passer au mode AKATech', accent: '#f5f2ed' },
}

function SwitcherBtn({ mode, cycle, onToggle, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)
  const idx = cycle.indexOf(mode)
  const nextMode = cycle[(idx === -1 ? 0 : idx + 1) % cycle.length]
  const current = MODE_LABELS[mode] || MODE_LABELS.app
  const next = MODE_LABELS[nextMode] || MODE_LABELS.akatech
  return (
    <aside
      aria-label="Sélecteur de portfolio"
      style={{ ...panelStyle, transform: `translateX(${open ? '0' : 'calc(100% - 42px)'})` }}
    >
      <button
        type="button"
        style={{ ...panelTabStyle, background: hovered ? 'rgba(24,24,24,.98)' : panelTabStyle.background }}
        onClick={() => setOpen(value => !value)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-expanded={open}
        aria-label={open ? 'Masquer le sélecteur de portfolio' : 'Afficher le sélecteur de portfolio'}
        title={open ? 'Masquer les modes' : 'Afficher les modes'}
      >
        {open ? '›' : '‹'}
      </button>
      <button
        type="button"
        style={{ ...switcherStyle, borderColor: hovered ? current.accent : switcherStyle.borderColor }}
        onClick={onToggle}
        title={`${current.title} — prochain : ${next.label}`}
        aria-label={`${current.label} actif. Cliquer pour passer à ${next.label}`}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: current.accent, boxShadow: `0 0 10px ${current.accent}`, flexShrink: 0 }} />
        <span style={{ display: 'grid', gap: 3, textAlign: 'left' }}>
          <span style={{ fontSize: 9, letterSpacing: '.11em', color: '#929292', textTransform: 'uppercase' }}>{isMobile ? 'Mobile' : 'Desktop'} · actif</span>
          <span style={{ color: current.accent }}>{current.short}</span>
        </span>
        <span aria-hidden="true" style={{ color: '#777', fontSize: 14 }}>→</span>
        <span style={{ color: '#a9a9a9', fontSize: 10 }}>{next.label}</span>
      </button>
    </aside>
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

  const cycle = isMobile ? MOBILE_CYCLE : DESKTOP_CYCLE

  const toggle = () => {
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
          incompatibles. AKATECH gère sa propre CSS scopée (import direct
          dans AKATECH.jsx), donc rien à toggler ici pour ce mode. */}
      <link rel="stylesheet" href="/styles/style.compiled.css" disabled={mode !== 'app'} />
      <link rel="stylesheet" href="/styles/stylemobile.compiled.css" disabled={mode !== 'appmobile'} />

      {mode === 'akatech'   && <AkatechApp />}
      {mode === 'win95'     && <div style={{ height: '100%' }}><Win95App /></div>}
      {mode === 'appmobile' && <AppMobile />}
      {mode === 'app'       && <ModernApp />}
      <SwitcherBtn mode={mode} cycle={cycle} onToggle={toggle} isMobile={isMobile} />
    </div>
  )
}
