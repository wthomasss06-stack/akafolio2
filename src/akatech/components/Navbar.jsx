'use client'

import { useState, useEffect } from 'react'
import { NAV_LINKS } from '../../data/portfolioData'

/**
 * En-tête fixe façon Gemini : logo + nav empilée (ouverte/fermée au
 * clic sur le bouton menu) à gauche ; toggle clair/sombre + bouton
 * contact à droite.
 *
 * @param {{
 *   activePage: string,
 *   onNavigate: (id: string) => void,
 *   theme: 'dark' | 'light',
 *   onToggleTheme: () => void,
 * }} props
 */
export default function Navbar({ activePage, onNavigate, theme, onToggleTheme }) {
  const [navOpen, setNavOpen] = useState(false)

  // Filet de sécurité : "Continuer à me lire" (dans PageEnd) change de
  // page sans passer par go() ci-dessous, donc sans lui le menu pouvait
  // rester ouvert sur la page suivante si on l'avait laissé ouvert.
  useEffect(() => {
    setNavOpen(false)
  }, [activePage])

  const go = (id) => {
    setNavOpen(false)
    onNavigate(id)
  }

  return (
    <header className="akatech-header">
      <div className="akatech-header-left">
        <div className="akatech-logo-row">
          <button type="button" className="akatech-logo-badge" onClick={() => go('home')} aria-label="Accueil">
            AK
          </button>
          <button
            type="button"
            className="akatech-menu-toggle"
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
            aria-label={navOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>

        <nav className={`akatech-stacked-nav${navOpen ? ' is-open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => go(link.id)}
              className={activePage === link.id ? 'is-active' : ''}
            >
              <span className="mono akatech-nav-num">{link.num}</span>
              {link.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="akatech-header-right">
        <button
          type="button"
          className="akatech-toggle-theme"
          onClick={onToggleTheme}
          aria-pressed={theme === 'light'}
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 15.6A8.9 8.9 0 1 1 8.4 4a7 7 0 1 0 11.6 11.6Z" />
            </svg>
          )}
        </button>
        <button type="button" className="akatech-btn-contact" onClick={() => go('contact')}>
          Me contacter
        </button>
      </div>
    </header>
  )
}
