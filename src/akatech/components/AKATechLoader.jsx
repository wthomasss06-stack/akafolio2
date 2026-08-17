'use client'

import { useEffect, useState } from 'react'

const ASCII_WIDTH = 22

export default function AKATechLoader({ onComplete, duration = 1700 }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const startedAt = performance.now()
    let frame
    const tick = (now) => {
      const ratio = Math.min((now - startedAt) / duration, 1)
      setProgress(Math.round(ratio * 100))
      if (ratio < 1) frame = requestAnimationFrame(tick)
      else window.setTimeout(onComplete, 160)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [duration, onComplete])

  const filled = Math.max(1, Math.round((progress / 100) * ASCII_WIDTH))
  const asciiBar = `${'='.repeat(filled)}${'-'.repeat(Math.max(0, ASCII_WIDTH - filled))}`

  return (
    <div className="akatech-loader akatech-loader--cli" role="status" aria-live="polite" aria-label="Chargement de AKATech">
      <div className="akatech-cli-card">
        <div className="akatech-cli-topline">
          <span className="akatech-cli-badge">09. CLI Terminal</span>
          <span className="akatech-cli-prompt">root@system:~#</span>
        </div>
        <h1>Barre Style Console CLI</h1>
        <p>Rendu ASCII rétro pour développeurs.</p>
        <div className="akatech-cli-console" aria-hidden="true">
          <div className="akatech-cli-status">[BUILDING_BUNDLE]<span>{progress}%</span></div>
          <div className="akatech-cli-bar">[{asciiBar}]</div>
        </div>
      </div>
    </div>
  )
}
