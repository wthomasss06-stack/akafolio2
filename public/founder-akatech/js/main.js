// js/main.js — construit TOUTE la page à partir de data/portfolioData.js.
// Aucun texte, prix, lien ou image n'est écrit ici : pour changer quelque chose, on modifie les données.
(() => {
'use strict'
const D = window.PORTFOLIO
const { mediaSources, asset } = window.PF_CLOUD
const FX = window.PF_FX || {}
// Ouverture en double-clic : pas de CORS possible, donc pas d'attribut crossorigin sur les images.
const isFile = location.protocol === 'file:'

const $ = (s, c = document) => c.querySelector(s)
const $$ = (s, c = document) => [...c.querySelectorAll(s)]
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
// Souris présente = le pointeur peut survoler. (hover: hover) suffit : les écrans tactiles annoncent hover: none.
const finePointer = matchMedia('(hover: hover)').matches

/* ───────────── Utilitaires ───────────── */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
// Espaces insécables dans les nombres : « 200 000 FCFA » ne se coupe jamais en fin de ligne.
const fmtPrice = (s) => String(s).replace(/(\d)[ \u00a0](?=\d)/g, '$1\u00a0').replace(/ (?=FCFA)/g, '\u00a0')
const waUrl = (text) => `${D.CONTACT.whatsappUrl}?text=${encodeURIComponent(text)}`
const num2 = (n) => String(n).padStart(2, '0')
const ICON = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20.5l1.5-5.4A8.5 8.5 0 1 1 21 11.5Z"/><path d="M9 9.5c.3 2.2 2.300 4.200 4.700 5l1.300-1.200-1.800-.9-.8.6c-.9-.4-1.600-1.100-2-2l.6-.8-.9-1.800L9 9.500Z" fill="currentColor" stroke="none"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 9l7 7 7-7"/></svg>',
}

/** <img> avec CDN d'abord puis dossier local ; `cors` pour les images utilisées comme textures WebGL. */
function img(value, alt, { w, cls = '', eager = false, cors = false } = {}) {
  const [src, ...fbs] = mediaSources(value, w)
  const fb = fbs.filter(Boolean).join('|')
  return `<img src="${esc(src)}"${fb ? ` data-fb="${esc(fb)}"` : ''} alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} loading="${eager ? 'eager' : 'lazy'}" decoding="async"${cors && !isFile ? ' crossorigin="anonymous"' : ''}>`
}
// Repli automatique : CDN nouveau dossier → CDN ancien dossier → fichier local ; si tout échoue, on masque.
document.addEventListener('error', (e) => {
  const t = e.target
  if (!(t instanceof HTMLImageElement)) return
  if (t.dataset.fb) {
    const [next, ...rest] = t.dataset.fb.split('|')
    if (rest.length) t.dataset.fb = rest.join('|'); else delete t.dataset.fb
    t.src = next
  } else t.classList.add('img-fail')
}, true)

const planNum = (price) => (String(price).match(/[\d][\d\s\u00a0]*/g) || []).map((n) => parseInt(n.replace(/\D/g, ''), 10))
const allPlanPrices = D.PRICING_TABS.flatMap((t) => t.plans.flatMap((p) => planNum(p.price)))
const minPrice = (key) => fmtPrice(D.PRICING_TABS.find((t) => t.key === key).plans[0].price)
const projectLive = (p) => p.cat === 'en-ligne' && p.url && /^https?:\/\//.test(p.url)

/* ───────────── Thème (toggle soleil / lune) ───────────── */
function renderToggle() {
  return `<label class="theme-switch" aria-label="${esc(D.UI.themeToggle)}">
    <input type="checkbox" class="theme-switch__checkbox" id="themeToggle">
    <div class="theme-switch__container">
      <div class="theme-switch__clouds"></div>
      <div class="theme-switch__stars-container"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z" fill="currentColor"/></svg></div>
      <div class="theme-switch__circle-container"><div class="theme-switch__sun-moon-container"><div class="theme-switch__moon"><div class="theme-switch__spot"></div><div class="theme-switch__spot"></div><div class="theme-switch__spot"></div></div></div></div>
    </div>
  </label>`
}
function initTheme() {
  const box = $('#themeToggle')
  const apply = (mode) => {
    document.documentElement.dataset.theme = mode
    box.checked = mode === 'dark'
    const m = $('meta[name="theme-color"]'); if (m) m.content = mode === 'dark' ? '#0b0a09' : '#f6f2ec'
  }
  apply(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
  box.addEventListener('change', () => {
    const mode = box.checked ? 'dark' : 'light'
    apply(mode)
    try { localStorage.setItem('theme', mode) } catch (e) { /* stockage indisponible : le choix vaut pour cette visite */ }
  })
}

/* ───────────── Mode tir ───────────── */
function initShootMode() {
  let active = false
  const hiddenWords = new Map()
  const effects = new Set()

  const setActive = (value) => {
    active = value
    document.body.classList.toggle('shoot-active', active)
    $$('[data-shoot-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(active))
      button.setAttribute('aria-label', active ? 'Désactiver le mode tir' : 'Activer le mode tir')
      button.title = active ? 'Désactiver le mode tir' : 'Activer le mode tir'
    })
    if (active) return

    hiddenWords.forEach((word, placeholder) => {
      if (placeholder.isConnected) placeholder.replaceWith(document.createTextNode(word))
    })
    hiddenWords.clear()
    effects.forEach((effect) => {
      effect.getAnimations().forEach((animation) => animation.cancel())
      effect.remove()
    })
    effects.clear()
  }

  const addEffect = (className, x, y) => {
    const effect = document.createElement('span')
    effect.className = className
    effect.style.left = `${x}px`
    effect.style.top = `${y}px`
    document.body.appendChild(effect)
    effects.add(effect)
    return effect
  }

  const impact = (x, y, large = false) => {
    const ring = addEffect(`shoot-impact${large ? ' shoot-impact--large' : ''}`, x, y)
    ring.addEventListener('animationend', () => { effects.delete(ring); ring.remove() }, { once: true })

    for (let i = 0; i < (large ? 14 : 8); i += 1) {
      const spark = addEffect('shoot-spark', x, y)
      const angle = (i / (large ? 14 : 8)) * Math.PI * 2
      const distance = (large ? 72 : 42) + Math.random() * 34
      spark.style.setProperty('--shoot-x', `${Math.cos(angle) * distance}px`)
      spark.style.setProperty('--shoot-y', `${Math.sin(angle) * distance}px`)
      spark.addEventListener('animationend', () => { effects.delete(spark); spark.remove() }, { once: true })
    }
  }

  const dropWordAtPoint = (target, x, y) => {
    const range = document.caretRangeFromPoint?.(x, y)
    let textNode = range?.startContainer
    let offset = range?.startOffset
    if (!textNode || typeof offset !== 'number') return
    if (textNode.nodeType === Node.ELEMENT_NODE) {
      const child = textNode.childNodes[offset] || textNode.childNodes[offset - 1]
      if (!child) return
      const walker = document.createTreeWalker(child, NodeFilter.SHOW_TEXT)
      const childText = child.nodeType === Node.TEXT_NODE ? child : walker.nextNode()
      if (!childText) return
      offset = childText === textNode.childNodes[offset] ? 0 : childText.textContent.length
      textNode = childText
    }
    if (textNode.nodeType !== Node.TEXT_NODE || !target.contains(textNode)) return

    const text = textNode.textContent
    const word = [...text.matchAll(/\S+/g)].find((match) => offset >= match.index && offset <= match.index + match[0].length)
    if (!word) return

    const wordRange = document.createRange()
    wordRange.setStart(textNode, word.index)
    wordRange.setEnd(textNode, word.index + word[0].length)
    const bounds = wordRange.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return

    const prefix = textNode.splitText(word.index)
    prefix.splitText(word[0].length)
    const placeholder = document.createElement('span')
    placeholder.className = 'shoot-word-placeholder'
    placeholder.textContent = word[0]
    prefix.parentNode.replaceChild(placeholder, prefix)
    hiddenWords.set(placeholder, word[0])

    const style = getComputedStyle(target)
    const piece = document.createElement('span')
    piece.className = 'shoot-falling-word'
    piece.textContent = word[0]
    piece.style.left = `${bounds.left}px`
    piece.style.top = `${bounds.top}px`
    piece.style.fontFamily = style.fontFamily
    piece.style.fontSize = style.fontSize
    piece.style.fontWeight = style.fontWeight
    piece.style.color = style.color
    document.body.appendChild(piece)
    effects.add(piece)

    const direction = Math.random() > 0.5 ? 1 : -1
    const animation = piece.animate([
      { transform: 'translateY(0) rotate(0)', opacity: 1 },
      { transform: `translate(${direction * (8 + Math.random() * 28)}px, ${100 + Math.random() * 220}px) rotate(${direction * (8 + Math.random() * 34)}deg)`, opacity: 0 },
    ], { duration: 700 + Math.random() * 350, easing: 'cubic-bezier(.45,0,.9,.5)' })
    animation.onfinish = () => { effects.delete(piece); piece.remove() }
  }

  const fire = (event) => {
    if (!active || event.target.closest('a, button, input, select, textarea, summary, .theme-switch, .aka-language-toggle')) return
    const { clientX: x, clientY: y } = event
    const bullet = addEffect('shoot-bullet', window.innerWidth / 2, window.innerHeight + 20)
    const flight = bullet.animate([
      { left: `${window.innerWidth / 2}px`, top: `${window.innerHeight + 20}px` },
      { left: `${x}px`, top: `${y}px` },
    ], { duration: 180, easing: 'ease-in' })
    flight.onfinish = () => {
      effects.delete(bullet)
      bullet.remove()
      if (!active) return
      const hit = document.elementFromPoint(x, y)
      const image = hit?.closest('img')
      const textTarget = hit?.closest('h1, h2, h3, p, li, blockquote, b, strong, .skill, .hero-stat span, .stats span, .proc-n, .svc-n, .sec-num, .plan-price, .tl .d, .tl .t, .tl .c, .proc-title, .svc-title, .pc-title, .rev-quote, .ticker-track span')
      impact(x, y, Boolean(image))
      if (image) {
        image.classList.remove('shoot-image-hit')
        void image.offsetWidth
        image.classList.add('shoot-image-hit')
        image.addEventListener('animationend', () => image.classList.remove('shoot-image-hit'), { once: true })
      } else if (textTarget && $('#main').contains(textTarget)) {
        dropWordAtPoint(textTarget, x, y)
      }
    }
  }

  $$('[data-shoot-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      setActive(!active)
      if (button.classList.contains('shoot-toggle--menu')) {
        $('.burger').click()
      }
    })
  })
  window.addEventListener('click', fire)
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && active) setActive(false)
  })
}

