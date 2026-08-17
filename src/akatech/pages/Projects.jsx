'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import PageEnd from '../components/PageEnd'
import ProjectDetailPanel from '../components/ProjectDetailPanel'
import LuxuryAction from '../components/LuxuryAction'
import { useScrollReveal } from '../lib/useScrollReveal'
import { PROJECTS } from '../../data/portfolioData'

// Double bande de défilement horizontal infini, sens opposés — DOM
// remplacé sur demande (le canvas 2D déplaçable précédent posait trop
// de problèmes), adapté de image2_bande.html. Chaque rangée est
// dupliquée une fois dans le JSX (ROW_A deux fois de suite, idem
// ROW_B) : wrap() peut alors boucler pile à la moitié de la largeur
// réelle sans jamais montrer la couture.
const ROW_A = PROJECTS.slice(0, 10)
const ROW_B = PROJECTS.slice(10)

function wrap(position, max) {
  return ((position % max) - max) % max
}

/**
 * @param {{ onNext: () => void, onNavigate: (id: string) => void }} props
 */
export default function Projects({ onNext, onNavigate }) {
  const sectionRef = useRef(null)
  const trackARef = useRef(null)
  const trackBRef = useRef(null)
  const headingRef = useRef(null)
  const [activeProject, setActiveProject] = useState(null)
  useScrollReveal(headingRef, null, { y: 20, stagger: 0.08, start: 'top 95%' })

  useEffect(() => {
    const section = sectionRef.current
    const trackA = trackARef.current
    const trackB = trackBRef.current
    if (!section || !trackA || !trackB) return undefined

    let posA = 0
    let posB = 0
    let rafId = null
    const BASE_SPEED = 0.7
    let direction = 1 // persiste jusqu'au prochain changement de sens à la molette
    let extraSpeed = 0 // impulsion temporaire, s'amortit

    // Molette : direction persistante + impulsion, comme la référence
    // — et surtout PAS de preventDefault (contrairement à l'ancien
    // canvas draggable) : la page continue de défiler normalement en
    // dessous jusqu'au CTA, la molette pilote juste la vitesse/le
    // sens des bandes en plus.
    function onWheel(e) {
      direction = e.deltaY < 0 ? -1 : 1
      extraSpeed += Math.abs(e.deltaY) * 0.04
    }
    section.addEventListener('wheel', onWheel, { passive: true })

    function animate() {
      extraSpeed *= 0.92
      const speed = (BASE_SPEED + extraSpeed) * direction
      posA -= speed
      posB += speed

      const halfA = trackA.scrollWidth / 2
      const halfB = trackB.scrollWidth / 2
      if (halfA > 0) trackA.style.transform = `translate3d(${wrap(posA, halfA)}px,0,0)`
      if (halfB > 0) trackB.style.transform = `translate3d(${wrap(posB, halfB)}px,0,0)`

      rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      section.removeEventListener('wheel', onWheel)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const openDetail = useCallback((project) => setActiveProject(project), [])
  const closeDetail = useCallback(() => setActiveProject(null), [])

  const renderCard = (project, dupSuffix) => (
    <div key={`${project.id}${dupSuffix}`} className="akatech-band-card">
      <img src={project.img} alt={project.title} draggable={false} loading="lazy" />
      <div className="akatech-gallery-overlay">
        <span className="akatech-gallery-name">{project.title}</span>
        <div className="akatech-gallery-actions">
          {project.url && project.url !== '#' && (
            <LuxuryAction as="a" label="Voir le projet" href={project.url} target="_blank" rel="noreferrer" />
          )}
          <LuxuryAction label="Détails" onClick={() => openDetail(project)} />
        </div>
      </div>
    </div>
  )

  return (
    <>
      <section ref={sectionRef} className="akatech-band-section">
        <div ref={headingRef} className="akatech-band-heading">
          <span className="mono">03 — CONSTRUIRE</span>
          <h2>Tous les projets</h2>
          <p className="akatech-band-hint">Molette pour accélérer / inverser le sens</p>
        </div>

        <div className="akatech-band-row">
          <div ref={trackARef} className="akatech-band-track">
            {ROW_A.map((p) => renderCard(p, '-a1'))}
            {ROW_A.map((p) => renderCard(p, '-a2'))}
          </div>
        </div>
        <div className="akatech-band-row">
          <div ref={trackBRef} className="akatech-band-track">
            {ROW_B.map((p) => renderCard(p, '-b1'))}
            {ROW_B.map((p) => renderCard(p, '-b2'))}
          </div>
        </div>
      </section>

      <ProjectDetailPanel project={activeProject} open={Boolean(activeProject)} onClose={closeDetail} />

      <PageEnd
        ctaTitle="Envie d'explorer sans contrainte client ?"
        ctaText="Le bac à sable : mes expérimentations libres, avant qu'elles ne deviennent des projets réels."
        ctaLabel="Explorer le bac à sable"
        onCta={() => onNavigate('sandbox')}
        nextLabel="Bac à sable"
        onNext={onNext}
      />
    </>
  )
}
