// ════════════════════════════════════════════════════════════════
// src/data/portfolioData.js
// Source de vérité unique pour le contenu partagé entre les
// variantes du portfolio (App.jsx desktop, Appmobile.jsx,
// Win95Portfolio.jsx).
//
// Objectif : un changement de prix, de projet ou de contact se fait
// UNE fois ici, pas 4 fois dans 4 fichiers différents.
//
// Mis à jour le 2026-08-23 à partir des sources projet et documentaires fournies
// dans App.jsx (vérifié plus récent/complet que Win95Portfolio.jsx
// sur PROJECTS, PRICING_TABS et FAQ_ITEMS — voir notes dans le chat).
//
// Mis à jour le 2026-09-19 : PRICING_TABS, SERVICES, SERVICES_MOBILE_COPY
// et PROCESS_STEPS sont alignés sur data.js (site AKATech, 2026-09-16) et
// centralisés ici — Appdesktop.jsx, Appmobile.jsx et App2mobile.jsx ne les
// redéfinissent plus, ils les importent.
//
// Contenu volontairement PAS encore inclus (les versions divergent sur
// le fond, pas juste la forme) : SERVICES_DATA (Win95Portfolio.jsx, ancien
// catalogue), TESTIMONIALS, ABOUT_STATS.
// ════════════════════════════════════════════════════════════════

import { cld } from '../lib/cloudinary.js'

// ─── Identité / contact ────────────────────────────────────────
// Reconcilié entre useSEO.jsx (JSON-LD) et le README — Win95Portfolio.jsx
// avait 2 erreurs corrigées ici : l'URL akaTech ("akatech-agence.vercel.app"
// au lieu de "akatech.vercel.app") et un LinkedIn tronqué.
export const CONTACT = {
  name: "M'Bollo aka",
  shortName: 'Elvis',
  short: 'Elvis K.', // alias attendu par Win95Portfolio.jsx
  title: 'Développeur Web Full Stack',
  tagline: "Je construis des apps web modernes pour l'Afrique",
  agency: 'AKATech Studio',
  agencyUrl: 'https://akatech.vercel.app/',
  site: 'https://akatech.vercel.app/', // alias attendu par Win95Portfolio.jsx
  location: "Abidjan, Côte d'Ivoire",
  email: 'wthomasss06@gmail.com',
  phone: '+225 01 42 50 77 50',
  whatsapp: '+225 01 42 50 77 50', // format brut — Win95 fait .replace(/\D/g,'') dessus
  whatsappUrl: 'https://wa.me/2250142507750',
  github: 'https://github.com/wthomasss06-stack',
  // App.jsx (code live, 2 occurrences) + Win95Portfolio.jsx utilisent cette version
  // courte -> traitée comme canonique. Le README, lui, a la version longue
  // "m-bollo-aka-60a1b1340" : à corriger dans le README si la courte est bien la bonne.
  linkedin: 'https://www.linkedin.com/in/m-bollo-aka',
  facebook: 'https://web.facebook.com/profile.php?id=61577494705852',
  photo: '/assets/images/IMG_20250124_124101KK.webp',
  cv: '/assets/CV_MBOLLO_AKA_ELVIS.pdf',
}

