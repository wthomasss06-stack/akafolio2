'use client'

import { useEffect, useRef, useState } from 'react'
import { runGridTransition } from './GooeyTransition.jsx'
import { cld } from '../lib/cloudinary'

const COUNT_DURATION = 1450
const GOOEY_DURATION = 1750

/**
 * Loader dédié à Appmobile.
 * Le loader ne contient volontairement aucun shader de papier brûlé :
 * la sortie et la révélation du Hero passent par GooeyTransition.mobile.
 */
export default function MobileLoader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const startedRef = useRef(false)
  const doneRef = useRef(false)
  const onDoneRef = useRef(onDone)
  useEffect(() => { onDoneRef.current = onDone }, [onDone])

  useEffect(() => {
    let raf = 0
    let transitionTimer = 0
    const startedAt = performance.now()

    const tick = (now) => {
      const ratio = Math.min((now - startedAt) / COUNT_DURATION, 1)
      const eased = 1 - Math.pow(1 - ratio, 3)
      const next = Math.round(eased * 100)
      setProgress(next)

      if (ratio < 1) {
        raf = requestAnimationFrame(tick)
        return
      }

      if (startedRef.current) return
      startedRef.current = true

      /* Les volets orange couvrent le loader, puis le contenu déjà monté
         sous l’écran est révélé par GooeyTransition.mobile. */
      runGridTransition(() => {
        setVisible(false)
      }, 'mobile')

      transitionTimer = window.setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true
          onDoneRef.current?.()
        }
      }, GOOEY_DURATION)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(transitionTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="mob-aka-loader" role="status" aria-live="polite" aria-label="Chargement d’AKATech Studio">
      <div className="mob-aka-loader__center">
        <img
          className="mob-aka-loader__logo"
          src={cld('/assets/images/logo-akatech.webp')}
          alt="AKATech Studio"
        />
        <div className="mob-aka-loader__name">AKATECH</div>
        <div className="mob-aka-loader__progress" aria-label={`${progress}% chargé`}>
          {String(progress).padStart(3, '0')}<span>%</span>
        </div>
      </div>
    </div>
  )
}
