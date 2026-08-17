// Simplifié sur demande ("retire tout le maximalisme, très minimaliste") :
// n'enveloppe plus le contenu dans le halo + quadrillage décoratifs
// (voir git history si besoin de les retrouver). Garde juste le
// composant en place pour ne pas devoir toucher les 5 pages qui
// l'importent encore.
export default function PageShell({ children, className = '' }) {
  return <div className={className.trim() || undefined}>{children}</div>
}
