import { CONTACT } from '../../data/portfolioData'
import FluidWatermark from './FluidWatermark'
import { CyclicText, getAkatechCycle } from './LuxuryAction'

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
        <FluidWatermark text="AKATECH" />
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <a className="akatech-cyclic-link" href={CONTACT.github} target="_blank" rel="noreferrer"><CyclicText text="GitHub" cycle={getAkatechCycle('GitHub')} triggerParent /></a>
          <a className="akatech-cyclic-link" href={CONTACT.linkedin} target="_blank" rel="noreferrer"><CyclicText text="LinkedIn" cycle={['LinkedIn', 'Voir le profil', 'Me retrouver', 'LinkedIn']} triggerParent /></a>
          <a className="akatech-cyclic-link" href={CONTACT.whatsappUrl} target="_blank" rel="noreferrer"><CyclicText text="WhatsApp" cycle={['WhatsApp', 'Écrire sur WhatsApp', 'Démarrer une discussion', 'WhatsApp']} triggerParent /></a>
          <a className="akatech-cyclic-link" href={`mailto:${CONTACT.email}`}><CyclicText text="Email" cycle={['Email', 'Écrire un email', 'Me contacter', 'Email']} triggerParent /></a>
        </div>
        <p className="mono" style={{ marginTop: '2rem', fontSize: '0.7rem' }}>
          © 2026 {CONTACT.name} — {CONTACT.agency}
        </p>
      </div>
    </footer>
  )
}