// ─── Projets ────────────────────────────────────────────────────
// Version App.jsx (la plus complète : narratif problem/solution/result,
// variantes d'images). Win95Portfolio.jsx a une version plus pauvre
// (mêmes projets, sans le narratif) — à migrer vers celle-ci.
export const PROJECTS = [
  {
    id: 1, title: 'ShopCI', sub: 'Marketplace E-commerce', cat: 'en-ligne', img: cld('/assets/images/projects/shopci--preview.webp'), responsive: cld('/assets/images/projects/shopci-responsive.webp'), imgFb: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600', tech: ['Next.js 16', 'Django REST Framework', 'NextAuth v4', 'Tailwind CSS', 'PWA'], url: 'https://shopci-v2.vercel.app/', desc: "Marketplace multi-vendeurs ivoirienne type Amazon : catalogue, panier, commandes, livraison géolocalisée avec preuve photo et paiement à la livraison, PWA installable.", year: '2026',
    private: true,
    problem: "Les vendeurs locaux n'avaient pas de vitrine en ligne fiable pour centraliser leurs produits et rassurer les acheteurs.",
    solution: "Marketplace Next.js 16 / Django REST avec authentification Google, back-office vendeur, livraison géolocalisée avec preuve de réception et paiement à la livraison.",
    features: ["Catalogue, panier et commandes multi-vendeurs", "Livraison géolocalisée avec preuve photo et confirmation de réception", "Authentification Google uniquement, avec onboarding acheteur/vendeur", "Tableaux de bord acheteur et vendeur séparés", "PWA installable (Chrome/Android et iOS)"],
    result: "Estimation : temps de mise en ligne d'un produit réduit à quelques minutes pour un vendeur, contre plusieurs heures avant."
  },
  {
    id: 2, title: 'TechFlow', sub: 'Site Vitrine Professionnel', cat: 'en-ligne', img: cld('/assets/images/projects/techflow-preview.webp'), responsive: cld('/assets/images/projects/techflow.webp'), imgFb: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600', tech: ['HTML / Tailwind CSS', 'JavaScript', 'Vercel'], url: 'https://techflow-ten.vercel.app/', desc: 'Site vitrine moderne destiné à présenter une activité technologique de manière claire et professionnelle.', year: '2024',
    problem: "Le client n'avait aucune présence web pour présenter son activité tech de façon crédible.",
    solution: "Site vitrine one-page rapide, structuré autour de l'offre et des preuves de confiance.",
    features: ["Design moderne responsive (mobile, tablette, desktop)", "Mode sombre/clair", "Carousel de projets", "Pages Services, À propos, Contact, FAQ, Blog", "SEO optimisé"],
    result: "Estimation : site livré en moins d'une semaine, prêt à être partagé en prospection commerciale."
  },
  {
    id: 3, title: 'TerraSafe', sub: 'Marketplace Foncière', cat: 'en-ligne', img: cld('/assets/images/projects/terrasafe-preview.webp'), responsive: cld('/assets/images/projects/terrasafe.webp'), imgFb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600', tech: ['Python/Flask', 'MySQL', 'JavaScript', 'Bootstrap 5'], url: 'https://wthomassss06.pythonanywhere.com', desc: "Plateforme foncière visant à réduire les risques d'arnaques liées à la vente de terrains. Backend sécurisé avec recherche avancée.", year: '2024',
    problem: "Trop d'arnaques sur la vente de terrains, faute de vérification des annonces et des vendeurs.",
    solution: "Backend sécurisé Flask/MySQL avec recherche avancée et structuration des annonces foncières.",
    result: "Architecture validée qui a servi de socle technique à NEXURA — preuve qu'elle tenait la route à l'échelle."
  },
  {
    id: 4, title: 'Chap-chapMAP', sub: 'Navigation Intelligente', cat: 'demo', img: cld('/assets/images/projects/chapchapmap-preview.webp'), responsive: cld('/assets/images/projects/chapchapmap.webp'), imgFb: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600', tech: ['JavaScript', 'Leaflet.js', 'OSRM API', 'Geolocation API'], url: '/demos/chap-chapMAP.html', github: 'https://github.com/wthomasss06-stack/akafolio2/blob/main/public/demos/chap-chapMAP.html', desc: "Application de cartographie intelligente permettant de localiser un utilisateur en temps réel et de calculer des itinéraires optimisés.", year: '2023',
    problem: "Se déplacer efficacement à Abidjan sans application de navigation locale fiable.",
    solution: "Cartographie interactive avec géolocalisation temps réel et calcul d'itinéraires via l'API OSRM.",
    features: ["Géolocalisation en temps réel de l'utilisateur", "Calcul d'itinéraire optimisé (API OSRM)", "Carte interactive Leaflet.js", "Recherche de point d'intérêt"],
    result: "Démo technique validant la maîtrise des API de cartographie et de géolocalisation en conditions réelles."
  },
  {
    id: 5, title: 'ElvisMarket', sub: 'Interface E-commerce', cat: 'demo', img: cld('/assets/images/projects/elvismarket-preview.webp'), responsive: cld('/assets/images/projects/elvismarket.webp'), imgFb: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600', tech: ['HTML + JS vanilla', 'Tailwind CSS', 'LocalStorage'], url: '/demos/projet2.html', github: 'https://github.com/wthomasss06-stack/akafolio2/blob/main/public/demos/projet2.html', desc: "Interface e-commerce développée pour expérimenter la gestion d'état, le panier dynamique et l'optimisation de l'UX.", year: '2023',
    problem: "Maîtriser la gestion d'état et le panier dynamique en JS vanilla, sans framework, avant de passer à l'échelle.",
    solution: "Interface e-commerce complète construite en JS vanilla + LocalStorage, sans dépendance lourde.",
    features: ["Panier dynamique persistant (LocalStorage)", "Catalogue produits filtrable", "Tunnel d'achat complet simulé", "Aucune dépendance framework"],
    result: "Projet d'entraînement dont l'architecture front a directement nourri ShopCI et TechFlow."
  },
  {
    id: 6, title: 'MonCashJour', sub: 'Gestion de Ventes', cat: 'demo', img: cld('/assets/images/projects/moncashjour-preview.webp'), responsive: cld('/assets/images/projects/moncashjour.webp'), imgFb: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600', tech: ['HTML + JS vanilla', 'Tailwind CSS', 'Chart.js'], url: '/demos/projet1.html', github: 'https://github.com/wthomasss06-stack/akafolio2/blob/main/public/demos/projet1.html', desc: 'Application de gestion de ventes quotidiennes destinée aux petits commerçants.', year: '2023',
    problem: "Les petits commerçants n'ont pas d'outil simple pour suivre leurs ventes journalières.",
    solution: "Application de gestion de ventes avec visualisation Chart.js, pensée pour un usage terrain rapide.",
    features: ["Saisie rapide des ventes du jour", "Visualisation des tendances (Chart.js)", "Historique des ventes par période", "Pensé pour un usage terrain, sans configuration complexe"],
    result: "Estimation : saisie et suivi des ventes du jour en moins de 2 minutes pour un commerçant."
  },
  {
    id: 7, title: 'LivreurTrack Pro', sub: 'Suivi Logistique', cat: 'demo', img: cld('/assets/images/projects/livreurtrack-preview.webp'), responsive: cld('/assets/images/projects/livreurtrack.webp'), imgFb: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', tech: ['JavaScript', 'Bootstrap 5', 'LocalStorage', 'Camera API'], url: '/demos/projet3.html', github: 'https://github.com/wthomasss06-stack/akafolio2/blob/main/public/demos/projet3.html', desc: "Système de suivi logistique simulant un workflow réel de livraison, avec validation par photo et suivi d'étapes.", year: '2023',
    problem: "Les livraisons locales manquent de traçabilité : pas de preuve de dépôt, pas de suivi d'étapes.",
    solution: "Système de suivi logistique avec validation photo (Camera API) et statuts de livraison en direct.",
    features: ["Suivi d'étapes de livraison en direct", "Validation par photo (Camera API)", "Statuts de livraison simulés de bout en bout", "Interface responsive Bootstrap"],
    result: "Simulation d'un vrai workflow logistique, de la prise en charge jusqu'à la preuve de livraison."
  },
  {
    id: 8, title: 'LinkedIn Banner Pro', sub: 'Générateur SaaS', cat: 'en-cours', img: cld('/assets/images/projects/linkedin-banner-preview.webp'), responsive: cld('/assets/images/projects/linkedin-banner.webp'), imgFb: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600', tech: ['JavaScript', 'Canvas API', 'Tailwind CSS'], url: '/demos/projet7.html', github: 'https://github.com/wthomasss06-stack/akafolio2/blob/main/public/demos/projet7.html', desc: 'Outil SaaS en cours de développement permettant de générer des bannières LinkedIn professionnelles.', year: '2025',
    problem: "Créer une bannière LinkedIn pro demande des outils de design payants ou complexes à prendre en main.",

    solution: "Générateur SaaS avec rendu Canvas API, pensé pour un export rapide sans compétence design.",
    result: "Projet en cours — objectif : générer une bannière personnalisée en moins de 60 secondes."
  },
  {
    id: 9, title: 'Tati', sub: 'Portfolio & Vitrine Moderne', cat: 'en-ligne', img: cld('/assets/images/projects/tati-preview.webp'), responsive: cld('/assets/images/projects/tati.webp'), imgFb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600', tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel'], url: 'https://tatii.vercel.app/', desc: 'Portfolio personnel double fonction avec animations fluides, thème sombre/clair, design 100% responsive.', year: '2024',
    github: 'https://github.com/wthomasss06-stack/tatii',
    problem: "Besoin d'un portfolio personnel qui sorte du template classique, avec une vraie identité visuelle.",
    solution: "Portfolio React/Framer Motion sur-mesure, thème clair/sombre, animations soignées de bout en bout.",
    features: ["Thème sombre/clair", "Animations Framer Motion", "Design 100% responsive", "Double fonction : portfolio + vitrine"],
    result: "Livré et déployé en production — utilisé activement comme vitrine professionnelle."
  },
  {
    id: 10, title: 'MK', sub: 'Portfolio Graphiste Client', cat: 'en-ligne', img: cld('/assets/images/projects/mk-preview.webp'), responsive: cld('/assets/images/projects/mk.webp'), imgFb: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=600', tech: ['React', 'Tailwind CSS', 'Framer Motion', 'Vercel'], url: 'https://mory01ff.vercel.app/', desc: 'Portfolio professionnel sur-mesure pour un client graphiste. Galerie immersive, animations soignées.', year: '2024',
    problem: "Un graphiste avait besoin d'une galerie en ligne qui valorise ses créations sans les noyer dans un template.",
    solution: "Portfolio sur-mesure avec galerie immersive et animations pensées pour mettre le visuel en avant.",
    features: ["Galerie immersive de créations", "Animations sur-mesure", "Mise en avant du visuel graphiste", "Design entièrement personnalisé, aucun template"],
    result: "Livré au client et en ligne — sert de vitrine commerciale directe pour ses prestations."
  },
  {
    id: 11, title: 'ManoBeat 777', sub: 'Portfolio Beatmaker', cat: 'en-ligne', img: cld('/assets/images/projects/beatstore-preview.webp'), responsive: cld('/assets/images/projects/beatstore.webp'), imgFb: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', tech: ['React', 'Tailwind CSS', 'Howler.js', 'Vercel'], url: 'https://xxx-x.vercel.app/', desc: "Portfolio d'un beatmaker ivoirien : découvrez et écoutez ses créations directement en ligne.", year: '2025',
    problem: "Un beatmaker ivoirien n'avait aucun moyen de faire écouter ses créations en ligne et de les vendre sans dépendre d'une plateforme tierce.",
    solution: "Kit beatmaker complet : dashboard Flask pour ajouter un beat depuis un simple lien Google Drive (titre, genre, BPM, prix, mood), et vitrine Next.js avec lecteur audio intégré.",
    features: ["Écoute de 30 secondes avant achat (Howler.js)", "Achat déclenché via WhatsApp, message pré-rempli avec le nom du beat", "Ajout d'un beat depuis le dashboard en collant un lien Google Drive", "Fiche beat : titre, genre, BPM, prix, mood", "Dashboard admin protégé par mot de passe"],
    result: "Estimation : écoute d'un beat ramenée à un simple clic, et mise en ligne d'un nouveau titre en moins d'une minute pour le beatmaker."
  },
  {
    id: 12, title: 'New Horizon Service', sub: 'Location de Résidences', cat: 'en-ligne', img: cld('/assets/images/projects/newhorizon-preview.webp'), responsive: cld('/assets/images/projects/newhorizon.webp'), imgFb: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600', tech: ['Next.js', 'Flask', 'Python', 'MySQL', 'Vercel'], url: 'https://new-horizonservice.vercel.app/', desc: 'Plateforme de location de résidences meublées haut de gamme avec backend Flask sécurisé.', year: '2025',
    github: 'https://github.com/wthomasss06-stack/AllonsSomo',
    problem: "Les résidences meublées haut de gamme manquaient d'une plateforme de réservation fiable — la prise de contact restait dispersée entre appels et bouche-à-oreille.",
    solution: "Plateforme Next.js / Flask avec admin sécurisé pour publier une résidence (carte GPS Leaflet, photos, équipements, tarifs), et réservation déclenchée directement via WhatsApp avec dates et tarif pré-remplis.",
    features: ["Hero carousel animé et recherche par ville et type de bien", "Réservation par WhatsApp avec message pré-rempli (dates, tarif)", "Admin : ajout de résidence avec carte GPS Leaflet, jusqu'à 10 photos", "Tarifs nuit / journée / semaine / mois avec caution automatique (20%)", "Mode clair/sombre persistant"],
    result: "En production — a servi de base validée avant l'évolution vers NEXURA."
  },
  {
    id: 13, title: 'AKATech Studio', sub: 'Agence Digitale Abidjan', cat: 'en-ligne', img: cld('/assets/images/projects/akatech-preview.webp'), responsive: cld('/assets/images/projects/akatech.webp'), imgFb: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600', tech: ['Next.js 15', 'Framer Motion', 'WebGL Aurora', 'Vercel'], url: 'https://akatech.vercel.app/', desc: "Site officiel de mon agence — AKATech Studio accompagne les entrepreneurs et PME en Côte d'Ivoire.", year: '2025',
    github: 'https://github.com/wthomasss06-stack/akatech-agencenext',
    problem: "Mon agence n'avait pas de site propre capable de convertir les prospects en clients.",
    solution: "Site agence Next.js 15 avec WebGL Aurora, animations Framer Motion et structure orientée conversion (process, pricing, projets).",
    result: "En production, indexé rapidement sur Google — sert de vitrine commerciale principale."
  },
  {
    id: 14, title: 'Université les Anges', sub: 'Site Institutionnel', cat: 'en-ligne', img: cld('/assets/images/projects/universitelesanges-preview.webp'), responsive: cld('/assets/images/projects/universitelesanges.webp'), imgFb: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600', tech: ['HTML', 'CSS', 'Bulma', 'Bootstrap', 'Vercel'], url: 'https://universitelesanges.vercel.app/', desc: "Site institutionnel moderne pour l'Université les Anges.", year: '2025',
    github: 'https://github.com/wthomasss06-stack/universite-les-anges',
    problem: "Une université privée avait besoin d'un site institutionnel crédible pour rassurer futurs étudiants et parents.",
    solution: "Site institutionnel structuré (présentation, filières, contact) en HTML/Bulma/Bootstrap.",
    features: ["Présentation des filières", "Pages institutionnelles (à propos, contact)", "Design responsive Bulma/Bootstrap"],
    result: "Livré et en ligne — utilisé comme point d'entrée officiel de l'établissement."
  },
  {
    id: 15, title: 'NEXURA', sub: 'Marketplace Immobilière & Transactions Sécurisées', cat: 'en-ligne', img: cld('/assets/images/projects/nexura-preview.webp'), responsive: cld('/assets/images/projects/nexura-responsive.webp'), imgFb: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600', tech: ['Next.js 14', 'Django REST', 'Python', 'PostgreSQL', 'WebSockets', 'Redis + Celery', 'Cloudinary', 'Mapbox', 'Vercel + Render'], url: 'https://nexura-one.vercel.app/', desc: "Plateforme ivoirienne multi-catégorie pour découvrir, publier, réserver et sécuriser des annonces de terrains, résidences, véhicules, motos et locaux commerciaux.", year: '2025',
    private: true,
    problem: "Les annonces immobilières et de biens étaient dispersées, avec un risque élevé d'arnaques, des vendeurs difficiles à vérifier, des paiements peu transparents et aucun suivi fiable des réservations.",
    solution: "Marketplace Next.js 14 + Django REST avec KYC progressif (CNI + selfie) avant transaction, recherche par catégorie/prix/localisation et paiement Mobile Money préparé.",
    features: ["Multi-catégories : terrains, résidences, véhicules, motos, locaux commerciaux", "KYC progressif CNI + selfie avant toute transaction", "Calendrier de réservation et notifications temps réel (WebSocket)", "Dashboards séparés acheteur / vendeur / admin", "Bon de visite PDF + QR code", "Panel admin à double protection (JWT + clé serveur)"],
    result: "Socle V2/V3 documenté et validé localement avec tests ciblés, build frontend, règles serveur et parcours acheteur/vendeur/admin ; produit privé en évolution continue."
  },
  {
    id: 16, title: 'KokoEat', sub: 'Marketplace Locale de Restauration & Livraison', cat: 'en-ligne', img: cld('/assets/images/projects/kokoeat-preview.webp'), hoverVideo: cld('/assets/images/projects/kokoeat-preview.webm'), responsive: cld('/assets/images/projects/kokoeat-responsive.webp'), imgFb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600', tech: ['React', 'Vite', 'Django REST', 'Python', 'PostgreSQL', 'WebSockets', 'Redis + Celery', 'Cloudinary', 'Vercel + Render'], url: 'https://koko-eats.vercel.app', desc: "KokoEat aide à découvrir les restaurants locaux et leurs menus, dans les quartiers et les villes couverts, pour choisir entre se rendre sur place ou commander à distance.", year: '2025',
    problem: "Dans beaucoup de quartiers et de villes, les restaurants locaux restent difficiles à découvrir. Les clients connaissent mal les adresses disponibles, tandis que des établissements intéressants restent invisibles au-delà de leur zone habituelle.",
    solution: "KokoEat rassemble les restaurants et leurs menus sur une même plateforme pour donner une vue plus large de l'offre de restauration en Côte d'Ivoire. On peut repérer une adresse, consulter son menu, décider de s'y rendre ou commander lorsque le service est disponible.",
    features: ["Panier mono-restaurant avec suivi de commande en temps réel", "Paiement Wave et espèces selon les contrats actifs", "Dashboard restaurant : menu, promotions, statistiques, livraison GPS", "Assistant Kôkô IA borné par des règles métier (découverte, suivi de commande)", "Fidélité, vouchers et abonnement client", "PWA installable"],
    result: "Une expérience qui rapproche les clients des restaurants locaux et donne à ces établissements une vitrine au-delà de leur quartier. La couverture s'élargit progressivement, sans prétendre que toutes les villes et tous les restaurants sont déjà disponibles."
  },
  {
    id: 17, title: 'Jean Edy · Portfolio', sub: 'Portfolio React UI Avancé', cat: 'en-ligne', img: cld('/assets/images/projects/jean-edy-preview.webp'), responsive: cld('/assets/images/projects/jean-edy.webp'), imgFb: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600', tech: ['React 18', 'Vite', 'GSAP', 'Framer Motion', 'TailwindCSS'], url: 'https://jean-edy-dev.vercel.app/', desc: "Portfolio personnel de Jean Edy — Software Developer basé à Abidjan. et skeuomorphisme complet.", year: '2026',
    private: true,
    problem: "Un développeur avait besoin d'un portfolio qui démontre un niveau UI avancé pour ses candidatures.",
    solution: "Portfolio React 18/GSAP avec direction artistique skeuomorphisme complet, sur-mesure.",
    features: ["Direction artistique skeuomorphisme complète", "Animations GSAP + Framer Motion sur-mesure", "Design entièrement personnalisé, aucun template"],
    result: "Livré et en ligne — repo privé (client)."
  },
  {
    id: 18, title: 'MD Laverie Pressing', sub: 'Site Vitrine Pressing', cat: 'en-ligne', img: cld('/assets/images/projects/laverie-preview.webp'), responsive: cld('/assets/images/projects/laverie.webp'), imgFb: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600', tech: ['React 18', 'Vite', 'GSAP', 'React Router v6', 'EmailJS'], url: 'https://laverie-plus.vercel.app/', desc: "Site vitrine complet pour MD Laverie Pressing, Abidjan. Hero slider GSAP, grille packs pricing, formulaire contact EmailJS.", year: '2025',
    github: 'https://github.com/wthomasss06-stack/PRESSING',
    problem: "Un pressing à Abidjan n'avait aucune présence en ligne pour présenter ses tarifs et être contacté.",
    solution: "Site vitrine React/GSAP avec hero slider, grille de tarifs claire et formulaire de contact EmailJS.",
    features: ["Hero slider animé (GSAP)", "Grille de tarifs des prestations", "Formulaire de contact EmailJS", "Navigation multi-pages (React Router v6)"],
    result: "Livré et en ligne — génère des demandes de contact directement depuis le site."
  },
  {
    id: 19, title: 'Chez Florence', sub: 'Vente & Réservation de Lapins', cat: 'en-ligne', img: cld('/assets/images/projects/chez-florence-preview.webp'), responsive: cld('/assets/images/projects/chez-florence-responsive.webp'), responsive2: cld('/assets/images/projects/chez-florence-responsive2.webp'), imgFb: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600', tech: ['Next.js 14', 'Express.js', 'Prisma', 'PostgreSQL (Neon)', 'Cloudinary'], url: 'https://chez-florence.vercel.app/', github: 'https://github.com/wthomasss06-stack/lapinou', desc: "Plateforme web complète pour vente et réservation de lapins : fiches par race, stock temps réel, réservation en ligne, notifications WhatsApp et administration sécurisée.", year: '2026',
    problem: "Les sites d'élevage étaient trop similaires et incapables de convertir les visiteurs en clients tout en gérant le stock et les réservations en temps réel.",
    solution: "Application Next.js / Express avec fiches détaillées par race, sélection de quantité, stock synchronisé, ouverture automatique de WhatsApp et tableau de bord admin pour gérer les stocks, les réservations et les ventes.",
    features: ["Fiches détaillées par race avec galerie photos/vidéos", "Réservation en ligne avec stock synchronisé en temps réel", "Ouverture automatique de WhatsApp avec message pré-rempli", "Dashboard admin : stock, réservations et statistiques de ventes", "Notification email admin à chaque réservation (Resend)", "PWA installable (Android, iPhone, Windows, macOS)"],
    result: "PWA installable en production, centralise les réservations et le stock, rend l'achat plus rapide et automatise la conversion client via WhatsApp et notification admin."
  },
  {
    id: 20,
    title: 'ChapChap Bara',
    sub: 'SaaS Analyse de Candidature & CV',
    cat: 'en-ligne',
    img: '/assets/images/projects/chapchapbara-preview.png',
    responsive: '/assets/images/projects/chapchapbara-preview.png',
    imgFb: '/assets/images/projects/chapchapbara-preview.png',
    hoverVideo: '/assets/images/projects/chapchapbara-preview.webm',
    tech: ['React', 'Vite', 'Django REST', 'Python', 'PostgreSQL', 'Vercel + Render'],
    url: 'https://chapchap-bara.vercel.app/',
    private: true,
    desc: "Plateforme de préparation aux candidatures pour l'Afrique francophone : elle compare une offre d'emploi et un CV, puis fournit un diagnostic explicable et un guide d'entretien lorsque la candidature est défendable.",
    problem: "Les candidats manquaient d'un moyen fiable de savoir si leur CV prouvait réellement les exigences d'une offre, sans subir une optimisation artificielle ou inventée.",
    solution: "SaaS React/Vite avec backend Django REST, analyse déterministe de compatibilité, règle anti-invention, CV corrigé ligne par ligne et guide de réponses personnalisées.",
    result: "Produit déployé sur Vercel avec backend Render et PostgreSQL : première analyse gratuite, diagnostic explicable et préparation complète en quelques minutes, sans abonnement obligatoire.",
  },
  {
    id: 21, title: 'Karnet', sub: 'Gestion Opérationnelle PME (Mobile-First)', cat: 'en-ligne', img: cld('/assets/images/projects/karnet-preview.webp'), responsive: cld('/assets/images/projects/karnet-responsive.webp'), imgFb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600', tech: ['Expo / React Native', 'NestJS', 'Prisma', 'Next.js 15', 'PostgreSQL (Neon)'], url: 'https://karnet-ci.vercel.app/', desc: "Plateforme de gestion opérationnelle (clients, ressources, réservations) pour PME de service, mobile-first : app Expo en CRUD complet et web admin Next.js.", year: '2026',
    problem: "Les PME de service géraient clients, ressources et réservations de façon dispersée, sans outil mobile adapté à leur activité terrain.",
    solution: "Monorepo Expo (mobile, CRUD complet) + NestJS (API) + Next.js (web admin : dashboard, journal d'audit avec export CSV, gestion d'équipe), types Zod partagés entre les trois.",
    features: ["App mobile Expo en CRUD complet (clients, ressources, réservations)", "Web admin : dashboard, journal d'audit avec export CSV, gestion d'équipe", "Auth Google OAuth → JWT maison", "Upload média Cloudinary signé depuis le mobile", "Types Zod partagés entre mobile, web et API"],
    result: "Mobile et web vérifiés (0 erreur TypeScript, build de production Next.js réussi) ; API construite sur les patterns Prisma 7 / NestJS confirmés."
  },
  {
    id: 22, title: 'ProTech POS', sub: 'Caisse Offline-First pour Boutiques', cat: 'en-ligne', img: cld('/assets/images/projects/pos-preview.webp'), responsive: cld('/assets/images/projects/pos-responsive.webp'), imgFb: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600', tech: ['React 19', 'Vite', 'TypeScript', 'Django 6', 'DRF', 'PostgreSQL', 'PWA'], url: 'https://akapos-pi.vercel.app/', desc: "Caisse (POS) et gestion opérationnelle pour petites boutiques, pensée pour continuer à fonctionner même avec une connexion instable.", year: '2026',
    problem: "Les petites boutiques perdent des ventes ou risquent des doublons quand la connexion Internet coupe en pleine caisse.",
    solution: "PWA offline-first : chaque vente s'enregistre d'abord en IndexedDB, puis un moteur de synchronisation la rejoue vers l'API Django via une clé d'idempotence générée côté client.",
    features: ["Vente enregistrée en local avant tout appel réseau", "Synchronisation par clé d'idempotence : aucune vente perdue ni dupliquée", "PWA installable", "Comptes gérant / caissier distincts"],
    result: "MVP V1 fonctionnel : 42 tests backend passants, build frontend TypeScript strict sans erreur, parcours de bout en bout validé manuellement."
  },
  {
    id: 23, title: 'Anyama Proxy', sub: "Annuaire Local d'Artisans", cat: 'en-ligne', img: cld('/assets/images/projects/anyama-proxy-preview.webp'), responsive: cld('/assets/images/projects/anyama-proxy-responsive.webp'), imgFb: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600', tech: ['Flask', 'PostgreSQL (Neon)', 'HTML / CSS / JS', 'Resend'], url: 'https://anyama-proxy.vercel.app/', desc: "Annuaire local d'artisans et services à Anyama : recherche par métier et quartier, contact direct WhatsApp/téléphone, inscription sans compte.", year: '2026',
    problem: "La recherche d'un artisan local à Anyama se faisait de façon dispersée : appels, réseaux sociaux, bouche-à-oreille.",
    solution: "Annuaire Flask/PostgreSQL avec recherche par métier et quartier, inscription artisan sans compte, dashboard admin (validation, retraits, avis) et notifications Resend.",
    features: ["Recherche par mot-clé, métier et quartier", "Inscription artisan sans création de compte", "Dashboard admin : validation, retraits, avis, actualisation auto toutes les 30s", "Notifications e-mail Resend", "PWA installable, thèmes clair/sombre"],
    result: "V2 finalisée : annuaire public, page de retrait, modération des avis, thèmes clair/sombre, PWA installable, actualisation admin automatique toutes les 30 secondes."
  },
  {
    id: 24, title: 'R3NS3IGN3M3NT', sub: 'Registre de Visiteurs par QR Code', cat: 'en-ligne', img: cld('/assets/images/projects/r3ns3ngn3m3nt-preview.webp'), responsive: cld('/assets/images/projects/r3ns3ngn3m3nt-responsive.webp'), imgFb: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600', tech: ['Next.js 14', 'Django REST Framework', 'PostgreSQL (Neon)', 'Dexie.js / IndexedDB'], url: 'https://renseignement.vercel.app/', desc: "SaaS de prise de renseignements par QR code pour bureaux, restaurants, hôtels et accès de salle : modèle kiosque 100% offline.", year: '2026',
    problem: "Les bureaux, restaurants et hôtels géraient encore la prise de renseignements avec un cahier papier : lent à consolider, non confidentiel.",
    solution: "Modèle kiosque : une tablette d'accueil garde tout en offline (Dexie/IndexedDB) et synchronise dès qu'elle retrouve internet ; 3 rôles (Patron, Gérant, Agent), formulaires adaptables par secteur, signature à l'écran.",
    features: ["Mode kiosque 100% offline (Dexie/IndexedDB)", "3 rôles : Patron, Gérant, Agent", "Formulaires adaptables par secteur d'activité", "Signature à l'écran", "Synchronisation automatique au retour du réseau"],
    result: "Backend et frontend testés et déployés : landing plein écran, pages légales, PWA installable, mode sombre, onboarding en 3 étapes."
  },
]
// ─── Tarifs ─────────────────────────────────────────────────────
// Aligné sur data.js (PRICING, site AKATech, 2026-09-16) : mêmes 4 onglets
// (vitrine, ecommerce, saas, gbp), paliers, prix, délais et contenus.
// L'ancien onglet « portfolio » (100 000 / 175 000 / 275 000 FCFA) est retiré,
// comme dans data.js : le portfolio se vend désormais via Site Vitrine.
// Chaque row doit avoir autant de cells que de plans (Appdesktop filtre sur
// `!== false` : une cellule manquante ferait apparaître la ligne).
export const PRICING_TABS = [
  {
    key: 'vitrine', label: 'Site Vitrine',
    plans: [
      { title: 'Landing', price: '150 000 FCFA', delivery: '5 à 7 jours' },
      { title: 'Starter', price: '250 000 FCFA', delivery: '7 à 10 jours', isPopular: true },
      { title: 'Premium', price: '550 000 FCFA', delivery: '10 à 14 jours' },
    ],
    rows: [
      { label: 'Nombre de pages', cells: ['1 page (présentation, services, CTA)', '4 à 6 pages', '10 à 15 pages'] },
      { label: 'Design responsive', cells: [true, true, true] },
      { label: 'Design sur mesure', cells: [false, true, true] },
      { label: 'Formulaire de contact', cells: ['WhatsApp', true, true] },
      { label: 'SEO', cells: [false, 'Base', 'SEO + AEO'] },
      { label: 'Blog intégré', cells: [false, false, true] },
      { label: 'Animations avancées', cells: [false, false, true] },
      { label: 'Nom de domaine (1 an)', cells: [true, true, true] },
      { label: 'Hébergement (1 an)', cells: [true, true, true] },
      { label: 'Support', cells: ['1 mois', '2 mois', '3 mois'] },
      { label: 'Formation', cells: [false, false, '2h'] },
      { label: 'Maintenance mensuelle', cells: ['20 000 à 40 000/mois', '20 000 à 40 000/mois', '20 000 à 40 000/mois'] },
      { label: 'Page supp.', cells: ['15 000 à 25 000 FCFA', '15 000 à 25 000 FCFA', '15 000 à 25 000 FCFA'] },
    ],
  },
  {
    key: 'ecommerce', label: 'E-commerce',
    plans: [
      { title: 'Starter', price: '450 000 FCFA', delivery: '1 mois à 1 mois 2 semaines' },
      { title: 'Pro', price: '750 000 FCFA', delivery: '1 mois à 1 mois 2 semaines', isPopular: true },
      { title: 'Elite', price: '1 500 000 FCFA', delivery: '1 mois à 1 mois 2 semaines' }, // 1 200 000 → 1 500 000 (data.js, sept. 2026)
    ],
    rows: [
      { label: 'Produits', cells: ["Jusqu'à 50", '200–500', 'Illimités'] },
      { label: 'Paiement Mobile Money', cells: [true, true, true] },
      { label: 'Multi-paiement', cells: [false, true, true] },
      { label: 'API paiement custom', cells: [false, false, true] },
      { label: 'Gestion commandes', cells: [true, true, true] },
      { label: 'Gestion stock temps réel', cells: [false, true, true] },
      { label: 'Tableau de bord', cells: [true, true, true] },
      { label: 'SEO produits (SEO/AEO)', cells: [false, true, true] },
      { label: 'Optimisation IA (GEO)', cells: [false, false, true] },
      { label: "CRO (tunnel d'achat optimisé)", cells: [false, true, true] },
      { label: 'Analytics', cells: [false, true, true] },
      { label: 'Rapports avancés', cells: [false, false, true] },
      { label: 'Automatisations', cells: [false, false, true] },
      { label: 'Nom de domaine (1 an)', cells: [true, true, true] },
      { label: 'Hébergement (1 an)', cells: [true, true, true] },
      { label: 'Support', cells: ['1 mois', '3 mois', '6 mois'] },
      { label: 'Formation', cells: [false, 'Admin', 'Équipe'] },
      { label: 'Maintenance mensuelle', cells: ['20 000 à 40 000/mois', '20 000 à 40 000/mois', '20 000 à 40 000/mois'] },
    ],
  },
  {
    key: 'saas', label: 'App Web / SaaS',
    // 3 archétypes en fourchettes (data.js, étude de marché sept. 2026) à la place
    // de l'ancien palier unique « Sur devis ». Le diagnostic gratuit et le devis
    // sous 48h (anciennes lignes de l'onglet) sont conservés en fin de liste.
    // Milliers des fourchettes séparés par des espaces insécables (\u00a0) : sinon le
    // prix se coupe au milieu d'un nombre (« 1 000 / 000 FCFA ») dans les cartes.
    plans: [
      { title: 'MVP / Outil métier', price: '600\u00a0000 – 1\u00a0000\u00a0000 FCFA', delivery: '3 à 5 semaines' },
      { title: 'Plateforme + abonnement', price: '1\u00a0200\u00a0000 – 2\u00a0200\u00a0000 FCFA', delivery: '6 à 10 semaines', isPopular: true },
      { title: 'Marketplace multi-acteurs', price: '2\u00a0500\u00a0000 – 4\u00a0500\u00a0000 FCFA', delivery: '10 à 16 semaines' },
    ],
    rows: [
      { label: "1 à 2 types d'utilisateurs (utilisateur + admin)", cells: [true, false, false] },
      { label: 'Authentification simple', cells: [true, false, false] },
      { label: 'Tableau de bord basique', cells: [true, false, false] },
      { label: '1 workflow métier principal automatisé', cells: [true, false, false] },
      { label: 'Export de données (PDF, Excel)', cells: [true, false, false] },
      { label: 'Comptes utilisateurs avec rôles (client / admin)', cells: [false, true, false] },
      { label: 'Paiement récurrent + Mobile Money', cells: [false, true, false] },
      { label: 'Dashboard utilisateur + back-office admin', cells: [false, true, false] },
      { label: 'Notifications (email, WhatsApp)', cells: [false, true, false] },
      { label: 'Intégrations tierces (paiement, emailing)', cells: [false, true, false] },
      { label: "Plusieurs types d'utilisateurs (client, vendeur/prestataire, admin)", cells: [false, false, true] },
      { label: 'Rôles et permissions avancés, multi-tenant si besoin', cells: [false, false, true] },
      { label: 'Paiement avec répartition entre acteurs', cells: [false, false, true] },
      { label: 'Géolocalisation / suivi temps réel si pertinent', cells: [false, false, true] },
      { label: 'Notifications multi-canal temps réel', cells: [false, false, true] },
      { label: 'Dashboard analytics avancé', cells: [false, false, true] },
      { label: 'API pour intégrations futures', cells: [false, false, true] },
      { label: 'Nom de domaine offert (1 an)', cells: [true, true, true] },
      { label: 'Hébergement inclus (1 an)', cells: [true, true, true] },
      { label: 'Support', cells: ['1 mois', '3 mois', '6 mois'] },
      { label: 'Formation', cells: [false, 'Admin', 'Équipe'] },
      { label: 'Diagnostic gratuit de votre besoin', cells: [true, true, true] },
      { label: 'Devis détaillé sous 48h', cells: [true, true, true] },
    ],
  },
  {
    key: 'gbp', label: 'Fiche Google',
    plans: [
      { title: 'Création', price: '20 000 FCFA', delivery: '1 à 2 jours', isPopular: true, desc: "Vous n'avez pas encore de fiche Google ? Création complète de zéro." },
      { title: 'Optimisation', price: '12 000 FCFA', delivery: '1 jour', desc: 'Fiche déjà existante ? On corrige et améliore ce qui est en place.' },
      { title: 'Suivi mensuel', price: '10 000 FCFA/mois', delivery: 'Continu', desc: 'Gestion continue : avis, publications et statistiques chaque mois.' },
    ],
    rows: [
      { label: 'Création de la fiche (de zéro)', cells: [true, false, false] },
      { label: 'Vérification infos (NAP)', cells: [true, true, false] },
      { label: 'Horaires + zone de service', cells: [true, true, false] },
      { label: 'Catégorie + attributs', cells: [true, true, false] },
      { label: 'Lien vers le site web', cells: [true, true, false] },
      { label: 'Ajout photos (logo, local, produits)', cells: [true, true, false] },
      { label: 'Description optimisée SEO local', cells: [true, true, false] },
      { label: "Mots-clés locaux ciblés", cells: [true, true, false] },
      { label: 'Intégration carte sur le site', cells: [true, false, false] },
      { label: 'Réponse aux avis clients', cells: [false, false, true] },
      { label: 'Posts Google réguliers', cells: [false, false, true] },
      { label: 'Suivi statistiques de fiche', cells: [false, false, true] },
    ],
  },
]

