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
    title: "M'Bollo Aka — Développeur Web Full Stack à Abidjan | AKATech Studio.",
    description:
      "M'Bollo aka, développeur web full stack à Abidjan (Côte d'Ivoire) : sites vitrines, e-commerce, applications React/Django/Flask. Devis rapide, livraison selon le pack, nom de domaine offert 1 an.",
    keywords:
      "développeur web Abidjan, développeur full stack Côte d'Ivoire, créer un site web Abidjan, développeur React Django, AKATech Studio, agence web Abidjan, création site e-commerce Côte d'Ivoire",
    url: 'https://mbolloaka-dev.vercel.app/',
    image: 'https://mbolloaka-dev.vercel.app/assets/images/IMG_20250124_124101KK.webp',
  },
}

export const STRUCTURED_DATA = {
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AKATech Studio',
    alternateName: 'AKATech',
    url: 'https://mbolloaka-dev.vercel.app/',
    inLanguage: 'fr-FR',
    description: SEO_CONFIG.default.description,
    publisher: { '@id': 'https://mbolloaka-dev.vercel.app/#person' },
    potentialAction: {
      '@type': 'ContactAction',
      target: 'https://mbolloaka-dev.vercel.app/#contact',
      name: 'Demander un devis web',
    },
  },
  webPage: {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: SEO_CONFIG.default.title,
    url: SEO_CONFIG.default.url,
    inLanguage: 'fr-FR',
    description: SEO_CONFIG.default.description,
    isPartOf: { '@id': 'https://mbolloaka-dev.vercel.app/#website' },
    about: { '@id': 'https://mbolloaka-dev.vercel.app/#person' },
    mainEntity: { '@id': 'https://mbolloaka-dev.vercel.app/#person' },
  },
  person: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://mbolloaka-dev.vercel.app/#person',
    name: "M'Bollo aka",
    alternateName: 'aka',
    url: 'https://mbolloaka-dev.vercel.app/',
    image: 'https://mbolloaka-dev.vercel.app/assets/images/IMG_20250124_124101KK.webp',
    jobTitle: 'Développeur Web Full Stack',
    description:
      "Développeur web full stack basé à Abidjan, Côte d'Ivoire, spécialisé en React, Django et Flask. Fondateur de AKATech Studio.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    email: 'mailto:wthomasss06@gmail.com',
    telephone: '+225-01-42-50-77-50',
    worksFor: {
      '@type': 'Organization',
      name: 'AKATech Studio',
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
    '@id': 'https://akatech.vercel.app/#business',
    name: 'AKATech Studio',
    founder: {
      '@type': 'Person',
      name: "M'Bollo aka",
    },
    url: 'https://akatech.vercel.app/',
    logo: 'https://akatech.vercel.app/favicon.png',
    image: 'https://mbolloaka-dev.vercel.app/assets/images/IMG_20250124_124101KK.webp',
    description:
      "AKATech Studio accompagne les entrepreneurs et PME en Côte d'Ivoire avec des solutions digitales sur-mesure : sites vitrines, e-commerce, applications SaaS et portfolios modernes.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    },
    areaServed: {
      '@type': 'Country',
      name: "Côte d'Ivoire",
    },
    priceRange: '200 000 – 12 000 000 FCFA',
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
      name: 'Services Web AKATech Studio',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Site Vitrine',
            description: "Site vitrine professionnel — de 10 jours à 5 semaines, dès 200 000 FCFA",
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'E-commerce',
            description: "Boutique en ligne Mobile Money — dès 650 000 FCFA",
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Application SaaS',
            description: 'Application web, SaaS, marketplace ou projet complexe — de 1 000 000 à 12 000 000 FCFA selon le projet, Django + React',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Maintenance & évolutions',
            description: 'Maintenance mensuelle après la livraison — de 10 000 à 115 000 FCFA/mois selon le projet, projet complexe sur devis',
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
          text: "Pour un projet jusqu'à 2 000 000 FCFA : 50 % à la commande pour démarrer, et 50 % à la livraison, juste avant de recevoir les fichiers finaux et les accès. Pour un projet supérieur à 2 000 000 FCFA, le paiement se fait en trois temps : 40 % à la commande, 30 % à la validation de la pré-version et 30 % à la livraison, après la recette.",
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
          text: "Cela dépend du pack choisi : 10 à 15 jours pour une landing page, 2 à 5 semaines pour une vitrine, 3 à 10 semaines pour une boutique e-commerce, 4 à 28 semaines pour une application web, un SaaS ou un projet complexe. Le délai exact est précisé dans le devis et démarre dès réception de l'acompte et de vos contenus.",
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
          text: "Le nom de domaine est offert la première année sur tous les packs, et l'hébergement l'est aussi sur les packs Site Vitrine et E-commerce. Pour une application web, un SaaS ou un projet complexe, je mets l'hébergement en place à votre nom et les frais d'infrastructure sont facturés par les fournisseurs, au coût réel. Après la première année, le renouvellement du domaine coûte environ 15 000 à 30 000 FCFA par an selon l'extension, et je vous envoie un rappel avant l'expiration.",
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
          text: "Vous. Je vous transmets tous les accès — administration, hébergement, nom de domaine — ainsi qu'un tutoriel simple pour modifier vos textes et images sans dépendre de moi. Si vous préférez ne pas vous en occuper, je propose une offre de maintenance mensuelle : corrections, mises à jour de sécurité, sauvegardes et support.",
        },
      },
      {
        '@type': 'Question',
        name: 'Combien coûte la maintenance après la livraison ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Elle se calcule entre 15 et 20 % du prix du projet par an, payée en mensualités, avec un minimum de 10 000 FCFA par mois : de 10 000 à 15 000 FCFA par mois pour un site vitrine, jusqu'aux projets complexes, chiffrés sur devis. Les frais d'hébergement et de services tiers sont facturés à part par leurs fournisseurs.",
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
          text: "Je corrige gratuitement tout bug lié à mon développement pendant la durée de support incluse dans votre pack (de 1 à 6 mois selon le pack). Ensuite, il peut être pris en charge par l'offre de maintenance mensuelle ou sur devis.",
        },
      },
      {
        '@type': 'Question',
        name: 'Comment commander mon site ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Trois étapes : on échange sur votre projet et le pack adapté, je vous envoie un devis avec l\'acompte (50 %, ou 40 % pour un projet supérieur à 2 000 000 FCFA), puis dès réception du paiement je démarre le développement.',
        },
      },
    ],
  },
}
