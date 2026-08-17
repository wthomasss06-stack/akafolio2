'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { gsap } from './lib/gsapSetup'
import './AKATECH.css'
import Navbar from './components/Navbar'
import PageTransitionOverlay from './components/PageTransitionOverlay'
import ShootMode from './components/ShootMode'
import Home from './pages/Home'
import Story from './pages/Story'
import Method from './pages/Method'
import Projects from './pages/Projects'
import Sandbox from './pages/Sandbox'
import Services from './pages/Services'
import Contact from './pages/Contact'

const PAGE_ORDER = ['home', 'story', 'method', 'projects', 'sandbox', 'services', 'contact']
const PAGES = { home: Home, story: Story, method: Method, projects: Projects, sandbox: Sandbox, services: Services, contact: Contact }

export default function AKATECH() {
  const [pageId, setPageId] = useState('home')
  const [shootMode, setShootMode] = useState(false)
  const rootRef = useRef(null)
  const cursorRef = useRef(null)
  const transitionRef = useRef(null)
  // Le tout premier affichage garde le fade-up CSS existant
  // (akatech-page--enter) ; toute navigation suivante passe par le
  // calque "papier brûlé" à la place, pour ne pas jouer les deux
  // animations d'entrée en même temps.
  const hasMountedRef = useRef(false)

  useEffect(() => {
    hasMountedRef.current = true
  }, [])

  // Point de passage unique pour tout changement de page : on
  // déclenche la transition WebGL, qui appelle elle-même setPageId()
  // une fois l'écran entièrement masqué (voir PageTransitionOverlay).
  // Fallback direct si le calque n'est pas encore monté.
  const goTo = useCallback((id) => {
    if (!PAGE_ORDER.includes(id) || id === pageId) return
    if (transitionRef.current) {
      transitionRef.current.trigger(() => setPageId(id))
    } else {
      setPageId(id)
    }
  }, [pageId])

  const goNext = useCallback(() => {
    const idx = PAGE_ORDER.indexOf(pageId)
    const next = PAGE_ORDER[(idx + 1) % PAGE_ORDER.length]
    if (transitionRef.current) {
      transitionRef.current.trigger(() => setPageId(next))
    } else {
      setPageId(next)
    }
  }, [pageId])

  // Chaque page est un écran distinct (pas une position de scroll dans
  // un long document) : on repart en haut à chaque changement.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pageId])

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = '' }
  }, [])

  // Curseur personnalisé (effet Gemini) : suit la souris, grossit sur
  // les éléments interactifs. La media query CSS le masque déjà sur
  // tactile ; on évite aussi d'attacher les listeners dans ce cas.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return undefined
    }
    const cursor = cursorRef.current
    const root = rootRef.current
    if (!cursor || !root) return undefined

    const move = (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' })
    }
    const isInteractive = (target) => target.closest('a, button, input, select, textarea, [role="button"]')
    const over = (e) => { if (isInteractive(e.target)) cursor.classList.add('is-hovering') }
    const out = (e) => { if (isInteractive(e.target)) cursor.classList.remove('is-hovering') }

    root.addEventListener('mousemove', move)
    root.addEventListener('mouseover', over)
    root.addEventListener('mouseout', out)
    return () => {
      root.removeEventListener('mousemove', move)
      root.removeEventListener('mouseover', over)
      root.removeEventListener('mouseout', out)
      gsap.killTweensOf(cursor)
    }
  }, [])

  const PageComponent = PAGES[pageId] || Home


  return (
    <div
      ref={rootRef}
      className={`akatech-root${shootMode ? ' akatech-shoot-active' : ''}`}
    >
      <div ref={cursorRef} className="akatech-cursor" aria-hidden="true" />

      <Navbar
        activePage={pageId}
        onNavigate={goTo}
        shootMode={shootMode}
        onToggleShoot={() => setShootMode((v) => !v)}
      />

      <main key={pageId} className={`akatech-page${hasMountedRef.current ? '' : ' akatech-page--enter'}`}>
        <PageComponent onNext={goNext} onNavigate={goTo} />
      </main>

      <PageTransitionOverlay ref={transitionRef} />
      <ShootMode active={shootMode} pageId={pageId} />
    </div>
  )
}
