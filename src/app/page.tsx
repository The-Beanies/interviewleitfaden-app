'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Header } from '@/components/layout/Header'
import ScrollToTop from '@/components/navigation/ScrollToTop'
import { WizardShell } from '@/components/wizard/WizardShell'
import { useHydrated } from '@/lib/use-hydrated'
import { useInterviewStore } from '@/stores/interview-store'

export default function EditorPage() {
  const hydrated = useHydrated()
  const interview = useInterviewStore((state) => state.getActiveInterview())
  const router = useRouter()

  useEffect(() => {
    if (hydrated && !interview) {
      router.replace('/interviews')
    }
  }, [hydrated, interview, router])

  if (!hydrated || !interview) return null

  return (
    <>
      <Header />

      <main id="main-content" className="min-h-screen bg-studio-white">
        <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
          <WizardShell />
        </div>
      </main>

      <ScrollToTop />
    </>
  )
}
