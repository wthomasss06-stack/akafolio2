'use client'

import { useEffect, useState } from 'react'
import LuxuryAction, { CyclicText, getAkatechCycle } from './LuxuryAction'

// Repris tel quel de src/components/ProjectDetailModal.jsx (mode
// App.jsx) — mapping mot-clé → icône, rien de propre à ce mode-là,
// dupliqué ici pour garder akatech totalement autonome plutôt que
// d'importer un composant d'un autre mode.
const TECH_ICON_RULES = [
  ['next.js', '/assets/icons/devicon/nextjs/nextjs-original.svg'],
  ['nodejs', '/assets/icons/devicon/nodejs/nodejs-original.svg'],
  ['node.js', '/assets/icons/devicon/nodejs/nodejs-original.svg'],
  ['express', '/assets/icons/devicon/express/express-original.svg'],
  ['chart.js', '/assets/icons/devicon/chartjs/chartjs-original.svg'],
  ['django rest', '/assets/icons/devicon/django/django-plain.svg'],
  ['django', '/assets/icons/devicon/django/django-plain.svg'],
  ['flask', '/assets/icons/devicon/flask/flask-original.svg'],
  ['python', '/assets/icons/devicon/python/python-original.svg'],
  ['postgresql', '/assets/icons/devicon/postgresql/postgresql-original.svg'],
  ['mysql', '/assets/icons/devicon/mysql/mysql-original.svg'],
  ['redis', '/assets/icons/devicon/redis/redis-original.svg'],
  ['react router', '/assets/icons/devicon/reactrouter/reactrouter-original.svg'],
  ['tailwind', '/assets/icons/devicon/tailwindcss/tailwindcss-original.svg'],
  ['bootstrap', '/assets/icons/devicon/bootstrap/bootstrap-original.svg'],
  ['bulma', '/assets/icons/devicon/bulma/bulma-plain.svg'],
  ['framer motion', '/assets/icons/devicon/framermotion/framermotion-original.svg'],
  ['vite', '/assets/icons/devicon/vitejs/vitejs-original.svg'],
  ['react', '/assets/icons/devicon/react/react-original.svg'],
  ['vercel', '/assets/icons/devicon/vercel/vercel-original.svg'],
  ['github', '/assets/icons/devicon/github/github-original.svg'],
  ['prisma', '/assets/icons/devicon/prisma/prisma-original.svg'],
  ['html', '/assets/icons/devicon/html5/html5-original.svg'],
  ['css', '/assets/icons/devicon/css3/css3-original.svg'],
  ['javascript', '/assets/icons/devicon/javascript/javascript-original.svg'],
  ['git', '/assets/icons/devicon/git/git-original.svg'],
  ['cloudinary', '/assets/icons/simple-icons/cloudinary.svg'],
  ['gsap', '/assets/icons/simple-icons/gsap.svg'],
  ['leaflet', '/assets/icons/simple-icons/leaflet.svg'],
  ['webgl', '/assets/icons/simple-icons/webgl.svg'],
  ['camera api', '/assets/icons/custom/camera-api.svg'],
  ['canvas api', '/assets/icons/custom/canvas-api.svg'],
  ['emailjs', '/assets/icons/custom/emailjs.svg'],
  ['geolocation', '/assets/icons/custom/geolocation-api.svg'],
  ['howler', '/assets/icons/custom/howlerjs.svg'],
  ['localstorage', '/assets/icons/custom/localstorage.svg'],
  ['osrm', '/assets/icons/custom/osrm-api.svg'],
  ['websocket', '/assets/icons/custom/websockets.svg'],
]

function resolveTechIcon(label) {
  const low = label.toLowerCase()
  const rule = TECH_ICON_RULES.find(([key]) => low.includes(key))
  return rule ? rule[1] : null
}

