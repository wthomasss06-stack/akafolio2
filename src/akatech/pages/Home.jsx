'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import PageEnd from '../components/PageEnd'
import { CONTACT, PROJECTS } from '../../data/portfolioData'

const totalProjects = PROJECTS.length
const liveProjects = PROJECTS.filter((p) => p.cat === 'en-ligne').length

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Home({ onNext, onNavigate }) {
  const wrapRef = useRef(null)

  useEffect(() => {
    const root = wrapRef.current
    if (!root) return undefined

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out', duration: 1 } })
        .from('.akatech-hero-title span', { y: 80, opacity: 0, stagger: 0.08 }, 0.1)
        .from('.akatech-hero-eyebrow', { opacity: 0, y: -10 }, 0.1)
        .from('.akatech-hero-tagline', { y: 20, opacity: 0 }, 0.45)
        .from('.akatech-hero-actions', { y: 20, opacity: 0 }, 0.6)
        .from('.akatech-hero-stats > div', { y: 20, opacity: 0, stagger: 0.08 }, 0.75)
        .from('.akatech-hero-shape', { scale: 0, opacity: 0, stagger: 0.1, ease: 'back.out(1.6)' }, 0.5)
    }, root)

    const parallax = (e) => {
      const xPos = e.clientX / window.innerWidth - 0.5
      const yPos = e.clientY / window.innerHeight - 0.5
      gsap.to('.akatech-hero-title', { x: xPos * 12, y: yPos * 12, duration: 1, ease: 'power1.out' })
      gsap.to('.akatech-hero-shape--ring', { x: xPos * -30, y: yPos * -30, duration: 1, ease: 'power1.out' })
      gsap.to('.akatech-hero-shape--square', { x: xPos * 25, y: yPos * 25, duration: 1, ease: 'power1.out' })
      gsap.to('.akatech-hero-shape--dot', { x: xPos * 40, y: yPos * 40, duration: 1, ease: 'power1.out' })
    }
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      root.addEventListener('mousemove', parallax)
    }

    return () => {
      ctx.revert()
      root.removeEventListener('mousemove', parallax)
    }
  }, [])

  return (
    <div ref={wrapRef}>
      <div className="akatech-hero">
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
          <button type="button" className="btn btn-fill" onClick={() => onNavigate('projects')}>
            Voir les projets
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => onNavigate('method')}>
            Ma méthode
          </button>
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
