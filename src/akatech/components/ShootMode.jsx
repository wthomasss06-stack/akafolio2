'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsapSetup'

const TITLE_SELECTOR = 'h1, h2, h3, h4'
const ROOT_SELECTOR = '.akatech-root, .modern-app-root'
const PAGE_SELECTOR = '.akatech-page, .modern-app-page, main'

/**
 * Mode Tir — adapté de BALLE_TIRE.html. Trois catégories de cibles :
 *  - une IMAGE ("bombe") : grosse explosion, tremblement d'écran,
 *    son d'explosion ;
 *  - un TITRE (h1-h4) : éclate en morceaux qui s'envolent, son
 *    d'explosion, disparaît (ne revient pas tout seul) ;
 *  - un MOT (pas tout le paragraphe) : se détache et tombe.
 * Plus : clic droit maintenu = vise/zoome sur le contenu de la page,
 * son de tir synthétisé à chaque coup.
 *
 * Tout ce qui est touché est restauré à l'identique dès que le mode
 * est désactivé — c'est le contrat du composant, pas une option.
 *
 * @param {{ active: boolean, pageId: string }} props
 */
export default function ShootMode({ active, pageId }) {
  const activeRef = useRef(active)
  activeRef.current = active
  const audioCtxRef = useRef(null)
  const aimingRef = useRef(false)
  const wrappedElsRef = useRef([]) // paragraphes dont on a remplacé innerHTML (mots découpés)
  const hiddenElsRef = useRef(new Set()) // titres/mots actuellement visibility:hidden

  // ── Découpage en mots / restauration — dépend de active ET pageId :
  // chaque page remonte entièrement au changement (key={pageId} dans
  // AKATECH.jsx), donc ses paragraphes doivent être re-découpés à
  // chaque nouvelle page tant que le mode reste actif.
  useEffect(() => {
    function restoreAll() {
      wrappedElsRef.current.forEach(({ el, html }) => {
        el.innerHTML = html
      })
      wrappedElsRef.current = []
      hiddenElsRef.current.forEach((el) => {
        el.style.visibility = ''
        delete el.dataset.shootHit
      })
      hiddenElsRef.current.clear()
      document.querySelectorAll('.akatech-shoot-falling, .akatech-shoot-shatter-piece').forEach((n) => n.remove())
    }

    if (!active) {
      restoreAll()
      return undefined
    }

    const root = document.querySelector(ROOT_SELECTOR)
    if (!root) return undefined

    // Tous les textes visibles deviennent des mots ciblables : paragraphes,
    // liens, boutons, titres, cartes, badges et contenus des grilles.
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    const textNodes = []
    const parents = new Set()
    let n = walker.nextNode()
    while (n) {
      const parent = n.parentElement
      if (
        parent &&
        n.textContent.trim() &&
        !parent.closest('script, style, svg, .akatech-shoot-word, .akatech-cursor, .akatech-transition-canvas, .akatech-shoot-falling, .akatech-shoot-shatter-piece, [data-no-shoot]')
      ) {
        textNodes.push(n)
        parents.add(parent)
      }
      n = walker.nextNode()
    }

    parents.forEach((el) => wrappedElsRef.current.push({ el, html: el.innerHTML }))
    textNodes.forEach((textNode) => {
      const frag = document.createDocumentFragment()
      textNode.textContent.split(/(\s+)/).forEach((part) => {
        if (part === '') return
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part))
        } else {
          const span = document.createElement('span')
          span.className = 'akatech-shoot-word'
          span.textContent = part
          frag.appendChild(span)
        }
      })
      textNode.parentNode?.replaceChild(frag, textNode)
    })

    return restoreAll
  }, [active, pageId])

  // ── Tir, visée, cibles — un seul jeu de listeners globaux posé une
  // fois ; `activeRef` (à jour à chaque rendu) fait le vrai filtre,
  // donc pas besoin de recréer les listeners au fil des toggles.
  useEffect(() => {
    function getAudioContext() {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext
        if (!AudioContextClass) return null
        audioCtxRef.current = new AudioContextClass()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === 'suspended') ctx.resume()
      return ctx
    }

    function playGunshot() {
      const ctx = getAudioContext()
      if (!ctx) return
      const now = ctx.currentTime
      const length = Math.floor(ctx.sampleRate * 0.16)
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < length; i += 1) {
        const envelope = (1 - i / length) ** 2
        data[i] = (Math.random() * 2 - 1) * envelope
      }
      const source = ctx.createBufferSource()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()
      source.buffer = buffer
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(1850, now)
      filter.Q.value = 1.3
      gain.gain.setValueAtTime(0.34, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)
      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start(now)
      source.stop(now + 0.17)
    }

    function playExplosionSound() {
      const ctx = getAudioContext()
      if (!ctx) return
      const now = ctx.currentTime
      const length = Math.floor(ctx.sampleRate * 0.32)
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < length; i += 1) {
        const envelope = Math.max(0.001, 1 - i / length)
        data[i] = (Math.random() * 2 - 1) * envelope
      }
      const source = ctx.createBufferSource()
      const filter = ctx.createBiquadFilter()
      const gain = ctx.createGain()
      source.buffer = buffer
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1250, now)
      filter.frequency.exponentialRampToValueAtTime(160, now + 0.32)
      gain.gain.setValueAtTime(0.42, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32)
      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start(now)
      source.stop(now + 0.34)
    }

    function triggerShake(power) {
      const p = power || 8
      const root = document.querySelector(ROOT_SELECTOR)
      if (!root) return
      gsap.killTweensOf(root)
      // BUG résolu : gsap.set(root, {x:0, y:0}) laisse un transform
      // inline (translate(0,0) compte comme transform, pas "none").
      // N'importe quel transform sur .akatech-root fait de lui le
      // conteneur des descendants position:fixed (le header) au lieu
      // du viewport — dès le premier tir, le header arrêtait de
      // suivre le scroll ("le header n'est pas fix"). clearProps
      // retire le transform pour de vrai plutôt que de le parquer à
      // zéro.
      const tl = gsap.timeline({ onComplete: () => gsap.set(root, { clearProps: 'transform' }) })
      for (let i = 0; i < 6; i++) {
        tl.to(root, { x: (Math.random() - 0.5) * p, y: (Math.random() - 0.5) * p, duration: 0.035 })
      }
      tl.to(root, { x: 0, y: 0, duration: 0.08 })
    }

    function updateZoomOrigin(e) {
      const page = document.querySelector(PAGE_SELECTOR)
      if (!page) return
      page.style.transformOrigin = `${(e.clientX / window.innerWidth) * 100}% ${(e.clientY / window.innerHeight) * 100}%`
    }

    function onContextMenu(e) { if (activeRef.current) e.preventDefault() }

    function onMouseDown(e) {
      if (!activeRef.current || e.button !== 2) return
      aimingRef.current = true
      updateZoomOrigin(e)
      const page = document.querySelector(PAGE_SELECTOR)
      if (page) gsap.to(page, { scale: 1.55, duration: 0.35, ease: 'power2.out' })
    }

    function onMouseUp(e) {
      if (e.button !== 2) return
      aimingRef.current = false
      const page = document.querySelector(PAGE_SELECTOR)
      if (page) gsap.to(page, { scale: 1, duration: 0.3, ease: 'power2.out' })
    }

    function onMouseMove(e) {
      if (activeRef.current && aimingRef.current) updateZoomOrigin(e)
    }

    function isTargetable(el) {
      return el && el.closest && el.closest(ROOT_SELECTOR) && !el.closest('.akatech-detail-panel')
    }

    function shatterTitle(el) {
      if (hiddenElsRef.current.has(el)) return
      const rect = el.getBoundingClientRect()
      const cs = window.getComputedStyle(el)
      const chars = el.textContent.split('')

      el.style.visibility = 'hidden'
      hiddenElsRef.current.add(el)

      triggerShake(14)

      let cx = rect.left
      const cy = rect.top
      chars.forEach((ch) => {
        const piece = document.createElement('span')
        piece.className = 'akatech-shoot-shatter-piece'
        piece.textContent = ch === ' ' ? '\u00A0' : ch
        piece.style.left = `${cx}px`
        piece.style.top = `${cy}px`
        piece.style.fontFamily = cs.fontFamily
        piece.style.fontSize = cs.fontSize
        piece.style.fontWeight = cs.fontWeight
        piece.style.color = cs.color
        document.body.appendChild(piece)
        cx += (rect.width / chars.length) || 10

        gsap.to(piece, {
          x: (Math.random() - 0.5) * 500,
          y: (Math.random() - 0.5) * 400 - 60,
          rotation: (Math.random() - 0.5) * 720,
          opacity: 0,
          duration: 0.9 + Math.random() * 0.5,
          ease: 'power3.out',
          onComplete: () => piece.remove(),
        })
      })
    }

    function dropWord(el) {
      if (hiddenElsRef.current.has(el)) return
      const rect = el.getBoundingClientRect()
      const cs = window.getComputedStyle(el)

      const clone = document.createElement('span')
      clone.className = 'akatech-shoot-falling'
      clone.textContent = el.textContent
      clone.style.left = `${rect.left}px`
      clone.style.top = `${rect.top}px`
      clone.style.fontFamily = cs.fontFamily
      clone.style.fontSize = cs.fontSize
      clone.style.fontWeight = cs.fontWeight
      clone.style.color = cs.color
      document.body.appendChild(clone)

      el.style.visibility = 'hidden'
      hiddenElsRef.current.add(el)

      const dir = Math.random() > 0.5 ? 1 : -1
      gsap.to(clone, {
        y: window.innerHeight - rect.top + 100,
        x: `+=${dir * (40 + Math.random() * 80)}`,
        rotation: dir * (30 + Math.random() * 50),
        opacity: 0,
        duration: 0.9 + Math.random() * 0.4,
        ease: 'power1.in',
        onComplete: () => clone.remove(),
      })
    }

    function bombHit(el, x, y) {
            triggerShake(18)
      playExplosionSound()
      const ring = document.createElement('div')

      ring.className = 'akatech-shoot-bomb'
      ring.style.left = `${x}px`
      ring.style.top = `${y}px`
      document.body.appendChild(ring)
      gsap.fromTo(ring, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.6, ease: 'power2.out', onComplete: () => ring.remove() })

      for (let i = 0; i < 16; i++) {
        const p = document.createElement('span')
        p.className = 'akatech-shoot-spark akatech-shoot-spark--big'
        document.body.appendChild(p)
        const angle = (i / 16) * Math.PI * 2
        const dist = 70 + Math.random() * 90
        gsap.set(p, { x, y })
        gsap.to(p, {
          x: x + Math.cos(angle) * dist,
          y: y + Math.sin(angle) * dist + 30,
          opacity: 0,
          scale: 0,
          duration: 0.6 + Math.random() * 0.4,
          ease: 'power2.out',
          onComplete: () => p.remove(),
        })
      }
      gsap.fromTo(el, { filter: 'brightness(2.2)' }, { filter: 'brightness(1)', duration: 0.4, ease: 'power2.out' })
    }

    function spawnSplatter(x, y) {
      const splat = document.createElement('div')
      splat.className = 'akatech-shoot-splatter'
      splat.style.left = `${x}px`
      splat.style.top = `${y}px`
      document.body.appendChild(splat)
      gsap.fromTo(splat, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.9, ease: 'power2.out', onComplete: () => splat.remove() })
    }

    function onClick(e) {
      if (!activeRef.current) return
      if (e.target.closest('a, button, input, select, textarea')) return

      const x = e.clientX
      const y = e.clientY
      playGunshot()
      triggerShake(6)

      const bullet = document.createElement('div')
      bullet.className = 'akatech-shoot-bullet'
      document.body.appendChild(bullet)
      gsap.fromTo(
        bullet,
        { x: window.innerWidth / 2, y: window.innerHeight + 20, opacity: 1 },
        {
          x,
          y,
          duration: 0.16,
          ease: 'power1.in',
          onComplete: () => {
            bullet.remove()
            const hit = document.elementFromPoint(x, y)
            if (!isTargetable(hit)) { spawnSplatter(x, y); return }

            if (hit.tagName === 'IMG') { bombHit(hit, x, y); return }

            spawnSplatter(x, y)
            const word = hit.closest('.akatech-shoot-word')
            const title = hit.closest(TITLE_SELECTOR)
            if (word && isTargetable(word)) dropWord(word)
            else if (title && isTargetable(title)) shatterTitle(title)
          },
        }
      )
    }

    window.addEventListener('click', onClick)
    window.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('click', onClick)
      window.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
      const page = document.querySelector(PAGE_SELECTOR)
      if (page) gsap.set(page, { clearProps: 'transform,transformOrigin' })
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {})
        audioCtxRef.current = null
      }
    }
  }, [])

  return null
}