// ─── Compétences ────────────────────────────────────────────────
// Win95Portfolio.jsx liste des compétences différentes (icônes CDN,
// pourcentages, catégorie 'autres' avec Word/Excel/etc.) — pas fusionné
// automatiquement, c'est un choix de contenu, pas juste un format.
export const SKILLS = {
  frontend: [
    { name: 'React', icon: '/assets/icons/devicon/react/react-original.svg', color: '#61DAFB' },
    { name: 'JavaScript', icon: '/assets/icons/devicon/javascript/javascript-original.svg', color: '#F7DF1E' },
    { name: 'TypeScript', icon: '/assets/icons/devicon/typescript/typescript-original.svg', color: '#3178C6' },
    { name: 'Next.js', icon: '/assets/icons/devicon/nextjs/nextjs-original.svg', color: '#ffffff' },
    { name: 'Tailwind', icon: '/assets/icons/devicon/tailwindcss/tailwindcss-original.svg', color: '#38BDF8' },
    { name: 'HTML5', icon: '/assets/icons/devicon/html5/html5-original.svg', color: '#E34F26' },
    { name: 'CSS3', icon: '/assets/icons/devicon/css3/css3-original.svg', color: '#1572B6' },
    { name: 'Bootstrap', icon: '/assets/icons/devicon/bootstrap/bootstrap-original.svg', color: '#7952B3' },
    { name: 'GSAP', icon: '/assets/icons/simple-icons/gsap.svg', color: '#0AE448' },
    { name: 'WebGL', icon: '/assets/icons/simple-icons/webgl.svg', color: '#990000' },
    { name: 'Chart.js', icon: '/assets/icons/devicon/chartjs/chartjs-original.svg', color: '#FF6384' },
    { name: 'Leaflet.js', icon: '/assets/icons/simple-icons/leaflet.svg', color: '#199900' },
  ],
  backend: [
    { name: 'Python', icon: '/assets/icons/devicon/python/python-original.svg', color: '#4B8BBE' },
    { name: 'Flask', icon: '/assets/icons/devicon/flask/flask-original.svg', color: '#AAAAAA' },
    { name: 'Django', icon: '/assets/icons/devicon/django/django-plain.svg', color: '#44B78B' },
    { name: 'Node.js', icon: '/assets/icons/devicon/nodejs/nodejs-original.svg', color: '#539E43' },
    { name: 'Express.js', icon: '/assets/icons/devicon/express/express-original.svg', color: '#444444' },
    { name: 'MySQL', icon: '/assets/icons/devicon/mysql/mysql-original.svg', color: '#F29111' },
  ],
  tools: [
    { name: 'Git', icon: '/assets/icons/devicon/git/git-original.svg', color: '#F05032' },
    { name: 'VS Code', icon: '/assets/icons/devicon/vscode/vscode-original.svg', color: '#007ACC' },
    { name: 'GitHub', icon: '/assets/icons/devicon/github/github-original.svg', color: '#ffffff' },
    { name: 'Vercel', icon: '/assets/icons/devicon/vercel/vercel-original.svg', color: '#ffffff' },
    { name: 'Prisma', icon: '/assets/icons/devicon/prisma/prisma-original.svg', color: '#2D3748' },
    { name: 'Cloudinary', icon: '/assets/icons/simple-icons/cloudinary.svg', color: '#3448C5' },
  ],
}

