'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { VERTEX_SHADER, FRONT_FRAGMENT_SHADER, BACK_FRAGMENT_SHADER } from './DissolveTransition.jsx'
import { cld } from '../lib/cloudinary.js'

/* ════════════════════════════════════════════
 HERO ZOOM + DISSOLVE — 3 phases fusionnées dans un seul
 pin/canvas, pour un passage petit-cadre → plein écran →
 dissolve vers l'image suivante SANS rupture visuelle :
   1. clip-path resserré (30/35) + scale 1.3 → plein écran
   2. léger palier — l'image tient à pleine résolution
   3. dissolve WebGL (shaders repris de DissolveTransition.jsx,
      exportés depuis ce fichier) : hero-bg.webp → about-1.webp
 Le canvas Three.js est monté dès le départ (au lieu d'un
 <img> qui basculerait vers un <canvas> séparé au moment du
 dissolve) : c'est le zoom CSS (clip-path + scale) qui joue
 sur ce même canvas, donc aucune bascule DOM ni flash quand
 le dissolve prend le relais — juste la suite du même scrub.
 Absorbe l'ex-<DissolveTransition id="hero-dissolve" /> qui
 suivait directement dans le rendu (voir plus bas).
 ════════════════════════════════════════════ */
function HeroZoomSection() {
  const pinRef = useRef(null)
  const containerRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const pin = pinRef.current
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!pin || !container || !canvas) return

    let destroyed = false
    let frontTexture = null
    let backTexture = null

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1
    const scene = new THREE.Scene()
    const geometry = new THREE.PlaneGeometry(2, 2)

    const uniformsFront = {
      uTexture: { value: null },
      uResolution: { value: new THREE.Vector2() },
      uImageResolution: { value: new THREE.Vector2(1, 1) },
      uDissolve: { value: 0 },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uGrayscale: { value: 0 },
      uEdgeIntensity: { value: 0 },
      uEdgeBrightness: { value: 1 },
    }
    const uniformsBack = {
      uTexture: { value: null },
      uResolution: { value: new THREE.Vector2() },
      uImageResolution: { value: new THREE.Vector2(1, 1) },
      uEdgeIntensity: { value: 0.6 },
      uDarkness: { value: 1 },
      uGrayscale: { value: 1 },
    }

    const materialFront = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRONT_FRAGMENT_SHADER,
      uniforms: uniformsFront,
      transparent: true,
    })
    const materialBack = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: BACK_FRAGMENT_SHADER,
      uniforms: uniformsBack,
      transparent: true,
    })

    const meshBack = new THREE.Mesh(geometry, materialBack)
    meshBack.position.z = -0.1
    scene.add(meshBack)
    const meshFront = new THREE.Mesh(geometry, materialFront)
    scene.add(meshFront)

    function render() {
      if (destroyed) return
      renderer.render(scene, camera)
    }

    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h, false)
      uniformsFront.uResolution.value.set(w, h)
      uniformsBack.uResolution.value.set(w, h)
      render()
    }

    const loader = new THREE.TextureLoader()
    loader.load(cld('/assets/images/hero-bg.webp'), tex => {
      if (destroyed) { tex.dispose(); return }
      if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace
      frontTexture = tex
      uniformsFront.uTexture.value = tex
      uniformsFront.uImageResolution.value.set(tex.image.width, tex.image.height)
      render()
    })
    loader.load(cld('/assets/images/about-1.webp'), tex => {
      if (destroyed) { tex.dispose(); return }
      if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace
      backTexture = tex
      uniformsBack.uTexture.value = tex
      uniformsBack.uImageResolution.value.set(tex.image.width, tex.image.height)
      render()
    })

    resize()
    window.addEventListener('resize', resize)

    /* État initial — identique à l'ancien HeroZoomSection */
    gsap.set(container, { clipPath: 'inset(30% 35% 30% 35%)' })
    gsap.set(canvas, { scale: 1.3 })

    /* Uniformes dérivés du dissolve — même calcul que setProgress()
       dans DissolveTransition.jsx, rejoué ici via onUpdate GSAP */
    function syncDissolve() {
      const p = uniformsFront.uDissolve.value
      uniformsFront.uGrayscale.value = Math.min(1, p / 0.4)
      uniformsFront.uEdgeIntensity.value = p * 0.5
      uniformsFront.uEdgeBrightness.value = 1 - p

      const acc = Math.min(1, p * 1.1)
      uniformsBack.uEdgeIntensity.value = 0.6 * (1 - acc)
      uniformsBack.uDarkness.value = 1 - acc
      uniformsBack.uGrayscale.value = 1 - acc

      render()
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    })
      /* Phase 1 → 2 : petit cadre vers plein écran */
      .to(container, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 }, 0)
      .to(canvas, { scale: 1, ease: 'none', duration: 1 }, 0)
      /* Phase 3 : dissolve plein écran vers l'image suivante — léger
         palier (1 → 1.1) pour laisser l'image respirer avant qu'elle
         ne commence à se dissoudre */
      .to(uniformsFront.uDissolve, { value: 1, ease: 'none', duration: 0.75, onUpdate: syncDissolve }, 1.1)

    return () => {
      destroyed = true
      window.removeEventListener('resize', resize)
      tl.scrollTrigger?.kill()
      tl.kill()
      geometry.dispose()
      materialFront.dispose()
      materialBack.dispose()
      frontTexture?.dispose()
      backTexture?.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <section id="hero-zoom-section" className="hzx-section">
      <div ref={pinRef} className="hzx-pin">
        <div className="hzx-sticky">
          <div ref={containerRef} className="hzx-container">
            <canvas
              ref={canvasRef}
              className="hzx-canvas"
              role="img"
              aria-label="M'Bollo Aka au travail, de nuit, face à la ville"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroZoomSection
