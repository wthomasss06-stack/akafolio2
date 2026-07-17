import '@fortawesome/fontawesome-free/css/all.min.css'
import '../fonts.css'
import './globals.css'

import { SEO_CONFIG } from '../useSEO.jsx'

const seo = SEO_CONFIG.default

// ════════════════════════════════════════════════════════════════
// Metadata API — remplace le <head> statique d'index.html ET
// react-helmet-async. Contrairement à Helmet (client-only, jamais
// vraiment figé dans le HTML sans pipeline SSG), ce qui est exporté
// ici est rendu par Next.js CÔTÉ SERVEUR dans le HTML renvoyé au
// premier chargement — donc lu par Google/Bing sans exécuter de JS.
// C'est le vrai correctif du problème d'indexation identifié avant
// la migration (root cause : SEO 100% client-side, sans SSG réel).
//
// Le JSON-LD (structured data) est dans page.js, pas ici : c'est le
// pattern recommandé par Next.js pour <script type="application/ld+json">.
// ════════════════════════════════════════════════════════════════
export const metadata = {
  metadataBase: new URL(seo.url),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: "M'Bollo aka" }],
  robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  alternates: { canonical: seo.url },
  icons: {
    icon: '/assets/images/favicon.png',
    apple: '/assets/images/favicon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'geo.region': 'CI',
    'geo.placename': 'Abidjan',
  },
  openGraph: {
    type: 'website',
    url: seo.url,
    title: seo.title,
    description: seo.description,
    images: [{ url: seo.image, width: 1200, height: 1200 }],
    locale: 'fr_CI',
    siteName: "M'Bollo aka — akaTech",
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    images: [seo.image],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF5500',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
