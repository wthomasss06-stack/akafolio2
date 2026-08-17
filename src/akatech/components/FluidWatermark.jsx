'use client'

import { useEffect, useRef, useState } from 'react'

const STEP = 3 // 5 → 3 : encore jugé "trop invisible" — la densité de
// particules compte plus que l'opacité seule pour lire comme du texte
// plutôt que des points épars.
const IDLE_AMPLITUDE = 3.5 // amplitude de l'ondulation continue au repos (px) — la part "fluide"
const RIPPLE_RADIUS = 130 // rayon/flux repris de l'effet 19 "Matrix Liquid Bio" (fichier de référence)
const RIPPLE_PUSH = 90
const STIFFNESS = 0.14
const DAMP = 0.82
const IDLE_ALPHA = 0.4 // 0.05 → 0.16 → 0.24 → 0.4 : toujours jugé trop invisible, palier net cette fois
const PARTICLE_SIZE = 2.8

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [242, 237, 232]
}

/**
 * Watermark "AKATECH" du footer, rendu en particules sur canvas
 * (même technique que le fichier de référence à 30 variations :
 * texte échantillonné sur un canvas offscreen, une particule par
 * pixel allumé). Deux comportements combinés :
 *  - au repos, une ondulation continue et douce (comme une surface
 *    d'eau) garde le watermark vivant même sans interaction ;
 *  - au survol, flux organique sinusoïdal repris de l'effet 19
 *    "Matrix Liquid Bio" de la référence, mais en orange (couleur de
 *    marque) plutôt que le vert de cet effet — demandé après coup,
 *    le mouvement "Matrix" reste, seule la couleur change.
 *
 * Couleur au repos théma-consciente (lit --text-dim, voir
 * refreshBaseColor) : reste correcte en thème clair comme sombre.
 */