/* ───────────── Barre de navigation + menu mobile ───────────── */
function renderBar() {
  const navItems = D.NAV.filter((n) => n.id !== 'tarifs')
  const links = navItems.map((n) => `<a href="#${n.id}" data-go="${n.id}">${esc(n.label)}</a>`).join('')
  $('#bar').innerHTML = `
    <a class="brand" href="#accueil" data-go="accueil" aria-label="AKATech — accueil"><img src="/assets/images/logo-akatech.webp" alt="" aria-hidden="true"></a>
    <nav class="nav" aria-label="${esc(D.UI.navLabel)}">${links}</nav>
    <div class="bar-right">
      ${window.PF_LANG.html()}
      ${renderToggle()}
      <button class="shoot-toggle" type="button" data-shoot-toggle aria-pressed="false" aria-label="Activer le mode tir" title="Activer le mode tir">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/></svg>
      </button>
      <a class="btn btn--sm nav-cta" href="#${D.NAV_CTA.target}" data-go="${D.NAV_CTA.target}">${esc(D.NAV_CTA.label)}</a>
      <button class="burger" aria-label="${esc(D.UI.menuOpen)}" aria-expanded="false" aria-controls="menu"><span></span></button>
    </div>`
  const menu = document.createElement('div')
  menu.className = 'menu'; menu.id = 'menu'
  const C = D.CONTACT
  const MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
  const LINKEDIN = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.54h.06c.53-1 1.82-2.04 3.75-2.04 4 0 4.74 2.63 4.74 6.05V21h-4v-4.9c0-1.17-.02-2.67-1.63-2.67-1.63 0-1.88 1.27-1.88 2.58V21h-4V9.75Z"/></svg>'
  const contact = (href, icon, label, ext = true) => `<a class="menu-contact__link" href="${esc(href)}" aria-label="${esc(label)}" title="${esc(label)}"${ext ? ' target="_blank" rel="noopener"' : ''}><span class="menu-contact__ico">${icon}</span></a>`
  menu.innerHTML = navItems.map((n) => `<a href="#${n.id}" data-go="${n.id}">${esc(n.label)}</a>`).join('') +
    `<div class="menu-quick-links"><div class="menu-contact" translate="no">` +
      contact(waUrl(D.CONTACT_FORM.waIntro), ICON.wa, 'WhatsApp') +
      (C.linkedin ? contact(C.linkedin, LINKEDIN, 'LinkedIn') : '') +
      contact(`mailto:${C.email}`, MAIL, C.email, false) +
    `</div><div class="menu-lang">${window.PF_LANG.html()}</div></div>` +
    `<button class="shoot-toggle shoot-toggle--menu" type="button" data-shoot-toggle aria-pressed="false" aria-label="Activer le mode tir"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/></svg><span>Mode tir</span></button>` +
    `<a class="btn" href="#${D.NAV_CTA.target}" data-go="${D.NAV_CTA.target}">${esc(D.NAV_CTA.label)}</a>`
  document.body.appendChild(menu)
  window.PF_LANG.sync()
  const burger = $('.burger')
  const setMenu = (open) => { menu.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : '' }
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')))
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false) })
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false) })
  initShootMode()
  // Sur mobile la barre garde le bouton devis du menu : on le cache pour laisser la place au toggle.
  if (matchMedia('(max-width: 900px)').matches) $('.nav-cta').style.display = 'none'
  matchMedia('(max-width: 900px)').addEventListener('change', (e) => { $('.nav-cta').style.display = e.matches ? 'none' : ''; if (!e.matches) setMenu(false) })
}

