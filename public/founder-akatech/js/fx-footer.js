// js/fx-footer.js — Footer plein écran, même expérience qu'Appdesktop (src/Appdesktop.jsx > Footer) :
//   • rideau : le footer reste épinglé en bas pendant que la dernière section (#contact) défile par-dessus
//     (ScrollTrigger pin, desktop uniquement) ;
//   • carte 3D qui flotte et s'incline avec le pointeur ;
//   • au survol d'un mot, ses lettres se dispersent et les autres se floutent ;
//   • fond de faisceaux lumineux (canvas 2D léger, en pause hors écran) ;
//   • la barre du haut s'efface quand le footer est atteint.
(() => {
'use strict'

const scatterWord = (text, cls = '', tag = 'div', attrs = '') =>
  `<${tag} class="fts-item fts-word ${cls}" ${attrs}>${[...text].map((c) => `<span class="fts-char">${c === ' ' ? '&nbsp;' : c.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`).join('')}</${tag}>`

function buildFooter({ D, esc }) {
  const C = D.CONTACT
  const agencyHost = String(C.agencyUrl || '').replace(/^https?:\/\//, '').replace(/\/$/, '')
  const nav = D.NAV.filter((n) => n.id !== 'tarifs').map((n) => `<a href="#${esc(n.id)}" data-go="${esc(n.id)}">${esc(n.label)}</a>`).join('')
  const social = [['WhatsApp', C.whatsappUrl], ['LinkedIn', C.linkedin], ['GitHub', C.github], ['Facebook', C.facebook]]
    .filter(([, u]) => u).map(([l, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(l)}</a>`).join('')
  document.getElementById('footer').innerHTML = `
    <div class="ft-zone">
      <canvas class="ft-beams" aria-hidden="true"></canvas>
      <div class="ft-band"><div class="ft-inner">
        <div class="ft-float"><div class="fts-card">
          <div class="fts-grid" translate="no">
            <div class="fts-row fts-row--name">${scatterWord('M’Bollo', 'fts-word--bright')}${scatterWord('Aka', 'fts-word--bright')}</div>
            <div class="fts-row">${scatterWord('dev', 'fts-word--muted')}${scatterWord('web', 'fts-word--muted')}</div>
            <div class="fts-row fts-row--logo">${scatterWord('CEO', 'fts-word--muted')}
              <div class="fts-item fts-logo-wrap"><img class="fts-logo" src="/assets/images/logo-akatech.webp" alt="Logo AKATech — M'Bollo Aka" loading="lazy" onerror="this.style.display='none'"></div>
              ${scatterWord('Founder', 'fts-word--muted')}</div>
            <div class="fts-row fts-row--small">${scatterWord(C.email, 'fts-word--link', 'a', `href="mailto:${esc(C.email)}"`)}${scatterWord(agencyHost, 'fts-word--link', 'a', `href="${esc(C.agencyUrl)}" target="_blank" rel="noopener"`)}</div>
          </div>
          <div class="fts-footer-bar">
            <nav class="ft-nav" aria-label="Navigation du pied de page">${nav}</nav>
            <div class="ft-social">${social}</div>
            <span class="ft-copy">${esc(D.FOOTER.legal)}</span>
          </div>
        </div></div>
      </div></div>
    </div>`
}

function beams(canvas, { reduce }) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}
  let w = 0, h = 0, t = 0, raf = 0, visible = false
  const list = Array.from({ length: 12 }, () => ({ x: Math.random(), w: .05 + Math.random() * .11, sp: .012 + Math.random() * .03, a: .05 + Math.random() * .1, ph: Math.random() * 6.28 }))
  const resize = () => {
    const r = canvas.getBoundingClientRect(); const k = .5            // moitié de résolution : suffisant pour des halos flous
    w = canvas.width = Math.max(2, Math.round(r.width * k)); h = canvas.height = Math.max(2, Math.round(r.height * k))
  }
  const draw = () => {
    ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = 'lighter'
    for (const b of list) {
      const x = (((b.x + t * b.sp) % 1.5) - .25) * w, bw = b.w * w
      const g = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0)
      const a = b.a * (.65 + .35 * Math.sin(t * .6 + b.ph))
      g.addColorStop(0, 'rgba(255,85,0,0)'); g.addColorStop(.5, `rgba(255,120,50,${a})`); g.addColorStop(1, 'rgba(255,85,0,0)')
      ctx.save(); ctx.translate(x, 0); ctx.transform(1, 0, -.38, 1, 0, 0); ctx.fillStyle = g; ctx.fillRect(-bw / 2, -h * .1, bw, h * 1.3); ctx.restore()
    }
    ctx.globalCompositeOperation = 'source-over'
  }
  const loop = () => { raf = requestAnimationFrame(loop); if (!visible) return; t += .016; draw() }
  resize(); draw()
  addEventListener('resize', resize)
  new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: '100px' }).observe(canvas)
  if (!reduce) raf = requestAnimationFrame(loop)
  return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize) }
}

function initFooter({ reduce, finePointer, $, $$ }) {
  const footer = document.getElementById('footer')
  if (!footer || !footer.querySelector('.fts-card')) return
  const g = window.gsap, ST = window.ScrollTrigger
  const card = $('.fts-card', footer), floater = $('.ft-float', footer)
  const items = $$('.fts-item', footer)

  beams($('.ft-beams', footer), { reduce })

  // Barre du haut : elle s'efface quand le footer est atteint
  const bar = $('#bar')
  if (bar) new IntersectionObserver(([e]) => bar.classList.toggle('is-away', e.isIntersecting), { threshold: .45 }).observe(footer)

  if (!g) return
  if (!reduce) g.to(floater, { y: -10, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })

  // Rideau : footer épinglé, #contact (ou la page projet) passe par-dessus
  if (ST) {
    g.registerPlugin(ST)
    const curtain = $('#contact') || $('#main')
    const mm = g.matchMedia()
    mm.add('(min-width: 769px)', () => {
      const h = footer.getBoundingClientRect().height
      if (curtain) { g.set(curtain, { marginBottom: -h }); curtain.classList.add('ft-curtain') }
      const st = ST.create({ trigger: footer, start: 'bottom bottom', end: 'max', pin: true, pinSpacing: true, refreshPriority: -1 })
      return () => { if (curtain) { g.set(curtain, { clearProps: 'marginBottom' }); curtain.classList.remove('ft-curtain') }; st.kill() }
    })
  }

  if (!finePointer || reduce) return
  // Tilt 3D
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5
    g.to(card, { rotateY: x * 10, rotateX: -y * 10, duration: .6, ease: 'power2.out' })
  })
  card.addEventListener('pointerleave', () => g.to(card, { rotateX: 0, rotateY: 0, duration: .8, ease: 'power2.out' }))

  // Dispersion des lettres au survol d'un mot
  const rand = (a, b) => Math.round(Math.random() * (b - a) + a)
  items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      g.to(card, { rotateX: 0, rotateY: 0, duration: .4 })
      items.forEach((o) => {
        if (o !== item) g.to(o, { opacity: .18, filter: 'blur(7px)', scale: .96, duration: .4, ease: 'power2.out' })
        else {
          g.to(o, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: .3 })
          o.querySelectorAll('.fts-char').forEach((ch) => g.to(ch, { xPercent: rand(-28, 28), yPercent: rand(-55, 22), rotate: rand(-18, 18), duration: .5, ease: 'back.out(1.7)' }))
        }
      })
    })
    item.addEventListener('mouseleave', () => {
      items.forEach((o) => {
        g.to(o, { opacity: 1, filter: 'blur(0px)', scale: 1, duration: .4, ease: 'power2.out' })
        g.to(o.querySelectorAll('.fts-char'), { xPercent: 0, yPercent: 0, rotate: 0, duration: .4, ease: 'power2.out', stagger: .01 })
      })
    })
  })
}

window.PF_FX = Object.assign(window.PF_FX || {}, { buildFooter, initFooter })
})()
