# Migration Cloudinary durable

Le portfolio utilise `src/data/portfolioData.js` comme source centrale pour les trois variantes : desktop, mobile et Win95.

## Fonctionnement après le correctif

Le script `scripts/upload-cloudinary.cjs` est maintenant réexécutable. À chaque lancement, il parcourt `public/assets/images`, réutilise le même `public_id` Cloudinary pour chaque fichier et envoie :

- `overwrite=true` pour remplacer le média existant ;
- `invalidate=true` pour demander l’invalidation de l’ancien cache CDN ;
- la version retournée par Cloudinary dans `src/data/cloudinaryVersions.js`.

Le helper `src/lib/cloudinary.js` lit automatiquement ce registre. Il n’est donc plus nécessaire de modifier manuellement les trois portfolios ou d’écrire une version différente dans chaque projet. Les trois variantes restent branchées sur le même `PROJECTS` central.

Koko Eat utilise désormais :

```js
img: cld('/assets/images/projects/kokoeat-preview.webp'),
hoverVideo: cld('/assets/images/projects/kokoeat-preview.webm'),
```

Les versions sont résolues automatiquement depuis `cloudinaryVersions.js`.

## Commande normale après chaque changement de média

```bash
node scripts/upload-cloudinary.cjs
npm run build
git add src/data/portfolioData.js src/data/cloudinaryVersions.js src/lib/cloudinary.js scripts/upload-cloudinary.cjs src/App.jsx src/components/ProjectsTunnel.jsx
git commit -m "chore: synchroniser les médias Cloudinary"
git push origin main
```

Le script réécrit les assets existants à chaque lancement, même si leur nom n’a pas changé. Il conserve l’ancienne version dans le registre lorsqu’un fichier échoue, afin de ne pas casser une référence déjà fonctionnelle, et retourne un code d’erreur si au moins un upload échoue.

## Simulation sans upload

Avant une migration réelle, tu peux vérifier les fichiers détectés sans contacter Cloudinary :

```bash
CLOUDINARY_CLOUD_NAME=test \
CLOUDINARY_API_KEY=test \
CLOUDINARY_API_SECRET=test \
node scripts/upload-cloudinary.cjs --dry-run
```

Si les assets ne se trouvent pas dans `public/assets/images`, indique leur dossier avec `CLOUDINARY_SOURCE_DIR` :

```bash
CLOUDINARY_SOURCE_DIR="C:/chemin/vers/public/assets/images" node scripts/upload-cloudinary.cjs
```

Le dossier Cloudinary peut aussi être personnalisé avec `CLOUDINARY_BASE_FOLDER`, mais il faut alors utiliser la même valeur côté frontend via `NEXT_PUBLIC_CLOUDINARY_BASE_FOLDER`.

## Vérifications effectuées

Le script passe `node --check scripts/upload-cloudinary.cjs`. Le dry-run a détecté les fichiers WebP et WebM sans effectuer d’upload. Le build de production passe avec `npm run build`, et les URL versionnées de Koko Eat sont générées correctement.
