'use client'

import { useRef } from 'react'
import SectionHeading from '../components/SectionHeading'
import PageEnd from '../components/PageEnd'
import { useScrollReveal } from '../lib/useScrollReveal'
import { METHOD_STEPS, SKILLS } from '../../data/portfolioData'

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Method({ onNext, onNavigate }) {
  const stepsRef = useRef(null)
  const skillsGridRef = useRef(null)
  const stackRef = useRef(null)
  useScrollReveal(stepsRef, ':scope > div', { y: 30, stagger: 0.12 })
  useScrollReveal(skillsGridRef, ':scope > div', { y: 24, scale: 0.94, stagger: 0.1 })
  useScrollReveal(stackRef, '.akatech-stack-badge', { y: 16, stagger: 0.03, duration: 0.5 })

  return (
    <>
    <div className="container section">
      <SectionHeading num="02" title="Ma méthode" sub="Comment naît un projet" />

      <p className="akatech-editorial-p" style={{ marginBottom: '4rem' }}>
        Chaque projet commence toujours de la même façon. Ce n'est pas une recette magique — c'est un système que j'affine à chaque livraison.
      </p>

      <div ref={stepsRef} className="akatech-method-grid">
        {METHOD_STEPS.map((step) => (
          <div
            key={step.num}
            className="akatech-method-grid__item"
          >
            <span
              className="mono akatech-method-grid__num"
            >
              {step.num}
            </span>
            <div className="akatech-method-grid__body">
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '2rem', color: 'var(--accent)' }}>
        AKATECH SKILLS — MON SYSTÈME
      </h3>

      <div ref={skillsGridRef} className="grid-3 akatech-skills-grid">
        <div className="akatech-skill-card">
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>AKATECH BACKEND</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
            <li>✓ Architecture</li>
            <li>✓ Conventions</li>
            <li>✓ Structure</li>
            <li>✓ Clean Code</li>
            <li>✓ Sécurité</li>
          </ul>
        </div>

        <div className="akatech-skill-card">
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>AKATECH FRONTEND</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
            <li>✓ Animation</li>
            <li>✓ Performance</li>
            <li>✓ Responsive</li>
            <li>✓ Accessibilité</li>
          </ul>
        </div>

        <div className="akatech-skill-card">
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>AKATECH DESIGN</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
            <li>✓ UI</li>
            <li>✓ UX</li>
            <li>✓ Motion</li>
          </ul>
        </div>
      </div>

      <h3 className="mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '2rem', color: 'var(--accent)' }}>
        STACK TECHNIQUE
      </h3>

      <div ref={stackRef} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {['frontend', 'backend', 'tools'].map((cat) => (
          <div key={cat}>
            <h4 className="mono" style={{ textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--muted)' }}>
              {cat}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {SKILLS[cat].map((skill) => (
                <div
                  key={skill.name}
                  className="akatech-stack-badge"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface)',
                  }}
                >
                  <img src={skill.icon} alt="" width="16" height="16" style={{ filter: 'grayscale(1)' }} />
                  <span style={{ fontSize: '0.8rem' }}>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

      <PageEnd
        ctaTitle="La preuve par les projets"
        ctaText="19 réalisations, du prototype jetable au produit en production."
        ctaLabel="Voir les projets"
        onCta={() => onNavigate('projects')}
        nextLabel="Projets"
        onNext={onNext}
      />
    </>
  )
}
