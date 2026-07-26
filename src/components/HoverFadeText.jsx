import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

/* HOVER FADE X — reprise du variant "06. V-FADE-X / Smooth X Fade"
   de PROOOtypography-hover-12-variants.html : au survol, le texte
   glisse+s'efface vers la droite pendant qu'une copie identique
   glisse+apparaît depuis la gauche, décalée lettre par lettre.
   Timeline GSAP suspendue, play au mouseenter / reverse au
   mouseleave — mécanique identique à la démo (pas d'autoplay).
   Les deux couches sont superposées via CSS grid (comme
   .hover-text-wrap/.word dans la démo). Police --fs-retro
   (Silkscreen) comme les grands titres de section.
   Texte dupliqué à l'identique (pas de swap vers un autre mot) :
   utilisé sur du texte d'UI réel (nav, boutons, liens), pas un
   showcase avec des paires de mots arbitraires — la 2e couche est
   aria-hidden pour ne pas doubler la lecture au lecteur d'écran.
   Fichier séparé (plutôt que défini dans App.jsx) pour pouvoir être
   importé aussi depuis DissolveTransition.jsx (et ailleurs) sans
   dépendance circulaire avec App.jsx. */
export default function HoverFadeText({ children, tag: Tag = 'span', className = '' }) {
  const wrapRef = useRef(null)
  const text = typeof children === 'string' ? children : String(children ?? '')

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !text) return
    const charsA = wrap.querySelectorAll('.hfx-a .hfx-char')
    const charsB = wrap.querySelectorAll('.hfx-b .hfx-char')
    if (!charsA.length) return

    gsap.set(charsB, { autoAlpha: 0 })

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return /* texte statique lisible, pas d'animation au survol */

    const dur = 0.35
    const stag = 0.03
    const tl = gsap.timeline({ paused: true })
    tl.to(charsA, { x: 30, autoAlpha: 0, duration: dur, stagger: stag, ease: 'power2.in' }, 0)
      .fromTo(charsB, { x: -30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: dur, stagger: stag, ease: 'power2.out' }, dur * 0.5)

    const onEnter = () => tl.play()
    const onLeave = () => tl.reverse()
    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mouseleave', onLeave)
    return () => {
      wrap.removeEventListener('mouseenter', onEnter)
      wrap.removeEventListener('mouseleave', onLeave)
      tl.kill()
    }
  }, [text])

  const chars = text.split('')
  const renderChars = (prefix) => chars.map((c, i) => (
    <span key={`${prefix}-${i}`} className="hfx-char">{c === ' ' ? '\u00A0' : c}</span>
  ))

  return (
    <Tag ref={wrapRef} className={`hfx-wrap ${className}`}>
      <span className="hfx-a hfx-word">{renderChars('a')}</span>
      <span className="hfx-b hfx-word" aria-hidden="true">{renderChars('b')}</span>
    </Tag>
  )
}