// ─── Parcours ───────────────────────────────────────────────────
export const TIMELINE = [
  { date: '2025–2026', title: 'Développeur Freelance Fullstack', company: 'AKATech Studio', items: ["Conception et déploiement de +10 Projets web (SaaS, e-commerce, plateformes)", "Développement d'API REST avec Django et Flask", "Mise en place de dashboards et systèmes de gestion de données"], tags: ['Freelance', 'Full-Stack', 'Django', 'React', 'SaaS'] },
  { date: 'Mai–Nov. 2025', title: 'Informaticien Stagiaire', company: "Mairie d'Agboville", items: ['Maintenance du parc informatique et du réseau', 'Support technique aux utilisateurs', 'Contribution à la gestion et numérisation des données'], tags: ['Maintenance', 'Réseau', 'Support'] },
  { date: '2023–2024', title: 'Projet Académique – ARTICI', company: 'UVCI', items: ["Plateforme web de promotion de l'artisanat local", "Travail collaboratif en équipe pluridisciplinaire", "Intégration de bonnes pratiques de sécurité"], tags: ['Frontend', 'Backend', 'Sécurité'] },
  { date: '2023–2024', title: 'Licence Réseau et Sécurité Informatique', company: 'UVCI', items: ['Formation complète en développement web, bases de données et sécurité', 'Certification E-Banking — Réf: CC/24-002485'], tags: ['Diplôme', 'Certification'] },
  { date: '2020–2021', title: 'Baccalauréat Série D', company: "Lycée Moderne d'Arrah", items: ['Mention : Assez Bien'], tags: ['Diplôme'] },
]

