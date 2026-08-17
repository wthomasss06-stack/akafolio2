'use client'

import { useEffect } from 'react'
import { gsap } from './gsapSetup'

/**
 * Fait suivre un "projecteur" (variables CSS --mx/--my, en % du
 * conteneur) au curseur, pour faire vivre un fond en grille dont le
 * mask-image lit ces variables (voir .akatech-page-shell__grid-spot
 * et .akatech-hero-grid dans AKATECH.css). Les variables sont écrites
 * comme des nombres bruts (0–100) ; c'est le CSS qui les convertit en
 * pourcentage via calc(var(--mx, 50) * 1%), pour ne pas dépendre de la
 * gestion d'unité de GSAP sur les propriétés custom.
 *
 * No-op sur tactile / sans souris fine, et si l'utilisateur préfère
 * moins de mouvement — le fond garde alors sa position par défaut
 * (centrée, via le fallback `50` dans le calc() ci-dessus).
 *
 * @param {import('react').RefObject<HTMLElement>} ref
 */
export default function useGridSpotlight(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return undefined
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const setX = gsap.quickTo(el, '--mx', { duration: 0.6, ease: 'power2.out' })
    const setY = gsap.quickTo(el, '--my', { duration: 0.6, ease: 'power2.out' })

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      setX(((e.clientX - rect.left) / rect.width) * 100)
      setY(((e.clientY - rect.top) / rect.height) * 100)
    }
    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [ref])
}
