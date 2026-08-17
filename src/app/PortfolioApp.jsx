'use client'

// next/dynamic avec { ssr: false } doit être appelé depuis un Client
// Component — impossible directement dans page.js (Server Component).
// Ce fichier n'a que ce seul rôle : servir de frontière client pour
// charger RootApp.jsx (qui gère lui-même ses 3 modes en ssr:false).

import dynamic from 'next/dynamic'

const RootApp = dynamic(() => import('../RootApp.jsx'), { ssr: false })

export default function PortfolioApp() {
  return <RootApp />
}
