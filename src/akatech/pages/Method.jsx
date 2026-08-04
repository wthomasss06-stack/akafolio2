import SectionHeading from '../components/SectionHeading'
import PageEnd from '../components/PageEnd'
import PageShell from '../components/PageShell'
import { METHOD_STEPS, SKILLS } from '../../data/portfolioData'

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Method({ onNext, onNavigate }) {
  return (
    <>
    <PageShell>
    <div className="container section">
      <SectionHeading num="02" title="Ma méthode" sub="Comment naît un projet" />

      <p style={{ fontSize: '1.1rem', maxWidth: '60ch', marginBottom: '4rem', lineHeight: 1.8 }}>
        Chaque projet commence toujours de la même façon. Ce n'est pas une recette magique — c'est un système que j'affine à chaque livraison.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '5rem' }}>
        {METHOD_STEPS.map((step) => (
          <div
            key={step.num}
            style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.5rem', alignItems: 'start' }}
          >
            <span
              className="mono"
              style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)', opacity: 0.3, lineHeight: 1 }}
            >
              {step.num}
            </span>
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{step.title}</h3>
              <p style={{ lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mono" style={{ fontSize: '0.8rem', letterSpacing: '0.15em', marginBottom: '2rem', color: 'var(--accent)' }}>
        AKATECH SKILLS — MON SYSTÈME
      </h3>

      <div className="grid-3" style={{ marginBottom: '3rem' }}>
        <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>AKATECH BACKEND</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
            <li>✓ Architecture</li>
            <li>✓ Conventions</li>
            <li>✓ Structure</li>
            <li>✓ Clean Code</li>
            <li>✓ Sécurité</li>
          </ul>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)' }}>
          <h4 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>AKATECH FRONTEND</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
            <li>✓ Animation</li>
            <li>✓ Performance</li>
            <li>✓ Responsive</li>
            <li>✓ Accessibilité</li>
          </ul>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--surface)' }}>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {['frontend', 'backend', 'tools'].map((cat) => (
          <div key={cat}>
            <h4 className="mono" style={{ textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--muted)' }}>
              {cat}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {SKILLS[cat].map((skill) => (
                <div
                  key={skill.name}
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
    </PageShell>

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
