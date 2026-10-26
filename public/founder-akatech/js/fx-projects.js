// js/fx-projects.js — Slider horizontal 3D borné : premier projet → dernier projet.
//
// La section est épinglée : le défilement vertical de la page fait avancer les 24 projets, la souris ou le doigt
// les fait glisser (glisser-déposer + inertie, ou trackpad horizontal). Les images sont cliquables vers leur slug,
// dessinées en WebGL et se courbent avec la vitesse. Le nom du projet actif reste centré sous les images.
//
// Repli : sans WebGL, petit écran, « mouvement réduit » ou double-clic (file:// : images locales interdites en
// texture) → les mêmes cartes en défilement horizontal natif (classe .ps--static). Aucune perte de contenu.
(() => {
'use strict'
const CONFIG = {
  minHeight: 2.35, maxHeight: 2.8, aspectRatio: 1.75, gap: 0.16,   // plans agrandis, espacés régulièrement
  cameraZ: 3.8,                // caméra plus proche pour des images plus grandes
  smoothing: 0.07,             // inertie du slider
  distortionStrength: 2.2, distortionSmoothing: 0.1,
  dragSpeed: 0.012, momentumFriction: 0.95,
  perSlide: 0.6,               // défilement vertical par projet, en hauteurs d'écran
}

const loadScript = (src) => new Promise((resolve, reject) => {
  if (window.THREE) return resolve()
  const s = document.createElement('script'); s.src = src; s.async = true
  s.onload = resolve; s.onerror = () => reject(new Error('Chargement impossible : ' + src))
  document.head.appendChild(s)
})
// Essaie chaque source dans l'ordre (CDN puis fichier local) ; crossOrigin pour pouvoir l'utiliser en texture.
const loadImage = (srcs) => new Promise((resolve, reject) => {
  const [first, ...rest] = srcs
  const im = new Image(); im.crossOrigin = 'anonymous'
  im.onload = () => resolve(im)
  im.onerror = () => (rest.length ? loadImage(rest).then(resolve, reject) : reject(new Error('image')))
  im.src = first
})
const wrap = (v, r) => ((v % r) + r) % r
const clamp = (v, a, b) => Math.min(Math.max(v, a), b)
const pad = (n) => String(n).padStart(2, '0')

function initProjects({ D, $, $$, reduce }) {
  const root = $('#ps')
  if (!root) return
  const makeStatic = () => { root.classList.remove('ps--gl'); root.classList.add('ps--static') }
  if (reduce || !window.gsap || !window.ScrollTrigger || location.protocol === 'file:') return makeStatic()
  loadScript('assets/vendor/three.min.js').then(() => start(root, { D, $, $$ }, makeStatic)).catch((err) => { console.warn('[projets]', err.message); makeStatic() })
}

function start(root, { D, $, $$ }, makeStatic) {
  const THREE = window.THREE
  const { gsap, ScrollTrigger } = window
  const { mediaSources } = window.PF_CLOUD
  const cards = $$('.pc', root), n = cards.length
  if (!n) return makeStatic()
  gsap.registerPlugin(ScrollTrigger)

  const canvas = $('.ps-gl', root), stage = $('.ps-stage', root)
  let renderer
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }) } catch (e) { console.warn('[projets] WebGL indisponible, activation du carrousel de secours.', e); return makeStatic() }
  root.classList.add('ps--gl')
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.z = CONFIG.cameraZ
  const resize = () => {
    const w = Math.max(1, stage.clientWidth), h = Math.max(1, stage.clientHeight)
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix()
  }
  resize(); addEventListener('resize', resize)
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage)

  /* Plans : hauteurs variées (mais stables), posés les uns à côté des autres sur une boucle. */
  // Mobile : mêmes plans WebGL et même parallaxe qu'au PC, mais à l'échelle de l'écran — chaque plan est une boîte
  // (≈ 78 % de la largeur visible × 74 % de la hauteur) dans laquelle l'image « responsive » est ajustée sans
  // recadrage, au lieu de plans de 4 à 5 unités de large dont on ne voyait qu'une tranche.
  const mobile = matchMedia('(max-width: 900px)').matches
  const visibleH = 2 * CONFIG.cameraZ * Math.tan(Math.PI / 8)
  const visibleW = visibleH * Math.max(0.35, stage.clientWidth / Math.max(1, stage.clientHeight))
  const heights = mobile
    ? cards.map(() => visibleH * 0.74)
    : cards.map((_, i) => CONFIG.minHeight + (((i * 7) % 10) / 9) * (CONFIG.maxHeight - CONFIG.minHeight))
  const widths = mobile ? cards.map(() => visibleW * 0.78) : heights.map((h) => h * CONFIG.aspectRatio)
  const offsets = []
  let stack = 0
  widths.forEach((w, i) => {
    if (i === 0) { offsets.push(0); stack = w / 2 } else { stack += CONFIG.gap + w / 2; offsets.push(stack); stack += w / 2 }
  })
  const loopLength = stack + CONFIG.gap + widths[0] / 2, halfLoop = loopLength / 2
  const span = offsets[n - 1]   // course bornée : du premier au dernier projet, sans boucle

  const meshes = cards.map((_, i) => {
    const w = widths[i], h = heights[i]
    const geo = new THREE.PlaneGeometry(w, h, 32, 16)
    const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: 0x999999 })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.userData.orig = [...geo.attributes.position.array]
    const p = D.PROJECTS[i]
    loadImage(mediaSources(mobile ? (p.responsive || p.img) : p.img, mobile ? 800 : 1000).filter(Boolean)).then((im) => {
      const tex = new THREE.Texture(im)
      tex.needsUpdate = true; tex.generateMipmaps = false; tex.minFilter = THREE.LinearFilter
      mesh.userData.imgTex = tex
      if (!mesh.userData.videoOn) { mat.map = tex; mat.color.set(0xffffff); mat.needsUpdate = true } else mat.color.set(0xffffff)
      const ratio = (im.naturalWidth / im.naturalHeight) / (w / h)
      if (ratio > 1) mesh.scale.y = 1 / ratio; else mesh.scale.x = ratio
    }).catch(() => { /* image introuvable : le plan reste gris */ })
    scene.add(mesh)
    return mesh
  })

  /* Courbure : plus le slider va vite, plus les plans proches du centre se bombent. */
  const distort = (mesh, posX, strength) => {
    const pos = mesh.geometry.attributes.position, o = mesh.userData.orig
    for (let i = 0; i < pos.count; i++) {
      const d = Math.hypot(posX + o[i * 3], o[i * 3 + 1])
      const falloff = Math.max(0, 1 - d / 2)
      pos.setZ(i, Math.pow(Math.sin((falloff * Math.PI) / 2), 1.5) * strength)
    }
    pos.needsUpdate = true
    mesh.geometry.computeVertexNormals()
  }

  /* Entrées : défilement vertical (épinglé) + glisser / inertie / trackpad horizontal. */
  let pinned = 0, drag = 0, momentum = 0, dragging = false, lastX = 0, lastDX = 0
  let pointerStartX = 0, pointerStartY = 0, pointerMoved = false
  let pos = 0, last = 0, distAmt = 0, distTarget = 0, dir = 0, dirTarget = 0, peak = 0, active = -1, visible = false
  const vel = [0, 0, 0, 0, 0]

  /* Les vidéos des projets jouent ensemble sur desktop ; l'image reste le repli en cas d'échec.
     Le slider statique et la version mobile conservent les images. */
  const { hasVideo, videoSources, localOf } = window.PF_CLOUD
  const videoPathOf = (p) => { const m = /\/assets\/images\/projects\/([^/]+)\.(?:webp|png|jpe?g)$/i.exec(localOf(p.img) || ''); return m ? `/assets/images/projects/${m[1]}.webm` : '' }
  const vstate = meshes.map(() => null)
  const showImage = (i) => {
    const m = meshes[i]; m.userData.videoOn = false
    if (m.userData.imgTex) { m.material.map = m.userData.imgTex; m.material.needsUpdate = true }
  }
  const stopVideo = (i) => { if (i < 0) return; vstate[i]?.video.pause(); showImage(i) }
  const startVideo = (i) => {
    if (i < 0 || mobile) return   // jamais de vidéo sur mobile
    const path = videoPathOf(D.PROJECTS[i]); if (!path || !hasVideo(path)) return
    let st = vstate[i]
    if (st?.failed) return
    if (!st) {
      const video = document.createElement('video')
      video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'auto'; video.crossOrigin = 'anonymous'
      st = vstate[i] = { video, tex: null, failed: false, srcs: [...videoSources(path)] }
      video.addEventListener('error', () => {
        if (st.srcs.length) { video.src = st.srcs.shift(); video.load(); return }
        st.failed = true; stopVideo(i)
      })
      video.src = st.srcs.shift()
    }
    st.video.play().then(() => {
      if (st.failed) return
      if (!st.tex) { st.tex = new THREE.VideoTexture(st.video); st.tex.generateMipmaps = false; st.tex.minFilter = THREE.LinearFilter }
      const m = meshes[i]; m.userData.videoOn = true; m.material.map = st.tex; m.material.color.set(0xffffff); m.material.needsUpdate = true
    }).catch(() => {})
  }
  const burst = (a) => { distTarget = Math.min(1, distTarget + a) }
  const goToProject = (index) => { if (cards[index]?.href) window.location.assign(cards[index].href) }
  const indexAtPointer = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect()
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return -1
    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1
    const worldX = ndcX * CONFIG.cameraZ * Math.tan(Math.PI / 8) * (rect.width / rect.height)
    let hit = -1, nearest = Infinity
    meshes.forEach((mesh, i) => {
      const distance = Math.abs(mesh.position.x - worldX)
      const halfWidth = widths[i] * Math.abs(mesh.scale.x) / 2
      if (distance <= halfWidth && distance < nearest) { hit = i; nearest = distance }
    })
    return hit
  }

  ScrollTrigger.create({
    trigger: root, start: 'top top', end: () => '+=' + Math.round(n * innerHeight * CONFIG.perSlide),
    pin: true, anticipatePin: 1, invalidateOnRefresh: true,
    onUpdate: (self) => { pinned = self.progress * span },
  })
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting
    if (visible) meshes.forEach((_, i) => startVideo(i))
    else vstate.forEach((st) => st?.video.pause())
  }, { rootMargin: '100px' }).observe(root)

  canvas.addEventListener('pointerdown', (e) => {
    dragging = true; lastX = e.clientX; lastDX = 0; momentum = 0
    pointerStartX = e.clientX; pointerStartY = e.clientY; pointerMoved = false
    canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'
  })
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return
    if (Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY) > 8) pointerMoved = true
    lastDX = e.clientX - lastX; lastX = e.clientX
    drag = clamp(drag - lastDX * CONFIG.dragSpeed, -pinned, span - pinned); burst(Math.abs(lastDX) * 0.02)
  })
  const release = (e, allowClick) => {
    if (!dragging) return
    const hit = allowClick && !pointerMoved ? indexAtPointer(e.clientX, e.clientY) : -1
    dragging = false; canvas.style.cursor = 'grab'
    momentum = pointerMoved ? clamp(-lastDX * CONFIG.dragSpeed, -0.08, 0.08) : 0
    if (hit >= 0) goToProject(hit)
  }
  canvas.addEventListener('pointerup', (e) => release(e, true))
  canvas.addEventListener('pointercancel', (e) => release(e, false))
  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToProject(Math.max(active, 0)) }
  })
  root.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return   // vertical : la page défile (et le slider avec)
    e.preventDefault(); drag = clamp(drag + e.deltaX * 0.01, -pinned, span - pinned); burst(Math.abs(e.deltaX) * 0.001)
  }, { passive: false })

  const frame = (t) => {
    requestAnimationFrame(frame)
    if (!visible) { last = 0; return }
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016
    last = t
    if (!dragging) { drag = clamp(drag + momentum, -pinned, span - pinned); momentum *= CONFIG.momentumFriction; if (Math.abs(momentum) < 0.0005) momentum = 0 }

    const prev = pos
    const target = clamp(pinned + drag, 0, span)
    pos += (target - pos) * CONFIG.smoothing
    const delta = pos - prev
    if (Math.abs(delta) > 1e-5) dirTarget = delta > 0 ? 1 : -1
    dir += (dirTarget - dir) * 0.08

    const v = Math.abs(delta) / dt
    vel.push(v); vel.shift()
    const avg = vel.reduce((a, b) => a + b) / vel.length
    if (avg > peak) peak = avg
    const decel = avg / (peak + 0.001) < 0.7 && peak > 0.5
    peak *= 0.99
    if (v > 0.05) distTarget = Math.max(distTarget, Math.min(1, v * 0.1))
    if (decel || avg < 0.2) distTarget *= decel ? 0.95 : 0.855
    distAmt += (distTarget - distAmt) * CONFIG.distortionSmoothing
    const strength = CONFIG.distortionStrength * distAmt * dir

    let best = Infinity, bi = 0
    meshes.forEach((m, i) => {
      const x = pos - offsets[i]
      m.position.x = x
      m.visible = Math.abs(x) < 7
      if (Math.abs(x) < best) { best = Math.abs(x); bi = i }
      if (m.visible) distort(m, x, strength)
    })

    if (bi !== active) {
      active = bi
      cards.forEach((c, i) => c.classList.toggle('is-on', i === bi))
      canvas.setAttribute('aria-label', `${D.UI.viewProject} : ${D.PROJECTS[bi]?.title || ''}`)
      if (visible) meshes.forEach((_, i) => startVideo(i))
    }
    renderer.render(scene, camera)
  }
  requestAnimationFrame(frame)
  ScrollTrigger.refresh()
}

window.PF_FX = Object.assign(window.PF_FX || {}, { initProjects })
})()
