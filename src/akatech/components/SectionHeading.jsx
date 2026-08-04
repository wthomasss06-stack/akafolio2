/**
 * En-tête de section réutilisable : numéro (mono, accent), titre,
 * sous-titre optionnel, petite ligne d'accent en dessous.
 *
 * @param {{ num: string, title: string, sub?: string, className?: string }} props
 */
export default function SectionHeading({ num, title, sub, className = '' }) {
  return (
    <div className={`section-heading ${className}`} style={{ marginBottom: '3rem' }}>
      <span
        className="mono"
        style={{
          fontSize: '0.7rem',
          color: 'var(--accent)',
          letterSpacing: '0.15em',
          display: 'block',
          marginBottom: '1rem',
        }}
      >
        {num}
      </span>
      <h2
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          marginBottom: sub ? '0.8rem' : 0,
          color: 'var(--text)',
        }}
      >
        {title}
      </h2>
      {sub && <p style={{ fontSize: '1rem', color: 'var(--muted)' }}>{sub}</p>}
      <div
        style={{
          width: '60px',
          height: '2px',
          background: 'var(--accent)',
          marginTop: '1.5rem',
          opacity: 0.4,
        }}
      />
    </div>
  )
}
