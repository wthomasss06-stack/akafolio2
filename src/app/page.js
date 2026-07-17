import { STRUCTURED_DATA } from '../useSEO.jsx'
import PortfolioApp from './PortfolioApp.jsx'

// ════════════════════════════════════════════════════════════════
// page.js — Server Component
//
// Tout ce qui est rendu ici (JSON-LD, contenu de secours) est dans
// le HTML renvoyé par le serveur au tout premier chargement, avant
// toute exécution JS. C'est la vraie amélioration par rapport à la
// version React/Vite : là où le <noscript> d'index.html n'était
// qu'un filet de sécurité peu fiable pour les crawlers, ce contenu
// est maintenant du vrai HTML server-rendered, comme le reste du
// document.
//
// L'expérience interactive (WebGL/GSAP/3 modes) est montée ensuite
// via <PortfolioApp /> exactement comme avant (ssr:false, chargée à
// la demande) — elle est simplement au-dessus d'une base déjà
// indexable plutôt que d'un <div id="root"></div> vide.
// ════════════════════════════════════════════════════════════════
export default function Page() {
  return (
    <>
      {/* Performance : preconnect / dns-prefetch pour les fallback Unsplash */}
      <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://images.unsplash.com" />

      {/* Structured Data — AEO/GEO (Google, Bing, ChatGPT, Perplexity, Gemini) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA.person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA.localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA.faq) }}
      />

      {/* Contenu de secours — repris du <noscript> d'index.html, toujours
          rendu côté serveur (voir commentaire ci-dessus et .seo-fallback
          dans globals.css). */}
      <div className="seo-fallback">
        <h1>M&apos;Bollo aka — Développeur Web Full Stack à Abidjan</h1>
        <p>
          Développeur web full stack basé à Abidjan, Côte d&apos;Ivoire, spécialisé en React,
          Django et Flask. Fondateur de akaTech. Création de portfolios, sites vitrines,
          boutiques e-commerce et applications web sur mesure.
        </p>

        <h2>Services</h2>
        <ul>
          <li><strong>Conception de Site Web</strong> — sites modernes, responsive et optimisés pour convertir, du portfolio à l&apos;e-commerce.</li>
          <li><strong>Cartes Interactives &amp; Dashboards</strong> — intégration de cartes Mapbox/Leaflet et de dashboards de visualisation de données.</li>
          <li><strong>API &amp; Backend Robustes</strong> — API RESTful sécurisées avec Django ou Flask, authentification JWT, intégration Mobile Money.</li>
          <li><strong>Maintenance &amp; Support</strong> — suivi technique, corrections de bugs, mises à jour de sécurité et améliorations continues.</li>
          <li><strong>Fiche Google My Business</strong> — création ou optimisation de votre fiche Google, suivi mensuel et SEO local.</li>
        </ul>

        <h2>Tarifs (à partir de)</h2>
        <ul>
          <li>Portfolio — à partir de 100 000 FCFA</li>
          <li>Site Vitrine — à partir de 220 000 FCFA</li>
          <li>Boutique E-commerce — à partir de 450 000 FCFA</li>
          <li>Application Web / SaaS — sur devis, après diagnostic gratuit</li>
        </ul>

        <p>Contact : wthomasss06@gmail.com · WhatsApp +225 01 42 50 77 50</p>
      </div>

      <PortfolioApp />
    </>
  )
}
