'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsapSetup'

/**
 * En-tête de section — refonte minimaliste demandée : titre en gros,
 * numéro "/0X" aligné à droite sur la même ligne (repris de la
 * référence "CREATIVE INSPIRATION_BLOCKS /01"), plus de petit label
 * mono au-dessus ni de ligne d'accent sous le titre.
 *
 * @param {{ num: string, title: string, sub?: string, className?: string }} props
 */
export default function SectionHeading({ num, title, sub, className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.akatech-sh-title, .akatech-sh-num, .akatech-sh-sub'), {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className={`akatech-sh ${className}`.trim()}>
      <div className="akatech-sh-row">
        <h2 className="akatech-sh-title">{title}</h2>
        <span className="akatech-sh-num mono">/{num}</span>
      </div>
      {sub && <p className="akatech-sh-sub">{sub}</p>}
    </div>
  )
}
