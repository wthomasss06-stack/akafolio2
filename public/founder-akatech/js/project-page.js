// js/project-page.js — page d'un projet (/founder-akatech/projets/<slug>).
// Même expérience que la page projet d'AKATech Studio : portable + téléphone qui jouent le projet
// (vidéo .webm sur PC si elle existe, sinon aperçu .webp ; sur mobile : téléphone seul, image
// « responsive », jamais de vidéo), chiffres clés, problème / solution, fonctionnalités, résultat,
// logos des technologies, projet précédent / suivant.
(() => {
'use strict'

/* ───────── Maquettes d'appareils (mêmes réglages que AKATech Studio : lib/device-mockups.js) ───────── */
const FRAME = { w: 736, h: 920 }
const LAPTOP = {
  frame: '/assets/images/devices/laptop-frame.webp',
  content: { w: 1600, h: 736 },   // écran retaillé au format des vidéos / aperçus (2,17:1)
  matrix: 'matrix3d(0.3529797,0.088943712,0,-6.1844928e-05,0.0036208177,0.42626325,0,1.0485343e-05,0,0,1,0,57.798111,208.26776,0,1)',
  clip: 'polygon(58px 208px,691px 389px,688px 731px,60px 518px)',
}
const PHONE = {
  frame: '/assets/images/devices/phone-frame.webp',
  content: { w: 390, h: 844 },
  matrix: 'matrix3d(0.65862013,0.39463363,0,6.3200682e-05,-0.30375198,0.70579444,0,-4.8820134e-05,0,0,1,0,385.89999,58.400002,0,1)',
  clip: 'polygon(411px 74px,393px 74px,382px 78px,372px 89px,365px 102px,156px 623px,149px 646px,149px 670px,153px 683px,161px 695px,174px 706px,348px 801px,365px 807px,382px 807px,394px 802px,405px 791px,412px 779px,433px 725px,434px 720px,438px 712px,439px 707px,443px 699px,450px 678px,456px 665px,466px 636px,475px 615px,479px 602px,488px 581px,495px 560px,504px 539px,508px 526px,517px 505px,521px 492px,525px 484px,540px 442px,544px 434px,548px 421px,552px 413px,556px 400px,562px 387px,569px 366px,575px 353px,582px 332px,587px 322px,593px 322px,593px 315px,596px 314px,596px 310px,598px 309px,601px 299px,604px 294px,605px 289px,618px 257px,622px 241px,622px 219px,619px 207px,616px 200px,610px 191px,596px 178px,554px 151px,552px 151px,550px 149px,546px 148px,542px 144px,538px 143px,537px 141px,531px 140px,530px 142px,526px 142px,524px 140px,524px 133px,517px 133px,516px 128px,509px 128px,508px 127px,508px 123px,504px 123px,503px 125px,499px 125px,432px 83px,425px 79px)',
}

/* ───────── Logos des technologies ───────── */
// Les fichiers sont dans public/assets/icons/… (devicon/ et simple-icons/). Une techno sans logo
// (API navigateur, service sans icône…) reste affichée en pastille de texte : rien n'est inventé.
const DEV = (n) => `/assets/icons/devicon/${n}/${n}-original.svg`
const SIMPLE = (n) => `/assets/icons/simple-icons/${n}.svg`
const TECH_ICONS = [
  [/nextauth/i, null],
  [/next\.?js/i, DEV('nextjs')],
  [/django|drf/i, '/assets/icons/devicon/django/django-plain.svg'],
  [/tailwind/i, DEV('tailwindcss')],
  [/pwa/i, SIMPLE('pwa')],
  [/flask/i, DEV('flask')],
  [/^python$/i, DEV('python')],
  [/mysql/i, DEV('mysql')],
  [/bootstrap/i, DEV('bootstrap')],
  [/leaflet/i, SIMPLE('leaflet')],
  [/chart\.?js/i, DEV('chartjs')],
  [/react router/i, SIMPLE('reactrouter')],
  [/expo|react native/i, SIMPLE('expo')],
  [/^react(\s+\d+)?$/i, DEV('react')],
  [/framer/i, SIMPLE('framer')],
  [/gsap/i, SIMPLE('gsap')],
  [/webgl/i, SIMPLE('webgl')],
  [/vite/i, DEV('vitejs')],
  [/vercel/i, DEV('vercel')],
  [/postgres/i, DEV('postgresql')],
  [/redis/i, DEV('redis')],
  [/cloudinary/i, SIMPLE('cloudinary')],
  [/mapbox/i, SIMPLE('mapbox')],
  [/nestjs/i, DEV('nestjs')],
  [/prisma/i, DEV('prisma')],
  [/express/i, DEV('express')],
  [/typescript/i, DEV('typescript')],
  [/js vanilla|html \/ css \/ js|^javascript$/i, DEV('javascript')],
  [/^html/i, DEV('html5')],
  [/^css$/i, DEV('css3')],
  [/bulma/i, SIMPLE('bulma')],
  [/resend/i, SIMPLE('resend')],
]
const techIcon = (name) => { const hit = TECH_ICONS.find(([re]) => re.test(name)); return hit ? hit[1] : null }

/* ───────── Maquettes ───────── */
function device(kind, inner) {
  const cfg = kind === 'laptop' ? LAPTOP : PHONE
  return `<div class="dv-slot dv-slot--${kind}"><div class="dv-dev"><div class="dv-stage">
      <div class="dv-clip" style="clip-path:${cfg.clip}"><div class="dv-content" style="width:${cfg.content.w}px;height:${cfg.content.h}px;transform:${cfg.matrix}">${inner}</div></div>
      <img class="dv-frame" src="${cfg.frame}" width="${FRAME.w}" height="${FRAME.h}" alt="" aria-hidden="true" draggable="false">
    </div></div></div>`
}

/** Chemin local de la vidéo du projet : « projects/<nom>-preview.webm » si elle est sur Cloudinary. */
function videoPathOf(p, localOf) {
  if (p.hoverVideo) return p.hoverVideo
  const local = localOf(p.img)
  const m = /\/assets\/images\/projects\/([^/]+)\.(?:webp|png|jpe?g)$/i.exec(local || '')
  return m ? `/assets/images/projects/${m[1]}.webm` : ''
}

function initDevices(root, p, { reduce }) {
  const { hasVideo, videoSources, localOf } = window.PF_CLOUD
  const devs = [...root.querySelectorAll('.dv-dev')]
  const fit = (dev) => { const st = dev.querySelector('.dv-stage'); const k = dev.clientWidth / FRAME.w; st.style.transform = `scale(${k || 0.0001})`; if (k) st.classList.add('is-ready') }
  devs.forEach((dev) => { fit(dev); if ('ResizeObserver' in window) new ResizeObserver(() => fit(dev)).observe(dev) })

  // Vidéo : PC uniquement (jamais sur mobile), si le .webm existe et que le mouvement n'est pas réduit.
  const wide = matchMedia('(min-width: 1024px)')
  const vpath = videoPathOf(p, localOf)
  const laptop = root.querySelector('.dv-slot--laptop .dv-content')
  if (!laptop || reduce || !wide.matches || !vpath || !hasVideo(vpath)) return
  const [cdn, local] = videoSources(vpath)
  const still = laptop.querySelector('.dv-main')
  const v = document.createElement('video')
  v.className = 'dv-main dv-video'; v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = 'auto'
  if (still) v.poster = still.currentSrc || still.src
  const srcs = [cdn, local]
  v.src = srcs.shift()
  v.addEventListener('error', () => { if (srcs.length) { v.src = srcs.shift(); v.load() } else { v.remove(); if (still) still.style.visibility = '' } })
  v.addEventListener('playing', () => { if (still) still.style.visibility = 'hidden' })
  laptop.appendChild(v)
  new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.15 }).observe(v)
}