// ─── Enrichissement du parcours (icônes + desc courte, utilisés par ───
// Win95Portfolio.jsx / Appmobile.jsx, absents de la version App.jsx) ───
// Mappé par index : les 5 entrées sont dans le même ordre partout.
const TIMELINE_EXTRAS = [
  { icon: 'fa-rocket', desc: 'Conception et déploiement de 10+ apps web (SaaS, e-commerce, plateformes). APIs REST Django/Flask, dashboards, déploiement cloud.', progLabels: ['Apps web', 'API REST', 'Dashboards', 'Déploiement'], progValues: [95, 88, 82, 90] },
  { icon: 'fa-briefcase', desc: "Maintenance parc informatique, support technique, numérisation des données et création d'outils numériques internes.", progLabels: ['Maintenance', 'Support', 'Gestion', 'Outils'], progValues: [90, 85, 75, 80] },
  { icon: 'fa-graduation-cap', desc: "Plateforme web de promotion de l'artisanat local. Travail collaboratif pluridisciplinaire, optimisation et sécurité.", progLabels: ['Frontend', 'Backend', 'Perf.', 'Sécurité'], progValues: [80, 75, 85, 90] },
  { icon: 'fa-book', desc: 'Formation complète en développement web, bases de données et sécurité des applications.' },
  { icon: 'fa-school', desc: 'Mention : Assez Bien.' },
]
TIMELINE.forEach((t, i) => { Object.assign(t, TIMELINE_EXTRAS[i]) })


