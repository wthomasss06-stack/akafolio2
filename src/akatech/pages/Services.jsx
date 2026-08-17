'use client'

import { useRef, useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import PageEnd from '../components/PageEnd'
import LuxuryAction from '../components/LuxuryAction'
import { useScrollReveal } from '../lib/useScrollReveal'
import { PRICING_TABS, FAQ_ITEMS } from '../../data/portfolioData'

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Services({ onNext, onNavigate }) {
  const [currentTab, setCurrentTab] = useState(0)
  const tab = PRICING_TABS[currentTab]
  const plansRef = useRef(null)
  const faqRef = useRef(null)
  useScrollReveal(plansRef, ':scope > div', { y: 28, stagger: 0.1 })
  useScrollReveal(faqRef, 'details', { y: 18, stagger: 0.06, duration: 0.5 })

  return (
    <>
    <div className="container section">
      <SectionHeading num="05" title="Services" sub="Ce que je peux faire pour vous — et combien ça coûte" />

      <p className="akatech-editorial-p" style={{ marginBottom: '3rem' }}>
        Plusieurs offres complémentaires, de la conception au support continu. Chaque projet étant unique, les tarifs peuvent varier selon les fonctionnalités demandées.
      </p>

      {/* Tabs */}
      <div className="akatech-service-tabs" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
        {PRICING_TABS.map((t, i) => (
          <LuxuryAction
            key={t.key}
            label={t.label}
            cycle={[t.label, 'Voir les options', 'Comparer les offres', t.label]}
            className={`akatech-service-tab${currentTab === i ? ' is-active' : ''}`}
            onClick={() => setCurrentTab(i)}
            aria-pressed={currentTab === i}
          />
        ))}
      </div>

      {/* Plans */}
      <div ref={plansRef} className="grid-3" style={{ marginBottom: '4rem', alignItems: 'stretch' }}>
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

            <LuxuryAction
              label={tab.key === 'saas' ? 'Demander un devis' : 'Démarrer'}
              cycle={tab.key === 'saas'
                ? ['Demander un devis', 'Parlons budget', 'Recevoir une estimation', 'Demander un devis']
                : ['Démarrer', 'Lancer le projet', 'Passer à l’action', 'Démarrer']}
              onClick={() => onNavigate('contact')}
              style={{ width: '100%', justifyContent: 'center' }}
            />
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h3 className="mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '2rem', color: 'var(--accent)' }}>
        QUESTIONS FRÉQUENTES
      </h3>

      <div ref={faqRef} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
