'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsapSetup'
import Footer from './Footer'
import LuxuryAction, { CyclicText, getAkatechCycle } from './LuxuryAction'

export default function PageEnd({ ctaTitle, ctaText, ctaLabel, onCta, nextLabel, onNext }) {
  const ctaRef = useRef(null)

  useEffect(() => {
    const el = ctaRef.current
    if (!el) return undefined
    const ctx = gsap.context(() => {
      gsap.from(el.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    }, ctaRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <button type="button" className="akatech-continue" onClick={onNext}>
        <span className="akatech-continue-label">Continuer à me lire</span>
        <span className="akatech-continue-next">
          <CyclicText text={nextLabel} cycle={getAkatechCycle(nextLabel)} triggerParent />
          <svg
            className="akatech-continue-arrow"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div ref={ctaRef} className="container akatech-page-cta">
        <h3>{ctaTitle}</h3>
        <p>{ctaText}</p>
        <LuxuryAction label={ctaLabel} onClick={onCta} />
      </div>

      <Footer />
    </>
  )
}
