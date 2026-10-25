// js/fx-spotlight.js — la bande d'images qui suit le curseur (effet « Magnetic Spotlight »).
//
// • Toutes les images .webp des projets (SPOTLIGHT_IMAGES) défilent en boucle dans une bande fixe.
// • La bande glisse vers la hauteur du curseur avec de l'inertie, dans le HERO seulement
//   (au-delà, la section Projets prend le relais avec son slider).
// • Les titres marqués .wake se décalent dans le sillage de la bande (la vitesse de la bande les pousse).
// • Les titres .bl sont en mix-blend-mode: difference : leur couleur s'inverse sur les images.
// Sans souris (téléphone, tablette) : bande décorative dans le hero seulement. Mouvement réduit : bande immobile.
(() => {
'use strict'
const { mediaSources } = window.PF_CLOUD

const CONFIG = {
  follow: 0.075,        // inertie de la bande (plus petit = plus lent)
  restY: 0.24,          // position au repos, en fraction de la hauteur de l'écran
  wakeReach: 125,       // distance (px) sur laquelle la bande influence un titre
  wakeStrength: 2.5,    // force du sillage
  wakeEase: 0.09,       // retour des titres à leur place
  speed: 90,            // vitesse de défilement des images (px/s)
}

function initSpotlight({ D, reduce, finePointer, $, $$ }) {
  const root = $('#spot')
  const images = D.SPOTLIGHT_IMAGES
  if (!root || !images.length) return
  // Mobile : pas de pile d'images en arrière-plan (hero ni page projet) — masquée en CSS, jamais construite
  if (matchMedia('(max-width: 900px)').matches) { root.remove(); return }

  const small = innerWidth < 768
  const tile = small ? 130 : 180
  const gap = 16
  root.style.setProperty('--tile', `${tile}px`)
  const html = images.map((src) => {
    const [cdn, ...fallbacks] = mediaSources(src, 420)   // CDN nouveau dossier → CDN ancien dossier → local
    return `<div class="spot-tile"><img src="${cdn}"${fallbacks.length ? ` data-fb="${fallbacks.join('|')}"` : ''} alt="" loading="lazy" decoding="async"></div>`
  }).join('')
  const setW = images.length * (tile + gap)
  root.innerHTML = `<div class="spot-track">${html}${html}</div>`
  root.style.setProperty('--spot-set', `${setW}px`)
  root.style.setProperty('--spot-dur', `${setW / CONFIG.speed}s`)

  const H = root.offsetHeight || tile + 20
  const hero = $('#accueil')
  const restY = () => innerHeight * CONFIG.restY
  let targetY = restY(), curY = targetY, prevY = curY, vel = 0
  const apply = () => { root.style.transform = `translate3d(0, ${(curY - H / 2).toFixed(1)}px, 0)` }
  apply()

  /* Sans souris : bande décorative visible seulement tant que le hero est à l'écran */
  if (!finePointer) {
    new IntersectionObserver(([e]) => root.classList.toggle('is-off', !e.isIntersecting), { threshold: 0.15 }).observe(hero)
    return
  }
  if (reduce) return

  /* Hauteur visée = celle du curseur ; la bande ne vit que dans le hero : elle se masque dès que
     SA position sort de #accueil (la règle est « seulement dans le hero »). */
  let pointerSeen = false, pending = false
  const refreshHide = () => {
    pending = false
    const el = document.elementFromPoint(innerWidth / 2, targetY)
    root.classList.toggle('is-off', !(el && el.closest('#accueil')))
  }
  const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(refreshHide) } }
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return
    pointerSeen = true
    targetY = Math.min(Math.max(e.clientY, H / 2), innerHeight - H / 2)
    schedule()
  }, { passive: true })
  addEventListener('scroll', schedule, { passive: true })      // le contenu défile sous la bande
  document.documentElement.addEventListener('mouseleave', () => { targetY = restY(); schedule() })
  addEventListener('resize', () => { if (!pointerSeen) targetY = restY(); schedule() })
  schedule()

  /* Sillage : seuls les titres visibles sont suivis */
  const wake = new Map()
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) wake.set(e.target, wake.get(e.target) || { y: 0 })
    else { e.target.style.transform = ''; wake.delete(e.target) }
  }), { rootMargin: '150px 0px' })
  $$('.wake').forEach((el) => io.observe(el))

  const sig = CONFIG.wakeReach * CONFIG.wakeReach * 2
  const frame = () => {
    curY += (targetY - curY) * CONFIG.follow
    vel = curY - prevY; prevY = curY
    apply()
    const moving = Math.abs(vel) > 0.02
    wake.forEach((st, el) => {
      if (!moving && Math.abs(st.y) < 0.05) { if (st.y !== 0) { st.y = 0; el.style.transform = '' } return }
      const r = el.getBoundingClientRect()
      const rest = r.top + r.height / 2 - st.y
      const gap = rest - curY
      const influence = Math.exp(-(gap * gap) / sig)
      st.y += (vel * influence * CONFIG.wakeStrength - st.y) * CONFIG.wakeEase
      el.style.transform = `translate3d(0, ${st.y.toFixed(2)}px, 0)`
    })
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}
window.PF_FX = Object.assign(window.PF_FX || {}, { initSpotlight })
})()