/**
 * Panneau détail projet, glisse depuis la droite (demandé) plutôt que
 * la modale centrée + flip 3D de ProjectDetailModal.jsx — même
 * contenu (image, meta, tags tech avec icônes, description, liens,
 * cas d'étude problème/solution/résultat), mais le cas d'étude
 * s'ouvre en accordéon dans le panneau plutôt qu'au dos d'une carte
 * qui se retourne : plus robuste combiné à une translation latérale.
 *
 * @param {{ project: object|null, open: boolean, onClose: () => void }} props
 */
export default function ProjectDetailPanel({ project, open, onClose }) {
  const [caseOpen, setCaseOpen] = useState(false)
  // Ne reflète un nouveau projet que quand on OUVRE — jamais quand
  // `project` repasse à null à la fermeture (Projects.jsx vide son
  // state activeProject dans le même rendu où `open` passe à false).
  // Sans ça, le contenu entier disparaissait instantanément pendant
  // que le panneau glissait encore hors de l'écran sur 0.5s : un
  // panneau vide qui coulisse, plutôt que son contenu qui part avec
  // lui — le "problème profond" du dernier retour.
  const [displayed, setDisplayed] = useState(project)

  useEffect(() => {
    if (project) setDisplayed(project)
  }, [project])

  useEffect(() => {
    if (open) setCaseOpen(false)
  }, [displayed, open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [open, onClose])

  const hasCaseStudy = Boolean(displayed && (displayed.problem || displayed.solution || displayed.result))

  return (
    <>
      <div
        className={`akatech-detail-backdrop${open ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      />
      <aside className={`akatech-detail-panel${open ? ' is-open' : ''}`} aria-hidden={!open}>
        {displayed && (
          <>
            <div className="akatech-detail-close">
              <button type="button" onClick={onClose} aria-label="Fermer">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <img className="akatech-detail-img" src={displayed.img} alt={displayed.title} />

            <div className="akatech-detail-body">
              <span className="akatech-detail-cat mono">
                {displayed.cat?.toUpperCase()} · {displayed.year}
              </span>
              <h3 className="akatech-detail-title">{displayed.title}</h3>
              <p className="akatech-detail-sub">{displayed.sub}</p>

              {Array.isArray(displayed.tech) && displayed.tech.length > 0 && (
                <div className="akatech-detail-tags">
                  {displayed.tech.map((t) => {
                    const icon = resolveTechIcon(t)
                    return (
                      <span key={t}>
                        {icon && (
                          <img src={icon} alt="" width="12" height="12" style={{ verticalAlign: '-2px', marginRight: 4 }} />
                        )}
                        {t}
                      </span>
                    )
                  })}
                </div>
              )}

              <p className="akatech-detail-desc">{displayed.desc}</p>

              <div className="akatech-detail-actions">
                {displayed.url && displayed.url !== '#' && (
                  <LuxuryAction as="a" label="Voir le projet" href={displayed.url} target="_blank" rel="noreferrer" />
                )}
                {displayed.github && (
                  <LuxuryAction as="a" label="GitHub" href={displayed.github} target="_blank" rel="noreferrer" />
                )}
                {displayed.private && !displayed.github && (
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--muted)', alignSelf: 'center' }}>
                    Code privé (client)
                  </span>
                )}
              </div>

              {hasCaseStudy && (
                <div className="akatech-detail-case">
                  <button
                    type="button"
                    className="akatech-detail-case-toggle"
                    aria-expanded={caseOpen}
                    onClick={() => setCaseOpen((v) => !v)}
                  >
                    <CyclicText text="Voir le cas d’étude" cycle={getAkatechCycle('Voir le cas d’étude')} triggerParent />
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {caseOpen && (
                    <div>
                      {displayed.problem && (
                        <div className="akatech-detail-case-block">
                          <span>PROBLÈME</span>
                          <p>{displayed.problem}</p>
                        </div>
                      )}
                      {displayed.solution && (
                        <div className="akatech-detail-case-block">
                          <span>SOLUTION</span>
                          <p>{displayed.solution}</p>
                        </div>
                      )}
                      {displayed.result && (
                        <div className="akatech-detail-case-block">
                          <span>RÉSULTAT</span>
                          <p>{displayed.result}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  )
}
