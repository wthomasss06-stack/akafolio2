import SectionHeading from '../components/SectionHeading'
import PageEnd from '../components/PageEnd'
import PageShell from '../components/PageShell'
import { TIMELINE, PHILOSOPHY_CHAPTERS } from '../../data/portfolioData'

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Story({ onNext, onNavigate }) {
  return (
    <>
    <PageShell>
    <div className="container section">
      <SectionHeading num="01" title="Mon histoire" sub="Pourquoi autodidacte depuis le 25 octobre 2025" />

      <div style={{ maxWidth: '700px', marginBottom: '5rem' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text)', marginBottom: '1.5rem' }}>
          Mon parcours a commencé dans le <strong>réseau et la sécurité informatique</strong>. Cette base m'a appris à construire avec méthode, à penser la fiabilité et à garder une vision propre de l'architecture.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
          Avec le temps, j'ai trouvé ma place dans le développement web. Aujourd'hui, je conçois des interfaces qui respirent, qui bougent, et qui donnent une vraie sensation de produit fini. En grande partie <strong>autodidacte</strong>, j'apprends en construisant, en testant et en améliorant chaque projet.
        </p>
      </div>

      <h3 className="mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '2rem', color: 'var(--accent)' }}>
        CE QUE J'AI CHANGÉ D'AVIS
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '5rem' }}>
        {PHILOSOPHY_CHAPTERS.map((ch) => (
          <div key={ch.num} style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1.5rem' }}>
            <span className="mono accent" style={{ fontSize: '0.75rem' }}>Chapitre {ch.num}</span>
            <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--muted)' }}>"{ch.before}"</p>
            <p style={{ marginTop: '0.75rem', color: 'var(--text)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              → {ch.after}
            </p>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '2rem', color: 'var(--accent)' }}>
        PARCOURS
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {TIMELINE.map((item, i) => (
          <div
            key={i}
            style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '2rem', alignItems: 'start' }}
          >
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{item.date}</span>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.title}</h4>
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
    </PageShell>

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
