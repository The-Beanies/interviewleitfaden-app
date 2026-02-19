'use client'

import { ConductShell } from '@/components/conduct/ConductShell'
import { Header } from '@/components/layout/Header'
import { useHydrated } from '@/lib/use-hydrated'

export default function ConductPage() {
  const hydrated = useHydrated()

  if (!hydrated) return null

  return (
    <>
      <Header />
      <main id="main-content">
        <ConductShell />
      </main>
    </>
  )
}
