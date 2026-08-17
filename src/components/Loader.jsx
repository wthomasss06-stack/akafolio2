'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { cld } from '../lib/cloudinary'

const HOME_DURATION = 4900
const INNER_DURATION = 1100

/**
 * Loader d’entrée minimal AKATech.
 *
 * La séquence s’arrête après le compteur. La révélation finale est déléguée
 * à PageTransitionOverlay dans App.jsx, jamais à un trou ou à un canvas local.
 */
export default function Loader({ onDone, isMobile = false }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const duration = isHome ? HOME_DURATION : INNER_DURATION
  const [progress, setProgress] = useState(0)
  const [present, setPresent] = useState(true)
  const doneRef = useRef(false)

  useEffect(() => {
    let raf = 0
    const start = performance.now()

    const tick = (now) => {
      const ratio = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - ratio, 3)
      setProgress(Math.round(eased * 100))
      if (ratio < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        // À 100 %, on passe immédiatement à PageTransitionOverlay.
        setPresent(false)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      // requestAnimationFrame est le seul timer de cette séquence.
    }
  }, [duration, isHome])

  const finish = () => {
    if (doneRef.current) return
    doneRef.current = true
    onDone?.()
  }

  return (
    <AnimatePresence initial={false} onExitComplete={finish}>
      {present && (
        <motion.div
          className={`aka-loader${isMobile ? ' aka-loader--mobile' : ''}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Chargement d’AKATech Studio"
        >
          <div className="aka-loader-center">
            <img
              src={cld('/assets/images/logo-akatech.webp')}
              alt="AKATech Studio"
              className="aka-loader-logo"
            />
            <div className="aka-loader-name">AKATECH</div>
            <div className="aka-loader-progress" aria-label={`${progress}% chargé`}>
              {String(progress).padStart(3, '0')}<span>%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