/* ───────────── Hero ───────────── */
function renderHero() {
  const H = D.HERO
  const skills = Object.values(D.SKILLS).flat().map((s) => s.name)
  const tick = [...skills, ...D.SERVICES.map((s) => s.title)].map((t) => `<span>${esc(t)}</span>`).join('')
  $('#accueil').innerHTML = `
    <div class="wrap">
      <div class="hero-title">
        <h1 aria-label="${esc(H.lines.join(' '))} — ${esc(H.role)}">${H.lines.map((l) => `<span class="hero-line bl wake" aria-hidden="true">${esc(l)}</span>`).join('')}</h1>
      </div>
      <p class="hero-role bl wake">${esc(H.role)}</p>
      <p class="hero-focus">${esc(H.focus)}</p>
      <div class="hero-sub-row">
        <p class="hero-sub bl wake">${esc(H.sub)}</p>
        <div class="hero-cta">
          <div class="row">
            <a class="btn" href="#${H.ctaPrimary.target}" data-go="${H.ctaPrimary.target}">${esc(H.ctaPrimary.label)} ${ICON.arrow}</a>
          </div>
          <p class="hero-note">${esc(H.reassurance)}</p>
        </div>
      </div>
      <div class="hero-stats">${D.STATS.map((s) => `<div class="hero-stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div>
    </div>
    <div class="ticker" aria-hidden="true"><div class="ticker-track">${tick}${tick}</div></div>`
}

/* ───────────── En-tête de section ───────────── */
const secHead = (key, n) => {
  const S = D.SECTIONS[key]
  return `<div class="sec-head"><span class="sec-num">[ ${num2(n)} ]</span><h2 class="sec-title bl wake">${esc(S.title)}</h2>${S.intro ? `<p class="sec-intro bl">${esc(S.intro)}</p>` : ''}</div>`
}

/* ───────────── Projets : slider 3D horizontal (js/fx-projects.js) ; sans WebGL → cartes défilantes ───────────── */
function projectSlug(p) { return String(p.slug || p.title).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g) }
function renderProjects() {
  const card = (p, i) => {
    const slug = projectSlug(p)
    return `<a class="pc" data-i="${i}" href="/founder-akatech/projets/${esc(slug)}" aria-label="${esc(D.UI.viewProject)} : ${esc(p.title)}">
      <div class="pc-media">${img(p.img, `${D.UI.projectAlt} ${p.title}`, { w: 1400 })}</div>
      <div class="pc-info"><h3 class="pc-title">${esc(p.title)}</h3></div>
    </a>`
  }
  $('#projets').innerHTML = `
    <div class="wrap">${secHead('projets', 1)}</div>
    <div class="ps" id="ps">
      <div class="ps-stage">
        <canvas class="ps-gl" role="link" tabindex="0" aria-label="${esc(D.UI.viewProject)} : ${esc(D.PROJECTS[0]?.title || '')}"></canvas>
      </div>
      <div class="ps-track">${D.PROJECTS.map(card).join('')}</div>
    </div>`
}

/* ───────────── Services ───────────── */
function renderServices() {
  $('#services').innerHTML = `<div class="wrap sec">${secHead('services', 2)}
    <div class="svc-list">${D.SERVICES.map((s) => `
      <article class="svc-row" role="button" tabindex="0" data-n="${esc(s.n)}" data-img="${esc(s.img)}" aria-expanded="false">
        <span class="svc-n">[ ${esc(s.n)} ]</span>
        <div class="svc-main"><h3 class="svc-title">${esc(s.title)}</h3><p class="svc-sub">${esc(s.sub)}</p><p class="svc-desc">${esc(s.desc)}</p><ul class="svc-feat">${s.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul><a class="btn btn--sm svc-cta" href="${esc(waUrl(D.UI.waService(s.title)))}" target="_blank" rel="noopener">${esc(D.UI.requestQuote)} ${ICON.arrow}</a></div>
        <div class="svc-thumb">${img(s.img, `${D.UI.projectAlt} — ${s.title}`, { w: 900, eager: true })}</div>
      </article>`).join('')}
    </div></div>`
}
/* ───────────── Tarifs ───────────── */
function planCard(tab, plan, idx) {
  const m = plan.price.match(/^([\d\s\u00a0–-]+?)\s*FCFA(.*)$/)
  const main = m ? fmtPrice(m[1].trim()) : fmtPrice(plan.price)
  const unit = m ? `FCFA${m[2] ? ' ' + m[2].trim() : ''}` : ''
  const isRange = /–/.test(plan.price)
  const wa = waUrl(D.UI.waPlan(plan.title, tab.label, fmtPrice(plan.price)))
  return `<article class="plan${plan.isPopular ? ' plan--pop' : ''}">
    ${plan.isPopular ? `<span class="sticker">${esc(D.UI.popular)}</span>` : ''}
    <span class="plan-name">${esc(plan.title)}</span>
    <p class="plan-price${isRange ? ' plan-price--range' : ''}">${esc(main)}<small>${esc(unit)}</small></p>
    <p class="plan-meta">${esc(D.UI.delivery)} ${esc(plan.delivery)}</p>
    ${plan.desc ? `<p class="plan-desc">${esc(plan.desc)}</p>` : ''}
    <ul class="plan-feat">${(plan.features || []).slice(0, 9).map((f) => `<li><span>${esc(f)}</span></li>`).join('')}${(plan.features || []).length > 9 ? `<li class="more"><span>+ ${(plan.features || []).length - 9} ${esc(D.UI.moreIncluded)}</span></li>` : ''}</ul>
    <a class="btn btn--sm" href="${esc(wa)}" target="_blank" rel="noopener">${esc(D.UI.choose)} ${esc(plan.title)} ${ICON.arrow}</a>
  </article>`
}
function compareTable(tab) {
  const cell = (c) => c === true ? '<td class="y">✓</td>' : c === false ? '<td class="n">—</td>' : `<td>${esc(c)}</td>`
  return `<details class="cmp"><summary>${esc(D.UI.compare)}</summary><div class="cmp-scroll"><table>
    <thead><tr><th></th>${tab.plans.map((p) => `<th>${esc(p.title)}</th>`).join('')}</tr></thead>
    <tbody>${tab.rows.map((r) => `<tr><td>${esc(r.label)}</td>${r.cells.map(cell).join('')}</tr>`).join('')}</tbody>
  </table></div></details>`
}
function renderPricing() {
  $('#tarifs').innerHTML = `<div class="wrap sec">${secHead('tarifs', 3)}
    <div class="tabs" role="tablist" aria-label="${esc(D.UI.tabsLabel)}">${D.PRICING_TABS.map((t, i) => `<button class="tab" role="tab" id="tab-${t.key}" aria-selected="${i === 0}" aria-controls="plans" data-tab="${t.key}">${esc(t.label)}</button>`).join('')}</div>
    <div id="plans" role="tabpanel"></div>
    <ul class="price-note">${D.PRICING_NOTES.map((n) => `<li>${esc(n)}</li>`).join('')}</ul></div>`
  const show = (key) => {
    const tab = D.PRICING_TABS.find((t) => t.key === key)
    $$('.tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === key)))
    $('#plans').setAttribute('aria-labelledby', `tab-${key}`)
    $('#plans').innerHTML = `<div class="plans">${tab.plans.map((p, i) => planCard(tab, p, i)).join('')}</div>` +
      (tab.key === 'saas' ? `<p class="range-note">${esc(D.PRICING_RANGE_NOTE)}</p>` : '') + compareTable(tab)
  }
  $('.tabs').addEventListener('click', (e) => { const b = e.target.closest('.tab'); if (b) show(b.dataset.tab) })
  show(D.PRICING_TABS[0].key)
}

/* ───────────── Process ───────────── */
function renderProcess() {
  $('#process').innerHTML = `<div class="wrap sec">${secHead('process', 4)}
    <ol class="proc-list">${D.PROCESS_STEPS.map((s) => `
      <li class="proc-row" tabindex="0" data-n="${esc(s.n)}" data-img="${esc(s.img)}">
        <span class="proc-n">[ ${esc(s.n)} ]</span>
        <h3 class="proc-title">${esc(s.title)}</h3>
        <div class="proc-info"><span class="proc-tag">${esc(s.tag)}</span><p class="proc-desc">${esc(s.desc)}</p></div>
        <div class="proc-thumb">${img(s.img, s.imgAlt || s.title, { w: 800, eager: true })}</div>
      </li>`).join('')}</ol></div>`
}

/* ───────────── Avis ───────────── */
function renderReviews() {
  $('#avis').innerHTML = `<div class="wrap sec">${secHead('avis', 5)}
    <div class="rev-grid">${D.TESTIMONIALS.map((t) => `
      <figure class="rev rv"><blockquote>${esc(t.quote)}</blockquote>
        <figcaption><b>${esc(t.name)}</b>${esc(t.role)}<span> · ${esc(t.project)}</span></figcaption></figure>`).join('')}
    </div></div>`
}

/* ───────────── À propos ───────────── */
function renderAbout() {
  const A = D.ABOUT
  const groups = Object.entries(D.SKILLS).map(([k, list]) => `<div><h3>${esc(D.SKILL_GROUP_LABELS[k] || k)}</h3><div class="chips">${list.map((s) => `<span class="skill">${s.icon ? `<img src="${esc(asset(s.icon))}" alt="" loading="lazy" width="18" height="18">` : ''}${esc(s.name)}</span>`).join('')}</div></div>`).join('')
  $('#apropos').innerHTML = `<div class="wrap sec">${secHead('apropos', 6)}
    <div class="about-grid">
      <figure class="portrait rv"><img src="${esc(asset(A.photo))}" alt="${esc(A.photoAlt)}" loading="lazy" decoding="async"><span class="sticker">${esc(D.CONTACT.location.split(',')[0])}</span></figure>
      <div class="rv">
        <h3 class="about-h">${esc(A.heading)}</h3>
        <div class="about-p">${A.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <div class="stats">${D.STATS.map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('')}</div>
        <div class="skills">${groups}</div>
        <ul class="tl">${D.TIMELINE.slice(0, A.timelineCount).map((t) => `<li><span class="d">${esc(t.date)}</span><div class="t">${esc(t.title)}</div><div class="c">${esc(t.company)}</div></li>`).join('')}</ul>
        <div class="about-actions">
          <a class="btn" href="${esc(asset(D.CONTACT.cv))}" download>${esc(A.cvLabel)} ${ICON.down}</a>
          <a class="btn btn--ghost" href="${esc(D.CONTACT.agencyUrl)}" target="_blank" rel="noopener">${esc(D.CONTACT.agency)} ${ICON.arrow}</a>
        </div>
      </div>
    </div></div>`
}

/* ───────────── FAQ ───────────── */
function renderFaq() {
  $('#faq').innerHTML = `<div class="wrap sec">${secHead('faq', 7)}
    <div class="faq-list">${D.FAQ_ITEMS.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></div>`
}

/* ───────────── Contact ───────────── */
function renderContact() {
  const C = D.CONTACT, F = D.CONTACT_FORM
  $('#contact').innerHTML = `<div class="wrap sec">${secHead('contact', 8)}
      <form class="form rv" id="form" novalidate>
        <div class="field"><label for="f-name">${esc(D.UI.formName)}</label><input id="f-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="f-contact">${esc(D.UI.formContact)}</label><input id="f-contact" name="contact" autocomplete="tel" required></div>
        <div class="field"><label for="f-type">${esc(D.UI.formNeed)}</label><select id="f-type" name="type">${F.types.map((t) => `<option>${esc(t)}</option>`).join('')}</select></div>
        <div class="field"><label for="f-msg">${esc(D.UI.formProject)}</label><textarea id="f-msg" name="msg" required></textarea></div>
        <p class="form-err" id="form-err" role="alert" aria-live="polite"></p>
        <button class="btn" type="submit">${esc(D.UI.formSend)}</button>
        <p class="form-note">${esc(F.note)}</p>
      </form>
    </div>`
  $('#form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const f = new FormData(e.target), v = (k) => String(f.get(k) || '').trim()
    if (!v('name') || !v('contact') || !v('msg')) { $('#form-err').textContent = D.UI.formError; return }
    const button = $('#form button[type="submit"]')
    const error = $('#form-err')
    const contact = v('contact')
    const isEmail = contact.includes('@')
    button.disabled = true
    button.textContent = D.UI.formSending
    error.textContent = ''
    error.classList.remove('form-success')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: v('name'),
          email: isEmail ? contact : '',
          whatsapp: isEmail ? '' : contact,
          preferredContact: isEmail ? 'email' : 'whatsapp',
          projectType: v('type'),
          message: v('msg'),
          company: '',
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        const fieldError = result.fieldErrors && Object.values(result.fieldErrors)[0]
        throw new Error(fieldError || result.error || D.UI.formSendError)
      }
      error.textContent = D.UI.formSent
      error.classList.add('form-success')
      e.target.reset()
    } catch (err) {
      error.textContent = err instanceof Error ? err.message : D.UI.formSendError
    } finally {
      button.disabled = false
      button.textContent = D.UI.formSend
    }
  })
}

/* ───────────── Footer plein écran (même expérience qu'Appdesktop — js/fx-footer.js) ───────────── */
function renderFooter() {
  window.PF_FX.buildFooter({ D, esc })
}


/* ───────────── Avis : un avis à la fois, défilement automatique toutes les 4 s ───────────── */
function initReviews() {
  const grid = $('#avis .rev-grid'); if (!grid) return
  const slides = [...grid.children]
  if (slides.length < 2) return
  const dots = document.createElement('div')
  dots.className = 'rev-dots'
  dots.innerHTML = slides.map((_, i) => `<button type="button" aria-label="Avis ${i + 1}"></button>`).join('')
  grid.after(dots)
  const buttons = [...dots.children]
  let idx = 0, timer = 0, resumeAt = 0, inView = false
  const mark = () => buttons.forEach((b, i) => b.setAttribute('aria-current', String(i === idx)))
  const go = (i, smooth = true) => {
    idx = (i + slides.length) % slides.length
    const el = slides[idx]
    grid.scrollTo({ left: el.offsetLeft - (grid.clientWidth - el.clientWidth) / 2, behavior: smooth && !reduce ? 'smooth' : 'auto' })
    mark()
  }
  // Un glissement du doigt met l'index à jour, et relance le minuteur après une pause
  let scrollEnd = 0
  grid.addEventListener('scroll', () => {
    clearTimeout(scrollEnd)
    scrollEnd = setTimeout(() => {
      const mid = grid.scrollLeft + grid.clientWidth / 2
      let best = 0, gap = Infinity
      slides.forEach((el, i) => { const d = Math.abs(el.offsetLeft + el.clientWidth / 2 - mid); if (d < gap) { gap = d; best = i } })
      if (best !== idx) { idx = best; mark() }
    }, 90)
  }, { passive: true })
  const touched = () => { resumeAt = Date.now() + 4000 }
  grid.addEventListener('pointerdown', touched, { passive: true })
  grid.addEventListener('touchstart', touched, { passive: true })
  buttons.forEach((b, i) => b.addEventListener('click', () => { touched(); go(i) }))
  const tick = () => { if (inView && !document.hidden && Date.now() >= resumeAt) go(idx + 1) }
  new IntersectionObserver(([e]) => { inView = e.isIntersecting }, { threshold: .35 }).observe(grid)
  timer = setInterval(tick, 4000)
  mark()
  return () => clearInterval(timer)
}

/* ───────────── SEO : titre, description, réseaux sociaux, JSON-LD ───────────── */
function applySeo() {
  const S = D.SEO, C = D.CONTACT
  const abs = (p) => (p.startsWith('http') ? p : S.url.replace(/\/$/, '') + p)
  document.title = S.title
  const set = (sel, attr, val) => { const el = $(sel); if (el) el.setAttribute(attr, val) }
  set('meta[name="description"]', 'content', S.description)
  set('meta[property="og:title"]', 'content', S.title)
  set('meta[property="og:description"]', 'content', S.description)
  set('meta[property="og:url"]', 'content', S.url)
  set('meta[property="og:image"]', 'content', abs(S.image))
  set('link[rel="canonical"]', 'href', S.url)
  const prices = allPlanPrices
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${S.url}#site`, url: S.url, name: C.name, inLanguage: 'fr' },
      {
        '@type': 'Person', '@id': `${S.url}#person`, name: `${C.name} ${C.shortName}`, jobTitle: C.title, url: S.url, image: abs(S.image),
        email: C.email, telephone: C.phone, sameAs: [C.linkedin, C.github, C.facebook, C.agencyUrl],
        worksFor: { '@type': 'Organization', name: C.agency, url: C.agencyUrl },
        address: { '@type': 'PostalAddress', addressLocality: 'Abidjan', addressCountry: 'CI' },
      },
      {
        '@type': 'ProfessionalService', name: `${C.name} — ${C.title}`, url: S.url, image: abs(S.image), telephone: C.phone, email: C.email,
        areaServed: ["Côte d'Ivoire", 'Afrique de l’Ouest'], priceRange: `${Math.min(...prices).toLocaleString('fr-FR')} FCFA - ${Math.max(...prices).toLocaleString('fr-FR')} FCFA`,
        address: { '@type': 'PostalAddress', addressLocality: 'Abidjan', addressCountry: 'CI' }, founder: { '@id': `${S.url}#person` },
      },
    ],
  }
  const tag = document.createElement('script'); tag.type = 'application/ld+json'; tag.textContent = JSON.stringify(ld)
  document.head.appendChild(tag)
}

