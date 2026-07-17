// ════════════════════════════════════════════════════════════════
// useSEO.jsx — Données SEO (source unique)
//
// AVANT : hook + composant <SEOHead> basés sur react-helmet-async,
// qui injectait title/meta/OG/JSON-LD côté client uniquement — sans
// pipeline SSG pour les figer dans le HTML statique, donc peu fiable
// pour les crawlers (cause historique du problème d'indexation).
//
// MAINTENANT : ce fichier n'exporte plus que les DONNÉES. Elles sont
// consommées par src/app/layout.js via l'API Metadata native de
// Next.js (`export const metadata`) — vraiment rendues côté serveur
// dans le HTML renvoyé, donc lues par Google sans exécuter de JS.
//
// SEO_CONFIG et STRUCTURED_DATA.person / .localBusiness reprennent
// exactement les données déjà utilisées ici avant la migration.
// STRUCTURED_DATA.faq a été rapatrié depuis index.html (il n'existait
// qu'à cet endroit, jamais dans ce fichier) pour n'avoir plus qu'une
// seule source de vérité SEO dans tout le projet.
// ════════════════════════════════════════════════════════════════

export const SEO_CONFIG = {
  default: {
    title: "M'Bollo aka — Développeur Web Full Stack à Abidjan | akaTech",
    description:
      "M'Bollo aka, développeur web full stack à Abidjan (Côte d'Ivoire) : sites vitrines, e-commerce, applications React/Django/Flask. Devis rapide, livraison sous 3 à 14 jours, nom de domaine et hébergement offerts 1 an.",
    keywords:
      "développeur web Abidjan, développeur full stack Côte d'Ivoire, créer un site web Abidjan, développeur React Django, akaTech, agence web Abidjan, création site e-commerce Côte d'Ivoire",
    url: 'https://mbolloaka-dev.vercel.app/',
    image: 'https://mbolloaka-dev.vercel.app/assets/images/IMG_20250124_124101KK.webp',
  },
}

