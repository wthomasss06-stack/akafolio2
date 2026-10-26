// js/fx-process.js — Process : image qui suit le curseur au survol d'une ligne (TRES_MINIMALISM.html).
// Souris : l'image flotte en couleur. Tactile : un appui déplie la ligne et son image.
// Clavier : Entrée / Espace déplie la ligne (tous appareils).
(() => {
'use strict'
const setPreview = (float, value, number) => {
  if (!value) {
    float.replaceChildren(Object.assign(document.createElement('b'), { textContent: number }))
    float.classList.remove('has-img')
    return
  }
  const [src, ...fallbacks] = window.PF_CLOUD.mediaSources(value, 900)
  const image = document.createElement('img')
  image.alt = ''
  image.loading = 'eager'
  if (fallbacks.length) image.dataset.fb = fallbacks.filter(Boolean).join('|')
  image.src = src
  float.replaceChildren(image)
  float.classList.add('has-img')
}

function initProcess({ $, $$, finePointer, reduce }) {
  const list = $('.proc-list')
  if (!list) return
  const rows = $$('.proc-row', list)

  const toggle = (row) => {
    const open = !row.classList.contains('open')
    rows.forEach((r) => { r.classList.remove('open'); r.setAttribute('aria-expanded', 'false') })
    row.classList.toggle('open', open); row.setAttribute('aria-expanded', String(open))
  }
  rows.forEach((row) => {
    row.setAttribute('role', 'button'); row.setAttribute('aria-expanded', 'false')
    row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(row) } })
    if (!finePointer) row.addEventListener('click', () => toggle(row))
  })
  if (!finePointer) return

  const float = document.createElement('div')
  float.className = 'proc-float'; float.setAttribute('aria-hidden', 'true')
  document.body.appendChild(float)
  const g = window.gsap
  let setX, setY
  if (g && !reduce) {
    g.set(float, { xPercent: -50, yPercent: -50, scale: 0.8, opacity: 0 })
    setX = g.quickTo(float, 'x', { duration: 0.5, ease: 'power3' })
    setY = g.quickTo(float, 'y', { duration: 0.5, ease: 'power3' })
  } else {
    float.style.transform = 'translate(-50%, -50%)'
    setX = (v) => { float.style.left = v + 'px' }; setY = (v) => { float.style.top = v + 'px' }
  }
  const show = (on) => {
    if (g && !reduce) g.to(float, { opacity: on ? 1 : 0, scale: on ? 1 : 0.8, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
    else float.style.opacity = on ? 1 : 0
  }
  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      setPreview(float, row.dataset.img, row.dataset.n)
      show(true)
    })
    row.addEventListener('mouseleave', () => show(false))
  })
  list.addEventListener('mousemove', (e) => { setX(e.clientX); setY(e.clientY) })
  list.addEventListener('mouseleave', () => show(false))
}

function initServices({ $, $$, finePointer, reduce }) {
  const list = $('.svc-list')
  if (!list) return
  const rows = $$('.svc-row', list)
  const toggle = (row) => {
    const open = !row.classList.contains('open')
    rows.forEach((r) => { r.classList.remove('open'); r.setAttribute('aria-expanded', 'false') })
    row.classList.toggle('open', open); row.setAttribute('aria-expanded', String(open))
  }
  rows.forEach((row) => {
    if (!finePointer) row.addEventListener('click', (e) => { if (!e.target.closest('a')) toggle(row) })
    row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { if (!e.target.closest('a')) { e.preventDefault(); toggle(row) } } })
  })
  if (!finePointer) return
  const float = document.createElement('div')
  float.className = 'svc-float'; float.setAttribute('aria-hidden', 'true')
  document.body.appendChild(float)
  const g = window.gsap
  let setX, setY
  if (g && !reduce) {
    g.set(float, { xPercent: -50, yPercent: -50, scale: .8, opacity: 0 })
    setX = g.quickTo(float, 'x', { duration: .45, ease: 'power3' })
    setY = g.quickTo(float, 'y', { duration: .45, ease: 'power3' })
  } else {
    float.style.transform = 'translate(-50%, -50%)'
    setX = (v) => { float.style.left = v + 'px' }
    setY = (v) => { float.style.top = v + 'px' }
  }
  const show = (on) => {
    if (g && !reduce) g.to(float, { opacity: on ? 1 : 0, scale: on ? 1 : .8, duration: .35, ease: 'power3.out', overwrite: 'auto' })
    else float.style.opacity = on ? 1 : 0
  }
  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      setPreview(float, row.dataset.img, row.dataset.n)
      show(true)
    })
    row.addEventListener('mouseleave', () => show(false))
  })
  list.addEventListener('mousemove', (e) => { setX(e.clientX); setY(e.clientY) })
  list.addEventListener('mouseleave', () => show(false))
}

window.PF_FX = Object.assign(window.PF_FX || {}, { initProcess, initServices })
})()