// ─── Compatibilité champs PROJECTS ───────────────────────────────
// Win95Portfolio.jsx / Appmobile.jsx utilisent .subtitle/.image/.progress/
// .isPremium/.isAgency/.color au lieu de .sub/.img — on ajoute les alias +
// les valeurs (progress/couleur) trouvées dans l'ancien Win95Portfolio.jsx,
// pour que ces fichiers puissent importer PROJECTS sans rien casser.
const PROJECT_EXTRAS = {
  1: { progress: 65, isPremium: true, color: '#0066cc' },
  2: { progress: 97, isPremium: true, color: '#006644' },
  3: { progress: 85, isPremium: true, color: '#8B0000' },
  4: { progress: 100, color: '#005580' },
  5: { progress: 100, color: '#555500' },
  6: { progress: 100, color: '#006633' },
  7: { progress: 100, color: '#660066' },
  8: { progress: 30, color: '#003366' },
  9: { progress: 100, isPremium: true, color: '#336600' },
  10: { progress: 100, isPremium: true, color: '#006699' },
  11: { progress: 100, isPremium: true, color: '#660033' },
  12: { progress: 100, isPremium: true, color: '#003355' },
  13: { progress: 100, isPremium: true, isAgency: true, color: '#002211' },
  14: { progress: 100, isPremium: true, color: '#3B006B' },
  15: { progress: 85, isPremium: true, color: '#003344' },
  16: { progress: 40, color: '#cc4400' },
  17: { progress: 100, isPremium: true, color: '#1a1a66' },
  18: { progress: 100, isPremium: true, color: '#004466' },
  19: { progress: 100, isPremium: true, color: '#7a4b1e' },
}
PROJECTS.forEach(p => {
  p.subtitle = p.sub
  p.image = p.img
  Object.assign(p, PROJECT_EXTRAS[p.id] || {})
})

