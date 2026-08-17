'use client'

import { useEffect } from 'react'
import { gsap } from './gsapSetup'

/**
 * Anime en fondu-décalé les enfants (ou les éléments matching
 * `selector`) d'un conteneur quand il entre dans le viewport.
 * gsap.context() + revert() au nettoyage : sûr à appeler dans
 * plusieurs composants sans qu'ils se marchent dessus.
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 * @param {string} [selector] - sous-sélecteur ; sinon, anime les enfants directs
 * @param {{ y?: number, scale?: number, duration?: number, stagger?: number, start?: string }} [opts]
 */
export function useScrollReveal(ref, selector, opts) {
  const o = opts || {}
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const targets = selector ? el.querySelectorAll(selector) : el.children
    if (!targets || targets.length === 0) return undefined

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        opacity: 0,
        y: o.y ?? 28,
        scale: o.scale,
        duration: o.duration ?? 0.7,
        stagger: o.stagger ?? 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: o.start ?? 'top 85%' },
      })
    }, ref)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