/* ───────────── Défilement fluide, ancres, apparitions ───────────── */
let lenis = null
function initScroll() {
  if (window.Lenis && !reduce && finePointer) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    window.__lenis = lenis
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((t) => lenis.raf(t * 1000))
      gsap.ticker.lagSmoothing(0)
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }; requestAnimationFrame(raf)
    }
  }
  const goTo = (id) => {
    const el = document.getElementById(id)
    if (!el) { location.assign(`/founder-akatech/index.html${id === 'accueil' ? '' : '#' + id}`); return } // depuis la page d'un projet
    const y = id === 'accueil' ? 0 : el.getBoundingClientRect().top + scrollY - 70
    if (lenis) lenis.scrollTo(y, { duration: 1.4 }); else scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
    history.replaceState(null, '', id === 'accueil' ? location.pathname : `#${id}`)
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-go]'); if (!a) return
    e.preventDefault(); goTo(a.dataset.go)
  })
  // lien actif dans la barre
  const links = $$('.nav a')
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) links.forEach((l) => l.classList.toggle('is-on', l.dataset.go === en.target.id)) })
  }, { rootMargin: '-45% 0px -50% 0px' })
  D.NAV.forEach((n) => { const s = document.getElementById(n.id); if (s) io.observe(s) })
  if (location.hash.length > 1) setTimeout(() => goTo(location.hash.slice(1)), 400)
}
function initReveal() {
  if (reduce) { document.documentElement.classList.add('rv-off'); return }
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
  $$('.rv').forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 90}ms`; io.observe(el) })
}

/* ───────────── Démarrage ───────────── */
{ const sk = $('.skip'); if (sk) sk.textContent = D.UI.skip }
renderBar(); initTheme()
renderHero(); renderProjects(); renderServices(); renderProcess()
renderReviews(); renderAbout(); renderFaq(); renderContact(); renderFooter()
let detailTitle = ''
const detailMatch = location.pathname.match(/^\/founder-akatech\/projets\/([^/]+)\/?$/)
if (detailMatch) {
  const slug = decodeURIComponent(detailMatch[1])
  const p = D.PROJECTS.find((item) => projectSlug(item) === slug)
  if (p) {
    detailTitle = `${p.title} — Portfolio M'Bollo Aka`
    window.PF_PAGE.renderProject(p, { D, $, $$, esc, img, waUrl, ICON, num2, projectSlug, projectLive, reduce, finePointer })
    document.body.classList.add('is-project-detail')
  } else { location.replace('/founder-akatech/index.html#projets') }
}
applySeo(); if (detailTitle) document.title = detailTitle; initScroll(); initReveal(); initReviews()

const ctx = { D, reduce, finePointer, lenis, $, $$, esc }
// Effets visuels : lancés après le premier affichage (polices chargées), sans bloquer la page.
const fx = async () => {
  try { await document.fonts?.ready } catch (e) { /* sans importance */ }
  for (const name of ['initSpotlight', 'initProcess', 'initServices', 'initProjects', 'initFooter']) {
    try { FX[name]?.(ctx) } catch (err) { console.warn(`[fx] ${name}`, err) }   // chaque effet est isolé : une erreur n'arrête pas les autres
  }
}
fx().catch((err) => console.error('[fx]', err))
})()
