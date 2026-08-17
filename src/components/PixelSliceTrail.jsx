import { useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import './PixelSliceTrail.css'

const CLIPS = {
  NO_CLIP: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  BOTTOM_RIGHT: 'polygon(0% 0%, 100% 0%, 0% 0%, 0% 100%)',
  TOP_RIGHT: 'polygon(0% 0%, 0% 100%, 100% 100%, 0% 100%)',
  BOTTOM_LEFT: 'polygon(100% 100%, 100% 0%, 100% 100%, 0% 100%)',
  TOP_LEFT: 'polygon(0% 0%, 100% 0%, 100% 100%, 100% 0%)',
}

const ENTRANCE = {
  left: [CLIPS.BOTTOM_RIGHT, CLIPS.NO_CLIP],
  bottom: [CLIPS.BOTTOM_RIGHT, CLIPS.NO_CLIP],
  top: [CLIPS.BOTTOM_RIGHT, CLIPS.NO_CLIP],
  right: [CLIPS.TOP_LEFT, CLIPS.NO_CLIP],
}

const EXIT = {
  left: [CLIPS.NO_CLIP, CLIPS.TOP_RIGHT],
  bottom: [CLIPS.NO_CLIP, CLIPS.TOP_RIGHT],
  top: [CLIPS.NO_CLIP, CLIPS.TOP_RIGHT],
  right: [CLIPS.NO_CLIP, CLIPS.BOTTOM_LEFT],
}

function nearestEdge(event, element) {
  const box = element.getBoundingClientRect()
  return [
    ['left', Math.abs(box.left - event.clientX)],
    ['right', Math.abs(box.right - event.clientX)],
    ['top', Math.abs(box.top - event.clientY)],
    ['bottom', Math.abs(box.bottom - event.clientY)],
  ].sort((a, b) => a[1] - b[1])[0][0]
}

function getLabel(item, index) {
  if (item?.name) return item.name
  const filename = (item?.icon || '').split('/').pop()?.split('.')[0]
  return (filename || `Skill ${index + 1}`).replace(/[-_]/g, ' ')
}

/**
 * Compatibilité historique : le nom est conservé pour ne pas modifier App.jsx.
 * L’ancien trail RAF est remplacé par des tuiles CSS/clip-path déclenchées
 * uniquement au survol, comme dans le HTML de référence.
 */
export default function PixelSliceTrail({ images = [], items = [], className = '' }) {
  const normalizedItems = useMemo(() => {
    if (items.length) return items
    return images.map(icon => ({ icon }))
  }, [images, items])
  const tileRefs = useRef([])

  const animateOverlay = (event, index, entering) => {
    const tile = tileRefs.current[index]
    const overlay = tile?.querySelector('.skill-hover-overlay')
    if (!tile || !overlay) return
    const edge = nearestEdge(event, tile)
    const [from, to] = (entering ? ENTRANCE : EXIT)[edge]
    gsap.fromTo(overlay, { clipPath: from }, {
      clipPath: to,
      duration: 0.28,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  return (
    <div className={`skill-hover-grid ${className}`} role="list" aria-label="Compétences techniques">
      {normalizedItems.map((item, index) => {
        const label = getLabel(item, index)
        return (
          <div
            key={`${label}-${index}`}
            ref={element => { tileRefs.current[index] = element }}
            className="skill-hover-tile"
            role="listitem"
            onPointerEnter={event => animateOverlay(event, index, true)}
            onPointerLeave={event => animateOverlay(event, index, false)}
          >
            <img src={item.icon} alt="" loading="lazy" draggable="false" />
            <span>{label}</span>
            <div className="skill-hover-overlay" aria-hidden="true">
              <img src={item.icon} alt="" loading="lazy" draggable="false" />
              <span>{label}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
