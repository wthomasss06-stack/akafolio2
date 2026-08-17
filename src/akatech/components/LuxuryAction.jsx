'use client'

import { createElement, useEffect, useRef } from 'react'
import { gsap } from '../lib/gsapSetup'

/** Compatibilité avec les anciens appels : le texte reste unique. */
export function getAkatechCycle(label) {
  return [label]
}

/**
 * Roll vertical inspiré de Neon Synthwave.
 * Le même libellé sort par le haut puis revient par le bas, sans changer de phrase.
 */
function rollText(element) {
  gsap.killTweensOf(element)
  gsap.to(element, {
    y: -25,
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      gsap.fromTo(
        element,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' },
      )
    },
  })
}

function bindRollAnimation(trigger, element) {
  if (!trigger || !element) return undefined

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let textTimer = null

  const start = () => {
    if (reduceMotion || textTimer) return
    rollText(element)
    textTimer = window.setInterval(() => rollText(element), 1800)
  }

  const stop = () => {
    if (textTimer) {
      window.clearInterval(textTimer)
      textTimer = null
    }
    gsap.killTweensOf(element)
    gsap.to(element, {
      y: 0,
      opacity: 1,
      duration: reduceMotion ? 0 : 0.2,
      ease: 'power2.out',
    })
  }

  trigger.addEventListener('pointerenter', start)
  trigger.addEventListener('pointerleave', stop)
  trigger.addEventListener('focusin', start)
  trigger.addEventListener('focusout', stop)

  return () => {
    if (textTimer) window.clearInterval(textTimer)
    trigger.removeEventListener('pointerenter', start)
    trigger.removeEventListener('pointerleave', stop)
    trigger.removeEventListener('focusin', start)
    trigger.removeEventListener('focusout', stop)
    gsap.killTweensOf(element)
  }
}

export default function LuxuryAction({
  as = 'button',
  label,
  className = '',
  children,
  ...props
}) {
  const actionRef = useRef(null)
  const textRef = useRef(null)
  const text = label ?? (typeof children === 'string' ? children : '')

  useEffect(() => {
    const action = actionRef.current
    const textElement = textRef.current
    if (!action || !textElement) return undefined

    const arrowWrapper = action.querySelector('.akatech-action-arrow-wrap')
    const arrowCircle = action.querySelector('.akatech-action-arrow')
    const arrowSvg = action.querySelector('.akatech-action-arrow svg')
    if (!arrowWrapper || !arrowCircle || !arrowSvg) return undefined

    const arrowTimeline = gsap.timeline({ paused: true })
      .to(arrowWrapper, { width: '1.8rem', marginLeft: '0.6rem', opacity: 1, duration: 0.5, ease: 'power4.inOut' })
      .fromTo(arrowCircle, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }, '<0.1')
      .fromTo(arrowSvg, { x: -15, scale: 0.8 }, { x: 0, scale: 1, duration: 0.3, ease: 'sine.out' }, '-=0.2')

    const stopRoll = bindRollAnimation(action, textElement)
    const enterArrow = () => arrowTimeline.play()
    const leaveArrow = () => arrowTimeline.reverse()
    action.addEventListener('pointerenter', enterArrow)
    action.addEventListener('pointerleave', leaveArrow)
    action.addEventListener('focusin', enterArrow)
    action.addEventListener('focusout', leaveArrow)

    return () => {
      stopRoll?.()
      action.removeEventListener('pointerenter', enterArrow)
      action.removeEventListener('pointerleave', leaveArrow)
      action.removeEventListener('focusin', enterArrow)
      action.removeEventListener('focusout', leaveArrow)
      arrowTimeline.kill()
    }
  }, [])

  const Tag = as
  const actionClassName = `akatech-luxury-action ${className}`.trim()

  return createElement(
    Tag,
    { ...props, ref: actionRef, className: actionClassName },
    <span className="akatech-action-text-wrap">
      <span ref={textRef} className="akatech-action-text">{text}</span>
    </span>,
    <span className="akatech-action-arrow-wrap" aria-hidden="true">
      <span className="akatech-action-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path className="akatech-arrow-icon-line" d="M4 12h15" />
          <polyline className="akatech-arrow-icon-chevron" points="13 6 19 12 13 18" />
        </svg>
      </span>
    </span>,
  )
}

/** Version texte seule : le même libellé utilise le roll vertical Neon Synthwave. */
export function CyclicText({ text, className = '', triggerParent = false }) {
  const textRef = useRef(null)

  useEffect(() => {
    const element = textRef.current
    if (!element) return undefined
    const trigger = triggerParent ? (element.closest('.akatech-luxury-action') || element.parentElement) : element
    return bindRollAnimation(trigger, element)
  }, [triggerParent])

  return <span ref={textRef} className={`akatech-cyclic-text ${className}`.trim()}>{text}</span>
}
