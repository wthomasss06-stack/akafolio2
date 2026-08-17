'use client'

import { useRef } from 'react'
import SectionHeading from '../components/SectionHeading'
import PageEnd from '../components/PageEnd'
import { useScrollReveal } from '../lib/useScrollReveal'
import { SANDBOX_ITEMS } from '../../data/portfolioData'

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Sandbox({ onNext, onNavigate }) {
  const gridRef = useRef(null)
  useScrollReveal(gridRef, ':scope > div', { y: 26, scale: 0.94, stagger: 0.08 })

  return (
    <>
    <div className="container section">
      <SectionHeading num="04" title="Bac à sable" sub="Mon terrain d'expérimentation" />

      <p className="akatech-editorial-p" style={{ marginBottom: '3rem' }}>
        Ici, il n'y a aucune règle. C'est mon terrain d'expérimentation. J'y teste des idées, des animations, des shaders, des composants. Certaines expériences finiront dans un projet client. D'autres resteront ici pour toujours.
      </p>

      <div ref={gridRef} className="grid-3">
        {SANDBOX_ITEMS.map((item) => (
          <div
            key={item.title}
            style={{
              padding: '1.5rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.1em' }}>
                {item.type.toUpperCase()}
              </span>
              <span
                className="mono"
                style={{
                  fontSize: '0.6rem',
                  padding: '2px 8px',
                  borderRadius: '99px',
                  border: '1px solid var(--border)',
                  color: item.status === 'Archivé' ? 'var(--muted)' : item.status === 'En test' ? '#f5a623' : 'var(--accent)',
                  opacity: item.status === 'Archivé' ? 0.6 : 1,
                }}
              >
                {item.status}
              </span>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>{item.title}</h3>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '4rem', padding: '2rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
        <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
          🧪 Ce bac à sable sera alimenté progressivement avec des prototypes WebGL, GSAP et Three.js extraits de l'ancien portfolio.
        </p>
      </div>
    </div>

      <PageEnd
        ctaTitle="Prêt à démarrer un projet ?"
        ctaText="Offres, délais et tarifs — tout est détaillé, sans surprise."
        ctaLabel="Voir les services"
        onCta={() => onNavigate('services')}
        nextLabel="Services"
        onNext={onNext}
      />
    </>
  )
}
