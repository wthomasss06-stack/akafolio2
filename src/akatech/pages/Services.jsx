'use client'

import { useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import PageEnd from '../components/PageEnd'
import PageShell from '../components/PageShell'
import { PRICING_TABS, FAQ_ITEMS } from '../../data/portfolioData'

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Services({ onNext, onNavigate }) {
  const [currentTab, setCurrentTab] = useState(0)
  const tab = PRICING_TABS[currentTab]

  return (
    <>
    <PageShell>
    <div className="container section">
      <SectionHeading num="05" title="Services" sub="Ce que je peux faire pour vous — et combien ça coûte" />

      <p style={{ fontSize: '1.1rem', maxWidth: '60ch', marginBottom: '3rem', lineHeight: 1.8 }}>
        Plusieurs offres complémentaires, de la conception au support continu. Chaque projet étant unique, les tarifs peuvent varier selon les fonctionnalités demandées.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        {PRICING_TABS.map((t, i) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setCurrentTab(i)}
            style={{
              padding: '0.5rem 1.2rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
              background: currentTab === i ? 'var(--accent)' : 'transparent',
              color: currentTab === i ? '#fff' : 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'var(--fm)',
              fontSize: '0.7rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Plans */}
      <div className="grid-3" style={{ marginBottom: '4rem', alignItems: 'stretch' }}>
        {tab.plans.map((plan, i) => (
          <div
            key={plan.title}
            style={{
              padding: '1.5rem',
              border: `1.5px solid ${plan.isPopular ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {plan.isPopular && (
              <span
                className="mono"
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '1.5rem',
                  background: 'var(--accent)',
                  color: '#fff',
                  padding: '2px 10px',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                  borderRadius: '99px',
                }}
              >
                POPULAIRE
              </span>
            )}

            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{plan.title}</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
              {plan.price}
            </p>
            <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '1.5rem' }}>
              ⏱ {plan.delivery}
            </p>

            {plan.desc && (
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{plan.desc}</p>
            )}

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', flex: 1 }}>
              {tab.rows.map((row) => {
                const cell = row.cells[i]
                if (cell === false || cell === null || cell === undefined) return null
                return (
                  <li key={row.label} style={{ fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✓</span>
                    <span>
                      {row.label}
                      {typeof cell === 'string' && <span style={{ color: 'var(--muted)' }}> — {cell}</span>}
                    </span>
                  </li>
                )
              })}
            </ul>

            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="btn btn-fill"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {tab.key === 'saas' ? 'Demander un devis' : 'Démarrer'}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h3 className="mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '2rem', color: 'var(--accent)' }}>
        QUESTIONS FRÉQUENTES
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {FAQ_ITEMS.map((faq, i) => (
          <details
            key={i}
            style={{
              padding: '1rem 1.25rem',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--surface)',
              cursor: 'pointer',
            }}
          >
            <summary style={{ fontWeight: 600, fontSize: '0.95rem', listStyle: 'none' }}>
              <span className="mono" style={{ color: 'var(--accent)', marginRight: '0.75rem' }}>{String(i + 1).padStart(2, '0')}</span>
              {faq.q}
            </summary>
            <p style={{ marginTop: '0.75rem', paddingLeft: '1.75rem', fontSize: '0.9rem' }}>{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
    </PageShell>

      <PageEnd
        ctaTitle="Des questions, un projet précis ?"
        ctaText="Écrivez-moi et je réponds sous 24h."
        ctaLabel="Me contacter"
        onCta={() => onNavigate('contact')}
        nextLabel="Contact"
        onNext={onNext}
      />
    </>
  )
}
