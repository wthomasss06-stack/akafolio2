'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import './AKATECH.css'
import Navbar from './components/Navbar'
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
  const [theme, setTheme] = useState('dark')
  const rootRef = useRef(null)
  const cursorRef = useRef(null)

  const goTo = useCallback((id) => {
    if (PAGE_ORDER.includes(id)) setPageId(id)
  }, [])

  const goNext = useCallback(() => {
    setPageId((current) => {
      const idx = PAGE_ORDER.indexOf(current)
      return PAGE_ORDER[(idx + 1) % PAGE_ORDER.length]
    })
  }, [])

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
    <div ref={rootRef} className={`akatech-root${theme === 'light' ? ' akatech-theme-light' : ''}`}>
      <div ref={cursorRef} className="akatech-cursor" aria-hidden="true" />

      <Navbar
        activePage={pageId}
        onNavigate={goTo}
        theme={theme}
        onToggleTheme={() => setTheme((v) => (v === 'dark' ? 'light' : 'dark'))}
      />

      <main key={pageId} className="akatech-page">
        <PageComponent onNext={goNext} onNavigate={goTo} />
      </main>
    </div>
  )
}
