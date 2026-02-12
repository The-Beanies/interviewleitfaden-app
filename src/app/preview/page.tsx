'use client'

import { Header } from '@/components/layout/Header'
import MobileNav from '@/components/navigation/MobileNav'
import ScrollToTop from '@/components/navigation/ScrollToTop'
import { SummaryShell } from '@/components/summary/SummaryShell'
import { useHydrated } from '@/lib/use-hydrated'
import { useInterviewStore } from '@/stores/interview-store'

export default function PreviewPage() {
  const hydrated = useHydrated()
  const interview = useInterviewStore((state) => state.getActiveInterview())

  if (!hydrated) return null

  return (
    <>
      <Header />
      <MobileNav />
      <main id="main-content" className="min-h-screen bg-studio-white">
        <SummaryShell interview={interview} />
      </main>
      <ScrollToTop />
    </>
  )
}
