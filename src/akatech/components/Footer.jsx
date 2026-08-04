import { CONTACT } from '../../data/portfolioData'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '4rem var(--space)',
        textAlign: 'center',
      }}
    >
      <div className="container">
        <h2
          style={{
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            fontWeight: 800,
            opacity: 0.05,
            letterSpacing: '-0.04em',
          }}
        >
          AKATECH
        </h2>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <a href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={`mailto:${CONTACT.email}`}>Email</a>
        </div>
        <p className="mono" style={{ marginTop: '2rem', fontSize: '0.7rem' }}>
          © 2026 {CONTACT.name} — {CONTACT.agency}
        </p>
      </div>
    </footer>
  )
}
