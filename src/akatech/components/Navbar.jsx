'use client'

import { NAV_LINKS } from '../../data/portfolioData'
import LuxuryAction from './LuxuryAction'

/**
 * En-tête fixe : logo, navigation linéaire, mode tir et contact.
 * Les libellés textuels utilisent le même cycle horizontal que les CTA.
 */
export default function Navbar({ activePage, onNavigate, shootMode, onToggleShoot }) {
  return (
    <header className="akatech-header">
      <button
        type="button"
        className="akatech-logo-badge"
        onClick={() => onNavigate('home')}
        aria-label="Accueil"
      >
        <img src="/assets/images/logo-akatech.webp" alt="AKATech" />
      </button>

      <nav className="akatech-linear-nav">
        {NAV_LINKS.map((link) => (
          <LuxuryAction
            key={link.id}
            label={link.label}
            className={`akatech-nav-action${activePage === link.id ? ' is-active' : ''}`}
            onClick={() => onNavigate(link.id)}
          />
        ))}
      </nav>

      <div className="akatech-header-right">
        <button
          type="button"
          className="akatech-toggle-shoot akatech-luxury-icon-button"
          onClick={onToggleShoot}
          aria-pressed={shootMode}
          title={shootMode ? 'Désactiver le mode tir' : 'Activer le mode tir'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="7.5" />
            <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
            <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
          </svg>
        </button>
        <LuxuryAction
          label="Me contacter"
          className="akatech-btn-contact"
          onClick={() => onNavigate('contact')}
        />
      </div>
    </header>
  )
}
