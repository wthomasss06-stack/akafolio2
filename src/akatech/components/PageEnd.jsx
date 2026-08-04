import Footer from './Footer'

/**
 * @param {{
 *   ctaTitle: string,
 *   ctaText: string,
 *   ctaLabel: string,
 *   onCta: () => void,
 *   nextLabel: string,
 *   onNext: () => void,
 * }} props
 */
export default function PageEnd({ ctaTitle, ctaText, ctaLabel, onCta, nextLabel, onNext }) {
  return (
    <>
      <button type="button" className="akatech-continue" onClick={onNext}>
        <span className="akatech-continue-label">Continuer à me lire</span>
        <span className="akatech-continue-next">
          {nextLabel}
          <svg
            className="akatech-continue-arrow"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div className="container akatech-page-cta">
        <h3>{ctaTitle}</h3>
        <p>{ctaText}</p>
        <button type="button" className="btn btn-fill" onClick={onCta}>
          {ctaLabel}
        </button>
      </div>

      <Footer />
    </>
  )
}
