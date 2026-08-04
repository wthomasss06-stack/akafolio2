'use client'

import { useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import PageEnd from '../components/PageEnd'
import PageShell from '../components/PageShell'
import { CONTACT } from '../../data/portfolioData'

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Contact({ onNext, onNavigate }) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [btnTxt, setBtnTxt] = useState('Envoyer le message')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setBtnTxt('Envoi en cours…')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          projectType: e.target.projectType.value,
          message: e.target.message.value,
          company: e.target.company.value, // honeypot anti-spam — doit rester vide
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const firstFieldError = data?.fieldErrors && Object.values(data.fieldErrors)[0]
        throw new Error(firstFieldError || data?.error || 'Erreur serveur')
      }
      setSent(true)
      setSending(false)
    } catch (err) {
      setBtnTxt(err?.message ? err.message : 'Erreur — WhatsApp : +225 01 42 50 77 50')
      setTimeout(() => {
        setBtnTxt('Envoyer le message')
        setSending(false)
      }, 4000)
    }
  }

  return (
    <>
    <PageShell>
    <div className="container section">
      <SectionHeading num="06" title="Contact" sub="Travaillons ensemble" />

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Colonne gauche — liens */}
        <div>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem' }}>
            Une idée, un projet, une question ? Je suis <strong style={{ color: 'var(--text)' }}>disponible</strong> pour en discuter et la transformer en quelque chose de concret.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            {[
              { label: 'Email', href: `mailto:${CONTACT.email}`, value: CONTACT.email },
              { label: 'WhatsApp', href: CONTACT.whatsappUrl, value: CONTACT.phone },
              { label: 'LinkedIn', href: CONTACT.linkedin, value: 'linkedin.com/in/m-bollo-aka' },
              { label: 'GitHub', href: CONTACT.github, value: 'github.com/wthomasss06-stack' },
              { label: 'AKATech Studio', href: CONTACT.agencyUrl, value: 'akatech.vercel.app' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '0.9rem',
                }}
              >
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{link.label}</span>
                <span style={{ color: 'var(--text)' }}>{link.value}</span>
              </a>
            ))}
          </div>

          <a href={CONTACT.cv} target="_blank" rel="noreferrer" className="btn btn-ghost">
            Télécharger mon CV
          </a>
        </div>

        {/* Colonne droite — formulaire */}
        <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'var(--accent-dim)',
                  border: '1.5px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: 'var(--accent)',
                  fontSize: '1.5rem',
                }}
              >
                ✓
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>Message envoyé !</h3>
              <p style={{ fontSize: '0.9rem' }}>Je vous réponds sous 24h.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Honeypot anti-spam : invisible pour un humain, souvent rempli par les bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', width: '1px', height: '1px', opacity: 0, pointerEvents: 'none', left: '-9999px' }}
              />

              <div>
                <label className="mono" style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>
                  NOM COMPLET *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jean Kouassi"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text)',
                    fontFamily: 'var(--fd)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>
                  EMAIL *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jean@exemple.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text)',
                    fontFamily: 'var(--fd)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label className="mono" style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>
                  TYPE DE PROJET *
                </label>
                <select
                  name="projectType"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text)',
                    fontFamily: 'var(--fd)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Sélectionnez votre besoin…</option>
                  <option value="site-vitrine">Site Vitrine</option>
                  <option value="e-commerce">E-commerce</option>
                  <option value="application-web">Application Web / SaaS</option>
                  <option value="api">API / Backend</option>
                  <option value="dashboard">Dashboard / Data</option>
                  <option value="maintenance">Maintenance / Support</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="mono" style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>
                  MESSAGE *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Décrivez votre projet ou opportunité…"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text)',
                    fontFamily: 'var(--fd)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button type="submit" disabled={sending} className="btn btn-fill" style={{ width: '100%', justifyContent: 'center', opacity: sending ? 0.7 : 1, cursor: sending ? 'default' : 'pointer' }}>
                {btnTxt}
              </button>

              <p className="mono" style={{ fontSize: '0.6rem', color: 'var(--muted)', textAlign: 'center' }}>
                Vos données sont sécurisées et ne seront jamais partagées.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
    </PageShell>

      <PageEnd
        ctaTitle="Revoir le parcours ?"
        ctaText="Retour à l'accueil pour tout reparcourir depuis le début."
        ctaLabel="Retour à l'accueil"
        onCta={() => onNavigate('home')}
        nextLabel="Accueil"
        onNext={onNext}
      />
    </>
  )
}