export default function FluidWatermark({ text = 'AKATECH' }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  // Lu de façon synchrone dès le premier rendu (comme useIsMobile dans
  // RootApp.jsx) : partir de `false` puis corriger via un effet
  // ferait tourner puis démonter le système de particules pour rien
  // sur une visite qui préfère moins de mouvement.
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reduced) return undefined
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return undefined
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let W = 0
    let H = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles = []
    let rafId = null
    let time = 0
    let visible = true
    let resizeTimer = null
    const mouse = { x: -9999, y: -9999, active: false }
    // Buffers pour le fix de render() ci-dessous (recompositing en un
    // seul passage par groupe, voir le commentaire là-bas).
    const idleBuf = document.createElement('canvas')
    const activeBuf = document.createElement('canvas')
    const idleBufCtx = idleBuf.getContext('2d')
    const activeBufCtx = activeBuf.getContext('2d')
    // BUG corrigé : la couleur de repos était un RGB fixe pensé pour le
    // fond sombre — en thème clair, fond ET particules devenaient la
    // même teinte crème, watermark invisible ("en mode clair on ne le
    // voit plus"). On relit --text-dim (qui a déjà sa variante par
    // thème) toutes les ~30 frames plutôt qu'à chaque frame : assez
    // réactif à un changement de thème, sans un getComputedStyle par
    // frame pour rien.
    let baseColor = [242, 237, 232]
    let colorCheckTick = 0
    function refreshBaseColor() {
      const val = getComputedStyle(container).getPropertyValue('--text-dim')
      if (val) baseColor = hexToRgb(val)
    }

    function buildParticles() {
      const rect = container.getBoundingClientRect()
      W = Math.max(1, Math.floor(rect.width))
      H = Math.max(1, Math.floor(rect.height))
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      idleBuf.width = W
      idleBuf.height = H
      activeBuf.width = W
      activeBuf.height = H

      const off = document.createElement('canvas')
      off.width = W
      off.height = H
      const offCtx = off.getContext('2d', { willReadFrequently: true })
      const fontSize = Math.min(W / (text.length * 0.62), H * 0.62)
      offCtx.font = `900 ${fontSize}px 'Arial Black', Impact, sans-serif`
      offCtx.textAlign = 'center'
      offCtx.textBaseline = 'middle'
      offCtx.fillStyle = '#fff'
      offCtx.fillText(text, W / 2, H / 2)
      const data = offCtx.getImageData(0, 0, W, H).data

      const next = []
      let id = 0
      for (let y = 0; y < H; y += STEP) {
        for (let x = 0; x < W; x += STEP) {
          const idx = (y * W + x) * 4
          if (data[idx + 3] > 128) {
            next.push({ id: id++, ox: x, oy: y, x, y, vx: 0, vy: 0, force: 0, seed: Math.random() * Math.PI * 2 })
          }
        }
      }
      particles = next
    }

    function update() {
      time += 0.016
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Ondulation continue "au repos" — le texte respire comme de
        // l'eau même sans interaction.
        let tx = p.ox + Math.sin(p.oy * 0.045 + time * 1.1 + p.seed) * IDLE_AMPLITUDE
        let ty = p.oy + Math.cos(p.ox * 0.045 + time * 1.1 + p.seed) * IDLE_AMPLITUDE
        let force = 0

        if (mouse.active) {
          const dx = mouse.x - p.ox
          const dy = mouse.y - p.oy
          const dist = Math.hypot(dx, dy)
          if (dist < RIPPLE_RADIUS) {
            force = 1 - dist / RIPPLE_RADIUS
            // Effet 19 "Matrix Liquid Bio" : flux organique sinusoïdal
            // (sin/cos de la position + time*4), pas une poussée
            // radiale — même formule que le fichier de référence.
            tx += Math.sin(p.oy * 0.05 + time * 4) * force * RIPPLE_PUSH
            ty += Math.cos(p.ox * 0.05 + time * 4) * force * RIPPLE_PUSH
          }
        }

        p.force = force
        p.vx += (tx - p.x) * STIFFNESS
        p.vy += (ty - p.y) * STIFFNESS
        p.vx *= DAMP
        p.vy *= DAMP
        p.x += p.vx
        p.y += p.vy
      }
    }

    function render() {
      ctx.clearRect(0, 0, W, H)
      idleBufCtx.clearRect(0, 0, W, H)
      activeBufCtx.clearRect(0, 0, W, H)
      idleBufCtx.fillStyle = `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`
      activeBufCtx.fillStyle = 'rgb(255, 85, 0)'

      let idleCount = 0
      let activeMaxForce = 0
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const half = PARTICLE_SIZE / 2
        if (p.force > 0.05) {
          activeBufCtx.fillRect(p.x - half, p.y - half, PARTICLE_SIZE, PARTICLE_SIZE)
          if (p.force > activeMaxForce) activeMaxForce = p.force
        } else {
          idleBufCtx.fillRect(p.x - half, p.y - half, PARTICLE_SIZE, PARTICLE_SIZE)
          idleCount += 1
        }
      }

      // Un seul passage de composition par groupe : les particules à
      // l'intérieur d'un buffer sont pleinement opaques entre elles
      // (le chevauchement n'y change rien), l'opacité finale voulue
      // n'est appliquée qu'une fois, ici — donc uniforme partout,
      // qu'un endroit du mot ait 3 ou 30 particules qui se touchent.
      if (idleCount > 0) {
        ctx.globalAlpha = IDLE_ALPHA
        ctx.drawImage(idleBuf, 0, 0)
      }
      if (activeMaxForce > 0) {
        ctx.globalAlpha = Math.min(0.9, IDLE_ALPHA + activeMaxForce * 0.5)
        ctx.drawImage(activeBuf, 0, 0)
      }
      ctx.globalAlpha = 1
    }

    function loop() {
      if (visible) {
        colorCheckTick += 1
        if (colorCheckTick % 30 === 0) refreshBaseColor()
        update()
        render()
      }
      rafId = requestAnimationFrame(loop)
    }

    function onMove(e) {
      const rect = container.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }
    function onLeave() { mouse.active = false }
    function onTouchMove(e) {
      if (e.touches && e.touches[0]) {
        const rect = container.getBoundingClientRect()
        mouse.x = e.touches[0].clientX - rect.left
        mouse.y = e.touches[0].clientY - rect.top
        mouse.active = true
      }
    }
    function onTouchEnd() { mouse.active = false }
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(buildParticles, 150)
    }

    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true
    }, { threshold: 0.01 })
    io.observe(container)

    buildParticles()
    refreshBaseColor()
    loop()

    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseleave', onLeave)
    container.addEventListener('touchmove', onTouchMove, { passive: true })
    container.addEventListener('touchend', onTouchEnd)
    window.addEventListener('resize', onResize)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      clearTimeout(resizeTimer)
      io.disconnect()
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced, text])

  return (
    <div ref={containerRef} className="akatech-watermark" aria-hidden="true">
      {reduced ? (
        <span className="akatech-watermark-static">{text}</span>
      ) : (
        <canvas ref={canvasRef} className="akatech-watermark-canvas" />
      )}
    </div>
  )
}