// ─── Compatibilité champs PRICING_TABS ───────────────────────────
// Win95Portfolio.jsx / Appmobile.jsx attendent plan.badge et
// plan.features (liste plate) au lieu de tab.rows (tableau comparatif).
// On dérive badge/features automatiquement à partir de rows, pour ne pas
// avoir à maintenir 2 formats à la main. Le libellé généré est un peu
// moins soigné que les listes écrites à la main à l'origine (ex :
// "Nombre de pages: 5 pages" au lieu de juste "5 pages") mais reste
// exact et se met à jour automatiquement avec les prix/tableaux.
PRICING_TABS.forEach(tab => {
  tab.plans.forEach((plan, i) => {
    if (!plan.badge) plan.badge = (plan.title || '').toUpperCase()
    if (!plan.features) {
      plan.features = (tab.rows || [])
        .map(row => {
          const cell = row.cells[i]
          if (cell === true) return row.label
          if (cell === false || cell == null) return null
          return `${row.label} : ${cell}`
        })
        .filter(Boolean)
    }
  })
})

// ─── Services ────────────────────────────────────────────────────
// Aligné sur data.js (SERVICES, site AKATech, 2026-09-16) : mêmes 6 offres, même
// ordre. « API & Backend » n'y figure plus (retiré du catalogue) ; IA Chatbot et
// Paiement en ligne y sont ajoutés. Champs propres au portfolio : `sub`, `icon`
// (clé de LI_ICONS dans Appmobile.jsx — une clé inconnue n'affiche rien), `desc`
// condensée (cartes : 3 lignes max) et 3 features (les 3 premières de data.js ;
// liste limitée à ~78 px). `img` : uniquement des visuels déjà présents dans
// cloudinaryVersions.js — ceux de data.js pour l'IA et le paiement n'y sont pas
// (aucun des 3 portfolios ne lit service.img aujourd'hui).
export const SERVICES = [
  {
    n: '01', icon: 'globe', title: 'Conception de Site Web',
    sub: 'Votre présence en ligne professionnelle',
    desc: 'Création de sites web modernes, responsive et optimisés pour convertir vos visiteurs en clients.',
    img: cld('/assets/images/service/creation de site web.webp'),
    features: ['Design sur-mesure', 'SEO optimisé', 'Formulaire de contact'],
  },
  {
    n: '02', icon: 'chart-bar', title: 'Cartes Interactives & Dashboards',
    sub: 'Cartes Mapbox et visualisation de données',
    desc: 'Intégration de cartes interactives Mapbox / Leaflet et de dashboards de visualisation de données.',
    img: cld('/assets/images/service/dasbord.webp'),
    features: ['Cartes Mapbox / Leaflet', 'Dashboards data temps réel', 'Filtres et exports'],
  },
  {
    n: '03', icon: 'tools', title: 'Maintenance & Support',
    sub: 'Votre projet performant, sécurisé et à jour',
    desc: 'Suivi technique, corrections de bugs, mises à jour de sécurité et améliorations continues.',
    img: cld('/assets/images/service/maintenence.webp'),
    features: ['Mises à jour régulières', 'Corrections de bugs', 'Sauvegardes automatiques'],
  },
  {
    n: '04', icon: 'map-marked-alt', title: 'Fiche Google My Business',
    sub: 'Soyez visible sur Google Maps et la recherche locale',
    desc: 'Création ou optimisation de votre fiche Google et suivi mensuel : avis, publications et statistiques.',
    img: cld('/assets/images/service/fiche-google.webp'),
    features: ['Création ou optimisation', 'SEO local (NAP)', 'Photos & description'],
  },
  {
    n: '05', icon: 'comment-dots', title: 'Intégration IA Chatbot',
    sub: 'Un assistant qui guide vos visiteurs 24h/24',
    desc: 'Un chatbot conversationnel intégré à votre site pour interagir avec vos visiteurs et les guider.',
    features: ['Assistant conversationnel sur-mesure', 'Qualification automatique des visiteurs', 'Réponses sur vos services et tarifs'],
  },
  {
    n: '06', icon: 'credit-card', title: 'Intégration de Paiement en Ligne',
    sub: 'Encaissez en ligne sans friction',
    desc: 'Intégration de paiement sur votre site : Mobile Money (Orange Money, MTN MoMo, Wave) et carte bancaire.',
    features: ['Orange Money / MTN MoMo / Wave', 'Carte bancaire (selon besoin)', 'Suivi des transactions'],
  },
]

// Version « carte » (board desktop, App2mobile) : mêmes champs sans icon/img,
// dérivée de SERVICES pour ne maintenir qu'une seule liste.
export const SERVICES_MOBILE_COPY = SERVICES.map(({ n, title, sub, desc, features }) => ({ n, title, sub, desc, features }))

// ─── Process ─────────────────────────────────────────────────────
// Les 6 étapes du contrat de prestation AKATech (data.js PROCESS_STEPS, source
// canonique : texte repris tel quel, à la voix « nous »). Auparavant 7 étapes
// (« Solde payé » et « Mise en ligne & Support » sont fusionnées en « Livraison
// & suivi »). `tag`, `img` et `imgAlt` sont propres au portfolio : les images sont
// celles déjà sur Cloudinary (les process_akatech_* de data.js n'y existent pas).
export const PROCESS_STEPS = [
  { n: '01', title: 'Brief & découverte', tag: '1 à 2 jours', desc: 'Nous échangeons sur votre projet, vos objectifs et vos besoins. Premier échange gratuit et sans engagement.', img: cld('/assets/images/process/prise de contact.webp'), imgAlt: 'Brief et découverte' },
  { n: '02', title: 'Devis & contrat', tag: '1 jour', desc: 'Nous définissons le périmètre, le prix et le délai, puis validons le projet ensemble.', img: cld('/assets/images/process/devis et condition.webp'), imgAlt: 'Devis et contrat' },
  { n: '03', title: 'Acompte & contenus', tag: 'Feu vert', desc: "Vous versez 50 % d'acompte et transmettez les éléments nécessaires (logo, informations, visuels...). Le délai démarre lorsque l'acompte et les contenus sont reçus.", img: cld('/assets/images/process/acompte.webp'), imgAlt: 'Acompte et contenus' },
  { n: '04', title: 'Conception & développement', tag: 'Délai annoncé', desc: 'Nous concevons et développons votre projet conformément au devis.', img: cld('/assets/images/process/creation du site.webp'), imgAlt: 'Conception et développement' },
  { n: '05', title: 'Prévisualisation & validation', tag: '1 à 2 jours', desc: 'Vous recevez un lien de prévisualisation, testez le projet, et nous effectuons les corrections mineures incluses.', img: cld('/assets/images/process/livraison.webp'), imgAlt: 'Prévisualisation et validation' },
  { n: '06', title: 'Livraison & suivi', tag: 'Projet livré', desc: 'Après paiement du solde, le projet est mis en ligne et les accès sont transmis. La période de garantie/support commence ensuite.', img: cld('/assets/images/process/mise en ligne.webp'), imgAlt: 'Livraison et suivi' },
]

// Version App.jsx : 14 questions orientées process de commande.
// Win95Portfolio.jsx n'a que 5 questions génériques et mentionne
// encore un prix de départ à 60 000 FCFA (obsolète) — à remplacer
// par cette version lors de la migration Win95.
// ─── FAQ ────────────────────────────────────────────────────────
export const FAQ_ITEMS = [
  { q: 'Comment se déroule le paiement de mon site ?', a: "Le paiement se fait en deux fois : 50% à la commande pour démarrer le projet, et les 50% restants à la livraison, juste avant de recevoir les fichiers finaux et les accès." },
  { q: 'Quel est le délai pour recevoir mon site ?', a: "Cela dépend du pack choisi : 3 à 5 jours pour un portfolio simple, davantage pour une vitrine, une boutique e-commerce ou une application plus complexe. Le délai exact est précisé dans le devis et démarre dès réception de l'acompte et de vos contenus." },
  { q: "Puis-je voir mon site avant qu'il soit en ligne ?", a: "Oui, toujours. Vous recevez un lien de prévisualisation pour tester le site, faire vos retours et demander des ajustements avant la mise en ligne officielle." },
  { q: "Le nom de domaine et l'hébergement sont-ils vraiment gratuits ?", a: "Oui, la première année est offerte sur tous les packs. Après cette période, vous payez simplement le renouvellement — environ 15 000 à 30 000 FCFA par an selon le domaine — et je vous envoie un rappel avant l'expiration." },
  { q: 'Quels contenus dois-je fournir ?', a: "Votre logo, vos photos, vos textes de présentation et vos informations de contact. Plus ces éléments arrivent vite, plus le développement avance rapidement." },
  { q: 'Qui gère mon site après la livraison ?', a: "Vous. Je vous transmets tous les accès — administration, hébergement, nom de domaine — ainsi qu'un tutoriel simple pour modifier vos textes et images sans dépendre de moi." },
]