export const STRUCTURED_DATA = {
  person: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: "M'Bollo aka",
    alternateName: 'aka',
    url: 'https://mbolloaka-dev.vercel.app/',
    image: 'https://mbolloaka-dev.vercel.app/assets/images/IMG_20250124_124101KK.webp',
    jobTitle: 'Développeur Web Full Stack',
    description:
      "Développeur web full stack basé à Abidjan, Côte d'Ivoire, spécialisé en React, Django et Flask. Fondateur de akaTech.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    email: 'mailto:wthomasss06@gmail.com',
    telephone: '+225-01-42-50-77-50',
    worksFor: {
      '@type': 'Organization',
      name: 'akaTech',
      url: 'https://akatech.vercel.app/',
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'UVCI - Université Virtuelle de Côte d\'Ivoire',
      url: 'https://uvci.edu.ci/',
    },
    sameAs: [
      'https://github.com/wthomasss06-stack',
      'https://www.linkedin.com/in/m-bollo-aka',
      'https://web.facebook.com/profile.php?id=61577494705852',
      'https://akatech.vercel.app/',
    ],
    knowsAbout: [
      'Développement Web',
      'React.js',
      'Next.js',
      'Django',
      'Flask',
      'Python',
      'JavaScript',
      'MySQL',
      'GSAP',
      'Three.js',
    ],
  },

  localBusiness: {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'akaTech',
    founder: {
      '@type': 'Person',
      name: "M'Bollo aka",
    },
    url: 'https://akatech.vercel.app/',
    logo: 'https://akatech.vercel.app/favicon.png',
    image: 'https://mbolloaka-dev.vercel.app/assets/images/IMG_20250124_124101KK.webp',
    description:
      "akaTech accompagne les entrepreneurs et PME en Côte d'Ivoire avec des solutions digitales sur-mesure : sites vitrines, e-commerce, applications SaaS et portfolios modernes.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    areaServed: {
      '@type': 'Country',
      name: "Côte d'Ivoire",
    },
    priceRange: '100 000 – 1 200 000 FCFA',
    telephone: '+225-01-42-50-77-50',
    email: 'wthomasss06@gmail.com',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '20:00',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services Web akaTech',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Portfolio Web',
            description: 'Portfolio moderne animé — 3 à 14 jours, dès 100 000 FCFA',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Site Vitrine',
            description: "Site vitrine professionnel — 5 à 14 jours, dès 220 000 FCFA",
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'E-commerce',
            description: "Boutique en ligne Mobile Money — dès 450 000 FCFA",
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Application SaaS',
            description: 'Application web sur devis, Django + React',
          },
        },
      ],
    },
  },

  // Rapatrié depuis index.html (n'existait qu'à cet endroit avant la migration)
  faq: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Comment se déroule le paiement de mon site ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Le paiement se fait en deux fois : 50% à la commande pour démarrer le projet, et les 50% restants à la livraison, juste avant de recevoir les fichiers finaux et les accès.',
        },
      },
      {
        '@type': 'Question',
        name: 'Pourquoi un acompte est-il demandé avant de commencer ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "L'acompte confirme votre commande et me permet de démarrer le développement immédiatement, de récupérer vos contenus (logo, textes, photos) et de vous garantir le délai annoncé. Sans acompte, le projet n'est pas priorisé dans mon planning.",
        },
      },
      {
        '@type': 'Question',
        name: 'Quels moyens de paiement acceptez-vous ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Orange Money, MTN Mobile Money, Wave ou virement bancaire. Vous précisez votre moyen préféré au moment de la commande et je vous envoie les coordonnées correspondantes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quel est le délai pour recevoir mon site ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cela dépend du pack choisi : 3 à 5 jours pour un portfolio simple, davantage pour une vitrine, une boutique e-commerce ou une application plus complexe. Le délai exact est précisé dans le devis et démarre dès réception de l\'acompte et de vos contenus.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quand mon site est-il mis en ligne ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Une fois le solde réglé. Avant cela, je vous partage un lien de prévisualisation pour valider le design et le contenu.',
        },
      },
      {
        '@type': 'Question',
        name: 'Puis-je voir mon site avant qu\'il soit en ligne ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, toujours. Vous recevez un lien de prévisualisation pour tester le site, faire vos retours et demander des ajustements avant la mise en ligne officielle.',
        },
      },
      {
        '@type': 'Question',
        name: 'Combien de modifications sont incluses ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Les petites corrections — textes, couleurs, ajustements visuels — sont incluses pendant la phase de validation. Les modifications majeures, comme un changement de structure ou l\'ajout de pages, font l\'objet d\'un devis complémentaire.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quel pack choisir pour mon projet ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tout dépend de vos besoins : portfolio, vitrine, boutique e-commerce ou application plus complexe type SaaS. Je vous conseille gratuitement lors du brief initial pour identifier le pack le plus adapté.',
        },
      },
      {
        '@type': 'Question',
        name: 'Le nom de domaine et l\'hébergement sont-ils vraiment gratuits ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, la première année est offerte sur tous les packs. Après cette période, vous payez simplement le renouvellement — environ 15 000 à 30 000 FCFA par an selon le domaine — et je vous envoie un rappel avant l\'expiration.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quels contenus dois-je fournir ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Votre logo, vos photos, vos textes de présentation et vos informations de contact. Plus ces éléments arrivent vite, plus le développement avance rapidement.',
        },
      },
      {
        '@type': 'Question',
        name: 'Je n\'ai pas de logo ni de textes, pouvez-vous m\'aider ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui. Je peux proposer un logo simple, utiliser des visuels libres de droits adaptés à votre activité, ou rédiger une trame de textes professionnels que vous ajustez ensuite. Ces services s\'ajoutent au devis initial.',
        },
      },
      {
        '@type': 'Question',
        name: 'Qui gère mon site après la livraison ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vous. Je vous transmets tous les accès — administration, hébergement, nom de domaine — ainsi qu\'un tutoriel simple pour modifier vos textes et images sans dépendre de moi.',
        },
      },
      {
        '@type': 'Question',
        name: 'Que se passe-t-il si le délai annoncé n\'est pas respecté ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'C\'est rare, mais si cela arrive de mon fait, une pénalité s\'applique sur le montant total et vous pouvez demander l\'annulation du projet avec un remboursement partiel. Ces conditions figurent dans le devis signé.',
        },
      },
      {
        '@type': 'Question',
        name: 'Mon site a un bug après la livraison, que faites-vous ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Je corrige gratuitement tout bug lié à mon développement pendant le mois suivant la livraison — inclus dans le pack Premium, possible en option sur les autres packs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Comment commander mon site ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Trois étapes : on échange sur votre projet et le pack adapté, je vous envoie un devis avec l\'acompte de 50%, puis dès réception du paiement je démarre le développement.',
        },
      },
    ],
  },
}