/* ───────── Page ───────── */
function renderProject(p, H) {
  const { D, $, esc, img, waUrl, ICON, num2, projectSlug, projectLive, reduce } = H
  const rub = D.PROJECT_RUBRIQUES[p.id] || p.sub
  const wa = waUrl(D.UI.waProject(p.title, rub))
  const live = projectLive(p)
  const n = D.PROJECTS.length
  const i = D.PROJECTS.findIndex((x) => x.id === p.id)
  const prev = D.PROJECTS[(i - 1 + n) % n], next = D.PROJECTS[(i + 1) % n]
  const href = (x) => `/founder-akatech/projets/${esc(projectSlug(x))}`

  const laptopMedia = img(p.img, `${D.UI.projectAlt} ${p.title}`, { w: 1600, eager: true, cls: 'dv-main' })
  const phoneMedia = img(p.responsive || p.img, `${p.title} — mobile`, { w: 800, eager: true, cls: 'dv-phone-img' })

  const techs = (p.tech || []).map((t) => {
    const icon = techIcon(t)
    return `<li class="tech${icon ? '' : ' tech--text'}">${icon ? `<span class="tech-logo"><img src="${esc(icon)}" alt="" loading="lazy" width="28" height="28" onerror="this.parentNode.remove()"></span>` : ''}<span class="tech-name">${esc(t)}</span></li>`
  }).join('')
  const feats = (p.features || []).map((f) => `<li>${esc(f)}</li>`).join('')
  const card = (x, dir) => `<a class="pd-pn pd-pn--${dir}" href="${href(x)}"><span class="pd-pn-dir">${dir === 'prev' ? '← Projet précédent' : 'Projet suivant →'}</span><span class="pd-pn-title">${esc(x.title)}</span><span class="pd-pn-sub">${esc(x.sub)}</span></a>`

  $('#main').innerHTML = `
  <article class="pd">
    <section class="pd-hero"><div class="wrap">
      <a class="project-back" href="/founder-akatech/index.html#projets">← Tous les projets</a>
      <div class="pd-hero-grid">
        <div class="pd-copy">
          <div class="pd-eyebrow"><span class="sticker">${esc(rub)}</span><span class="pd-status"><i></i>${live ? 'En ligne' : 'Livré'} · ${esc(p.year)}</span></div>
          <h1 class="pd-title">${esc(p.title)}</h1>
          <p class="pd-sub">${esc(p.sub)}</p>
          <p class="pd-pitch">${esc(p.desc || p.problem || '')}</p>
          <div class="pd-links">
            ${live ? `<a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(D.UI.viewProject)} ${ICON.arrow}</a>` : ''}
            <a class="btn btn--ghost" href="${esc(wa)}" target="_blank" rel="noopener">${esc(D.UI.similarProject)} ${ICON.arrow}</a>
          </div>
        </div>
        <div class="pd-visual"><div class="dv" data-dv>${device('laptop', laptopMedia)}${device('phone', phoneMedia)}</div></div>
      </div>
      <dl class="pd-stats">
        <div><dt>Statut</dt><dd>${live ? 'En ligne' : 'Livré'}</dd></div>
        <div><dt>Année</dt><dd>${esc(p.year)}</dd></div>
        <div><dt>Rubrique</dt><dd>${esc(rub)}</dd></div>
        <div><dt>Mon rôle</dt><dd>Conception &amp; développement</dd></div>
      </dl>
    </div></section>

    <section class="pd-body"><div class="wrap">
      <div class="project-detail__story">
        <article><span>01 / ${esc(D.UI.problem)}</span><p>${esc(p.problem || p.desc || '')}</p></article>
        <article><span>02 / ${esc(D.UI.solution)}</span><p>${esc(p.solution || p.desc || '')}</p></article>
      </div>
      ${feats ? `<div class="pd-block"><h2 class="pd-h2">Fonctionnalités</h2><ul class="pd-feats">${feats}</ul></div>` : ''}
      ${p.result ? `<div class="pd-block pd-result"><span class="pd-result-k">03 / Résultat</span><p>${esc(p.result)}</p></div>` : ''}
      ${techs ? `<div class="pd-block"><h2 class="pd-h2">Technologies</h2><ul class="pd-techs">${techs}</ul></div>` : ''}
      <nav class="pd-pn-row" aria-label="Autres projets">${card(prev, 'prev')}${card(next, 'next')}</nav>
    </div></section>
  </article>`

  initDevices($('#main'), p, { reduce })
}

window.PF_PAGE = Object.assign(window.PF_PAGE || {}, { renderProject })
})()
