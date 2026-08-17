'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsapSetup'
import PageEnd from '../components/PageEnd'
import LuxuryAction from '../components/LuxuryAction'
import { CONTACT, PROJECTS } from '../../data/portfolioData'

const totalProjects = PROJECTS.length
const liveProjects = PROJECTS.filter((p) => p.cat === 'en-ligne').length

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Home({ onNext, onNavigate }) {
  const wrapRef = useRef(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const root = wrapRef.current
    const hero = heroRef.current
    if (!root || !hero) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out', duration: reduceMotion ? 0.4 : 1 } })
        .from('.akatech-hero-title span', { y: reduceMotion ? 0 : 80, opacity: 0, stagger: reduceMotion ? 0 : 0.08 }, 0.1)
        .from('.akatech-hero-eyebrow', { opacity: 0, y: reduceMotion ? 0 : -10 }, 0.1)
        .from('.akatech-hero-tagline', { y: reduceMotion ? 0 : 20, opacity: 0 }, 0.45)
        .from('.akatech-hero-actions', { y: reduceMotion ? 0 : 20, opacity: 0 }, 0.6)
        .from('.akatech-hero-stats > div', { y: reduceMotion ? 0 : 20, opacity: 0, stagger: reduceMotion ? 0 : 0.08 }, 0.75)
        .from('.akatech-hero-shape', { scale: 0, opacity: 0, stagger: reduceMotion ? 0 : 0.1, ease: reduceMotion ? 'power1.out' : 'back.out(1.6)' }, 0.5)

      if (!reduceMotion) {
        // Flottement continu des formes — même principe que les objets
        // 3D du hero de référence (yoyo + repeat infini), une
        // amplitude/durée propre à chaque forme pour casser toute
        // symétrie et donner une impression "vivante" même sans
        // interaction.
        gsap.to('.akatech-hero-shape--ring', { y: '+=14', rotation: 10, duration: 3.4, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        gsap.to('.akatech-hero-shape--square', { y: '-=12', rotation: -14, duration: 3.9, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        gsap.to('.akatech-hero-shape--dot', { y: '+=10', x: '+=8', duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' })

        // Le hero s'efface et se disperse en douceur à mesure qu'on
        // scrolle vers le CTA / footer — même principe que la
        // référence (scrub lié au scroll naturel, pas d'épinglage).
        gsap.timeline({
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
        })
          .to('.akatech-hero-title', { scale: 0.85, autoAlpha: 0.15, y: -60 }, 0)
          .to('.akatech-hero-shape--ring', { y: '-=160', x: '-=50', autoAlpha: 0 }, 0)
          .to('.akatech-hero-shape--square', { y: '-=130', x: '+=60', autoAlpha: 0 }, 0)
          .to('.akatech-hero-shape--dot', { y: '-=180', autoAlpha: 0 }, 0)
          .to('.akatech-hero-eyebrow, .akatech-hero-tagline, .akatech-hero-actions, .akatech-hero-stats', { autoAlpha: 0, y: -24 }, 0)
      }
    }, root)

    let removeMouseListener = () => {}
    if (canHover && !reduceMotion) {
      const qTitleX = gsap.quickTo('.akatech-hero-title', 'x', { duration: 1, ease: 'power1.out' })
      const qTitleY = gsap.quickTo('.akatech-hero-title', 'y', { duration: 1, ease: 'power1.out' })
      const qRingX = gsap.quickTo('.akatech-hero-shape--ring', 'x', { duration: 1, ease: 'power1.out' })
      const qRingY = gsap.quickTo('.akatech-hero-shape--ring', 'y', { duration: 1, ease: 'power1.out' })
      const qSquareX = gsap.quickTo('.akatech-hero-shape--square', 'x', { duration: 1, ease: 'power1.out' })
      const qSquareY = gsap.quickTo('.akatech-hero-shape--square', 'y', { duration: 1, ease: 'power1.out' })
      const qDotX = gsap.quickTo('.akatech-hero-shape--dot', 'x', { duration: 1, ease: 'power1.out' })
      const qDotY = gsap.quickTo('.akatech-hero-shape--dot', 'y', { duration: 1, ease: 'power1.out' })
      // Projecteur sur la grille de fond du hero (variables CSS
      // --mx/--my lues par le mask-image de .akatech-hero-grid).
      const qGridX = gsap.quickTo(hero, '--mx', { duration: 0.6, ease: 'power2.out' })
      const qGridY = gsap.quickTo(hero, '--my', { duration: 0.6, ease: 'power2.out' })

      const parallax = (e) => {
        const rect = hero.getBoundingClientRect()
        const xPos = e.clientX / window.innerWidth - 0.5
        const yPos = e.clientY / window.innerHeight - 0.5
        qTitleX(xPos * 12); qTitleY(yPos * 12)
        qRingX(xPos * -30); qRingY(yPos * -30)
        qSquareX(xPos * 25); qSquareY(yPos * 25)
        qDotX(xPos * 40); qDotY(yPos * 40)
        qGridX(((e.clientX - rect.left) / rect.width) * 100)
        qGridY(((e.clientY - rect.top) / rect.height) * 100)
      }
      hero.addEventListener('mousemove', parallax)
      removeMouseListener = () => hero.removeEventListener('mousemove', parallax)
    }

    return () => {
      ctx.revert()
      removeMouseListener()
    }
  }, [])

  return (
    <div ref={wrapRef}>
      <div className="akatech-hero" ref={heroRef}>
        <div className="akatech-hero-grid" aria-hidden="true" />
        <span className="akatech-hero-shape akatech-hero-shape--ring" />
        <span className="akatech-hero-shape akatech-hero-shape--square" />
        <span className="akatech-hero-shape akatech-hero-shape--dot" />

        <span
          className="mono akatech-hero-eyebrow"
          style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.2em', marginBottom: '1.5rem' }}
        >
          DÉVELOPPEUR WEB FULL-STACK
        </span>

        <h1 className="akatech-hero-title">
          <span>M&apos;Bollo </span><span className="accent">Aka</span>
        </h1>

        <p
          className="akatech-hero-tagline"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', marginTop: '1.5rem', maxWidth: '50ch', lineHeight: 1.7 }}
        >
          Je ne présente pas seulement mes projets. Je montre <strong style={{ color: 'var(--text)' }}>comment je les construis</strong>.
          Autodidacte depuis le 25 octobre 2025. Basé à {CONTACT.location}.
        </p>

        <div className="akatech-hero-actions" style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <LuxuryAction label="Voir les projets" onClick={() => onNavigate('projects')} />
          <LuxuryAction label="Ma méthode" onClick={() => onNavigate('method')} />
        </div>

        <div className="akatech-hero-stats" style={{ marginTop: '4rem', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
          <div>
            <span className="mono accent" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{totalProjects}</span>
            <p className="mono" style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>PROJETS LIVRÉS</p>
          </div>
          <div>
            <span className="mono accent" style={{ fontSize: '1.5rem', fontWeight: 700 }}>3+</span>
            <p className="mono" style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>ANNÉES D&apos;EXPÉRIENCE</p>
          </div>
          <div>
            <span className="mono accent" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{liveProjects}</span>
            <p className="mono" style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>EN PRODUCTION</p>
          </div>
        </div>
      </div>

      <PageEnd
        ctaTitle="Un projet en tête ?"
        ctaText="Discutons de ce que vous voulez construire — je réponds sous 24h."
        ctaLabel="Me contacter"
        onCta={() => onNavigate('contact')}
        nextLabel="Mon histoire"
        onNext={onNext}
      />
    </div>
  )
}
