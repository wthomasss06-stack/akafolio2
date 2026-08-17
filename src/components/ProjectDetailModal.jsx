'use client'

import { useMemo, useState } from 'react'
import HoverFadeText from './HoverFadeText.jsx'

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

function TechTag({ label }) {
  const iconSrc = useMemo(() => resolveTechIcon(label), [label])
  const [broken, setBroken] = useState(false)

  if (!iconSrc || broken) {
    return <span className="fc-tag">{label}</span>
  }

  return (
    <span className="fc-tag fc-tag--icon" title={label}>
      <img src={iconSrc} alt={label} loading="lazy" onError={() => setBroken(true)} />
    </span>
  )
}

const AnimIcon = ({ type, size = 15, color = 'currentColor', className = '' }) => {
  const icons = {
    globe: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" className={`anim-icon ${className}`}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    github: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={`anim-icon ${className}`}>
        <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.17.69-3.84-1.36-3.84-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.67 5.34-5.21 5.62.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55 4.52-1.51 7.77-5.77 7.77-10.79C23.02 5.24 18.27.5 12 .5z" />
      </svg>
    ),
    lock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`anim-icon ${className}`}>
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    flip: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`anim-icon ${className}`}>
        <path d="M17 2.1l4 4-4 4" />
        <path d="M3 12.6v-2a4 4 0 0 1 4-4h14" />
        <path d="M7 21.9l-4-4 4-4" />
        <path d="M21 11.4v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  }
  return icons[type] || null
}

function ProjectDetailModal({ project, caseFlipped, onFlip, onClose }) {
  if (!project) return null
  return (
    <div className="tunnel-modal-backdrop" onClick={onClose}>
      <div className="tunnel-modal" onClick={e => e.stopPropagation()}>
        <button type="button" className="tunnel-modal-close" onClick={onClose} aria-label="Fermer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>

        <div className="tunnel-modal-image">
          <img src={project.img} alt={project.title} loading="lazy" />
        </div>

        <div className="tunnel-modal-info">
          <div className={`fc-flip${caseFlipped ? ' is-flipped' : ''}`}>
            <div className="fc-flip-inner">

              <div className="fc-flip-face fc-flip-face--front">
                <h3 className="fc-name">{project.title}</h3>
                <h3 className="fc-sub">{project.sub}</h3>
                <div className="fc-meta">
                  <div className="fc-meta-row"><span className="fc-ml">Marché</span><span className="fc-mv">Côte d'Ivoire</span></div>
                  <div className="fc-meta-row"><span className="fc-ml">Rôle</span><span className="fc-mv">Conception & Développement</span></div>
                  <div className="fc-meta-row"><span className="fc-ml">Année</span><span className="fc-mv">{project.year}</span></div>
                </div>
                <div className="fc-tags">
                  {project.tech.map(t => <TechTag key={t} label={t} />)}
                </div>
                <h3 className="fc-desc">{project.desc}</h3>
                <div className="fc-actions">
                  <a
                    href={project.url && project.url !== '#' ? project.url : '#'}
                    target="_blank"
                    rel="noreferrer"
                    className={`fc-cta ${(!project.url || project.url === '#') ? 'fc-cta--disabled' : ''}`}
                    onClick={e => { if (!project.url || project.url === '#') e.preventDefault() }}
                  >
                    <AnimIcon type="globe" size={15} color="currentColor" /> <HoverFadeText>Voir le projet</HoverFadeText>
                    <span className="btn-arr" aria-hidden="true">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                      </svg>
                    </span>
                  </a>
                  {project.github ? (
                    <a href={project.github} target="_blank" rel="noreferrer" className="fc-cta-ghost">
                      <AnimIcon type="github" size={15} color="currentColor" /> <HoverFadeText>Code source</HoverFadeText>
                    </a>
                  ) : (
                    <span className="fc-cta-private">
                      <AnimIcon type="lock" size={12} color="currentColor" /> <HoverFadeText>Code privé</HoverFadeText>
                    </span>
                  )}
                </div>
                {(project.problem || project.result) && (
                  <button type="button" className="fc-flip-btn" onClick={() => onFlip(true)}>
                    <AnimIcon type="flip" size={14} color="currentColor" /> Détails du projet
                  </button>
                )}
              </div>

              <div className="fc-flip-face fc-flip-face--back">
                <h3 className="fc-sub fc-case-label">Cas d'étude</h3>
                <div className="fc-case">
                  <div className="fc-case-block">
                    <span className="fc-case-tag">Problème</span>
                    <p>{project.problem}</p>
                  </div>
                  <div className="fc-case-block">
                    <span className="fc-case-tag">Solution</span>
                    <p>{project.solution}</p>
                  </div>
                  <div className="fc-case-block fc-case-block--result">
                    <span className="fc-case-tag">Résultat</span>
                    <p>{project.result}</p>
                  </div>
                </div>
                <button type="button" className="fc-flip-btn" onClick={() => onFlip(false)}>
                  <AnimIcon type="flip" size={14} color="currentColor" /> Retour au projet
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailModal
