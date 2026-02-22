'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import MobileNav from '@/components/navigation/MobileNav'
import ScrollToTop from '@/components/navigation/ScrollToTop'
import { SummaryShell } from '@/components/summary/SummaryShell'
import { useHydrated } from '@/lib/use-hydrated'
import { useInterviewStore } from '@/stores/interview-store'

export default function PreviewPage() {
  return (
    <Suspense>
      <PreviewContent />
    </Suspense>
  )
}

function PreviewContent() {
  const hydrated = useHydrated()
  const interview = useInterviewStore((state) => state.getActiveInterview())
  const searchParams = useSearchParams()

  useEffect(() => {
    if (hydrated && interview && searchParams.get('print') === '1') {
      const timer = setTimeout(() => window.print(), 400)
      return () => clearTimeout(timer)
    }
  }, [hydrated, interview, searchParams])

  if (!hydrated) return null

  if (!interview) {
    return (
      <>
        <Header />
        <main id="main-content" className="flex min-h-screen items-center justify-center bg-studio-white">
          <p className="type-body text-carbon-black/60">Kein Interview ausgewählt.</p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <MobileNav />
      <main id="main-content" className="min-h-screen bg-studio-white">
        <SummaryShell interview={interview} />
      </main>
      <ScrollToTop />
      <button
        onClick={() => window.print()}
        className="no-print fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-botanical-green px-5 py-3 text-studio-white shadow-level2 hover:opacity-90 transition-opacity cursor-pointer"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        PDF drucken
      </button>
    </>
  )
}
