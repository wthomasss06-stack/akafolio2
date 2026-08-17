'use client'

import { useEffect, useRef } from 'react'
import SectionHeading from '../components/SectionHeading'
import PageEnd from '../components/PageEnd'
import { gsap } from '../lib/gsapSetup'
import { TIMELINE } from '../../data/portfolioData'

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Story({ onNext, onNavigate }) {
  const timelineRef = useRef(null)

  // "Radial Fan Burst" (variante 03 de cards_10_variants_gsap.html),
  // adapté d'un deck de cartes cliquable à une entrée au scroll :
  // chaque ligne démarre en éventail (rotation + décalage radial
  // depuis le centre, légèrement réduite), puis "explose" vers sa
  // position alignée avec un ressort (back.out), en cascade.
  useEffect(() => {
    const el = timelineRef.current
    if (!el) return undefined
    const items = Array.from(el.children)
    if (!items.length) return undefined
    const mid = (items.length - 1) / 2

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        {
          opacity: 0,
          scale: 0.88,
          rotation: (i) => (i - mid) * 6,
          x: (i) => (i - mid) * 36,
          y: -18,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          x: 0,
          y: 0,
          duration: 0.8,
          stagger: 0.09,
          ease: 'back.out(1.5)',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        }
      )
    }, timelineRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
    <div className="container section">
      <SectionHeading num="01" title="Mon histoire" sub="Pourquoi autodidacte depuis le 25 octobre 2025" />

      <div style={{ marginBottom: '5rem' }}>
        <p className="akatech-editorial-p" style={{ marginBottom: '1.5rem' }}>
          Mon parcours a commencé dans le <strong style={{ color: 'var(--text)' }}>réseau et la sécurité informatique</strong>. Cette base m'a appris à construire avec méthode, à penser la fiabilité et à garder une vision propre de l'architecture.
        </p>
        <p className="akatech-editorial-p">
          Avec le temps, j'ai trouvé ma place dans le développement web. Aujourd'hui, je conçois des interfaces qui respirent, qui bougent, et qui donnent une vraie sensation de produit fini. En grande partie <strong style={{ color: 'var(--text)' }}>autodidacte</strong>, j'apprends en construisant, en testant et en améliorant chaque projet.
        </p>
      </div>

      <h3 className="mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '2rem', color: 'var(--accent)' }}>
        PARCOURS
      </h3>

      <div ref={timelineRef} className="akatech-timeline">
        {TIMELINE.map((item, i) => (
          <div
            key={i}
            className="akatech-timeline-item"
          >
            <span className="mono akatech-timeline-date" style={{ fontSize: '0.75rem' }}>{item.date}</span>
            <div className="akatech-timeline-body">
              <h4>{item.title}</h4>
              <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>{item.company}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {item.items.map((li, j) => (
                  <li key={j} style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>— {li}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="mono"
                    style={{ fontSize: '0.6rem', padding: '2px 8px', border: '1px solid var(--border)', borderRadius: '99px', color: 'var(--muted)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

      <PageEnd
        ctaTitle="Voir ça en pratique ?"
        ctaText="De la philosophie à l'exécution : voici comment chaque projet prend forme, étape par étape."
        ctaLabel="Voir ma méthode"
        onCta={() => onNavigate('method')}
        nextLabel="Ma méthode"
        onNext={onNext}
      />
    </>
  )
}
