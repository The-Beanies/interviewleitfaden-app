'use client'

import { Header } from '@/components/layout/Header'
import { InsightsDashboard } from '@/components/insights/InsightsDashboard'
import { useHydrated } from '@/lib/use-hydrated'

export default function InsightsPage() {
  const hydrated = useHydrated()

  if (!hydrated) return null

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-studio-white">
        <InsightsDashboard />
      </main>
    </>
  )
}
