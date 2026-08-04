'use client'

import { useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import PageEnd from '../components/PageEnd'
import PageShell from '../components/PageShell'
import { PROJECTS } from '../../data/portfolioData'

const FILTERS = ['all', 'en-ligne', 'demo', 'en-cours']
const FILTER_LABELS = { all: 'Tous', 'en-ligne': 'En ligne', demo: 'Démos', 'en-cours': 'En cours' }

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Projects({ onNext, onNavigate }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.cat === filter)

  return (
    <>
    <PageShell>
    <div className="container section">
      <SectionHeading num="03" title="Construire" sub="Tous les projets, les V1, les V2 et les abandons" />

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className="mono"
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '99px',
              border: '1px solid var(--border)',
              background: filter === f ? 'var(--accent)' : 'transparent',
              color: filter === f ? '#fff' : 'var(--muted)',
              cursor: 'pointer',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      <div className="grid-3">
        {filtered.map((project) => (
          <article
            key={project.id}
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              background: 'var(--surface)',
              transition: 'transform 0.3s, border-color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ aspectRatio: '16/10', overflow: 'hidden', background: 'var(--elevated)' }}>
              <img
                src={project.img}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                loading="lazy"
              />
            </div>

            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.1em' }}>
                  {project.cat.toUpperCase()}
                </span>
                <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{project.year}</span>
              </div>

              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{project.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>{project.sub}</p>

              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{project.desc}</p>

              {project.problem && (
                <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent)' }}>PROBLÈME</span>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{project.problem}</p>
                </div>
              )}

              {project.solution && (
                <div style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'var(--elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent)' }}>SOLUTION</span>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{project.solution}</p>
                </div>
              )}

              {project.result && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--elevated)', borderRadius: 'var(--radius-sm)' }}>
                  <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent)' }}>RÉSULTAT</span>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>{project.result}</p>
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="mono"
                    style={{ fontSize: '0.6rem', padding: '2px 8px', border: '1px solid var(--border)', borderRadius: '99px', color: 'var(--muted)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {project.url !== '#' && (
                  <a href={project.url} target="_blank" rel="noreferrer" className="btn btn-fill" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                    Voir le projet
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
    </PageShell>

      <PageEnd
        ctaTitle="Envie d'explorer sans contrainte client ?"
        ctaText="Le bac à sable : mes expérimentations libres, avant qu'elles ne deviennent des projets réels."
        ctaLabel="Explorer le bac à sable"
        onCta={() => onNavigate('sandbox')}
        nextLabel="Bac à sable"
        onNext={onNext}
      />
    </>
  )
}