// ─── BLOG / LinkedIn ──────────────────────────────────────────
// 3 posts LinkedIn parmi les plus engageants, mis en avant tels
// quels sur le portfolio. Pour tout le reste : renvoi vers le
// profil LinkedIn complet (CONTACT.linkedin) plutôt que de dupliquer
// chaque post ici — évite le contenu dupliqué (SEO) et évite de
// devoir revenir modifier ce fichier à chaque nouveau post.
export const WRITING_POSTS = [
  {
    id: 1,
    tag: 'Opinion',
    hook: "Le vibe coding dérange certaines personnes parce qu'il touche à leur ego.",
    excerpt: "À une époque, un compilateur, puis un framework, étaient aussi mal vus. Chaque nouvelle abstraction suscite de la méfiance avant d'être adoptée — ce qui compte, c'est la valeur qu'on crée avec l'outil, pas l'outil lui-même.",
    url: 'https://www.linkedin.com/posts/m-bollo-aka_pour-dire-vrai-le-vibe-coding-d%C3%A9range-certaines-activity-7479806249555968000-wJWL',
  },
  {
    id: 2,
    tag: "Retour d'expérience",
    hook: "Mes erreurs d'avant 😭",
    excerpt: "Variables inutilisées, console.log oubliés, secrets en dur, any partout... Le rôle d'un senior n'est pas de se moquer, mais d'expliquer pourquoi c'est dangereux et comment progresser vers du code plus propre et plus sûr.",
    url: 'https://www.linkedin.com/posts/m-bollo-aka_mes-erreurs-davant-le-premier-pull-activity-7479465548054142976-3pog',
  },
  {
    id: 3,
    tag: 'Opinion',
    hook: "Le plus grand cimetière de projets se trouve dans l'esprit des développeurs.",
    excerpt: "La toute première page Facebook ne paierait probablement même pas un designer aujourd'hui — elle est pourtant devenue une des plus grandes plateformes au monde. Mieux vaut lancer une version imparfaite que garder une idée parfaite bloquée dans sa tête.",
    url: 'https://www.linkedin.com/posts/m-bollo-aka_cette-ancienne-page-facebook-ne-paierait-activity-7474370460831580161-0ypl',
  },
  {
    id: 4,
    tag: 'Opinion',
    hook: "Copier du code ≠ comprendre un système.",
    excerpt: "Générer une UI, une API, une app entière avec l'IA, c'est facile — le vrai test arrive quand ça casse en production à 3h du matin. Le vibe coding donne de la vitesse, mais seule la compréhension donne le contrôle.",
    url: 'https://www.linkedin.com/posts/m-bollo-aka_le-plus-gros-mensonge-quon-a-vendu-aux-d%C3%A9veloppeurs-activity-7460711653911842816-TFlf',
  },
  {
    id: 5,
    tag: 'Sécurité',
    hook: "Le frontend affiche. Le backend autorise.",
    excerpt: "Cacher \"ADMIN\" dans un select frontend ne protège rien : si le backend ne vérifie pas les permissions, n'importe qui peut se construire un rôle avec Postman. La sécurité d'une app ne vit jamais dans l'UI.",
    url: 'https://www.linkedin.com/posts/m-bollo-aka_les-vibes-vont-d%C3%A9truire-ce-monde-activity-7458516630524850177-TEB1',
  },
  {
    id: 6,
    tag: 'Opinion',
    hook: 'Un outil ne dépassera jamais une compétence technique.',
    excerpt: "L'IA est puissante, mais entre les mains de quelqu'un qui ne comprend pas le code, ça reste du copier-coller. Refaire mon site de Vite/React à Next.js avec l'IA me l'a confirmé : la différence, ce sont les choix techniques, pas l'outil.",
    url: 'https://www.linkedin.com/posts/m-bollo-aka_faut-arr%C3%AAter-de-confondre-les-choses-un-activity-7450893414918746112-bWWb',
  },
]

// ─── AKATECH V2 — nav, méthode, philosophie, bac à sable ─────────
// Propre au nouveau mode akatech (src/akatech/) : pas consommé par
// App.jsx / Appmobile.jsx / Win95Portfolio.jsx, ajouté sans toucher
// à un seul export existant ci-dessus.
export const NAV_LINKS = [
  { id: 'home', label: 'Accueil', num: '00', sub: "M'Bollo Aka" },
  { id: 'story', label: 'Mon histoire', num: '01', sub: 'Pourquoi autodidacte' },
  { id: 'method', label: 'Ma méthode', num: '02', sub: 'Comment je travaille' },
  { id: 'projects', label: 'Projets', num: '03', sub: `${PROJECTS.length} réalisations` },

  { id: 'sandbox', label: 'Bac à sable', num: '04', sub: 'Expérimentations' },
  { id: 'services', label: 'Services', num: '05', sub: 'Prestations & tarifs' },
  { id: 'contact', label: 'Contact', num: '06', sub: 'Discutons' },
]

export const METHOD_STEPS = [
  { num: '01', title: 'Une frustration', desc: "Je note une idée, un problème, une remarque d'un client, une opportunité." },
  { num: '02', title: 'Je cherche', desc: "ChatGPT, Perplexity, Kimi. Je ne cherche pas une réponse, je cherche plusieurs points de vue." },
  { num: '03', title: 'Je décide', desc: "L'IA propose. Moi je décide. Choix techniques, architecture, UX, animation, business." },
  { num: '04', title: 'Claude devient mon développeur', desc: "AKATech Skills : un système de prompts organisés (Backend, Frontend, Design) — comme une équipe." },
  { num: '05', title: 'Je livre vite', desc: "Une V1 imparfaite en ligne vaut mieux qu'une V1 parfaite qui n'existe pas." },
  { num: '06', title: 'Les utilisateurs décident', desc: "Je pensais… Les utilisateurs ont fait… J'ai changé. Le produit évolue avec les retours." },
  { num: '07', title: 'Le laboratoire', desc: "Tous mes composants commencent ici. Une animation, un shader, un prototype. Si ça marche, ça rejoint un projet réel." },
]

// Chapitre 06 : apostrophe dans "qu'il" corrigée en guillemets doubles
// (l'original en quotes simples cassait la string JS — 'qu'il' se
// referme après "qu", laissant "il fallait..." comme code invalide).
export const PHILOSOPHY_CHAPTERS = [
  { num: '01', before: 'Je pensais que coder vite était le plus important.', after: "Comprendre le problème est plus important que commencer à coder. Aujourd'hui je peux passer des heures sans écrire une ligne." },
  { num: '02', before: "Je pensais qu'un beau site suffisait.", after: "Un beau site qui ne convertit personne est un échec. Je regarde le temps passé, le taux de clic, le parcours utilisateur." },
  { num: '03', before: "Je pensais qu'utiliser l'IA faisait de moi un moins bon développeur.", after: "Je ne demande plus à une IA de réfléchir à ma place. Je lui demande d'exécuter plus vite mes idées." },
  { num: '04', before: 'Je pensais que finir un projet était la priorité.', after: "Je préfère sortir une V1, observer, écouter, puis construire une V2. Les utilisateurs trouvent les problèmes que je n'avais pas imaginés." },
  { num: '05', before: 'Je pensais que plus un projet était complexe, meilleur il était.', after: "La simplicité est beaucoup plus difficile. Supprimer une fonctionnalité est parfois plus intelligent que d'en ajouter." },
  { num: '06', before: "Je pensais qu'il fallait maîtriser toutes les technologies.", after: "Je préfère maîtriser une façon de résoudre les problèmes. Les frameworks changent. La logique reste." },
  { num: '07', before: 'Je pensais que mon portfolio devait montrer ce que je sais.', after: "Je préfère montrer comment je réfléchis. Parce que React s'apprend. La façon de penser, beaucoup moins." },
]

export const SANDBOX_ITEMS = [
  { title: 'Mouse Trail', type: 'Prototype', status: 'Actif' },
  { title: 'Liquid Cursor', type: 'Open Source', status: 'Actif' },
  { title: 'Glass Morph', type: 'Prototype', status: 'En test' },
  { title: 'Infinite Gallery', type: 'Open Source', status: 'Actif' },
  { title: '3D Cards', type: 'Expérience', status: 'En test' },
  { title: 'AI Chat', type: 'Abandonné', status: 'Archivé' },
]