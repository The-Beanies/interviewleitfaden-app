'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Header } from '@/components/layout/Header'
import ScrollToTop from '@/components/navigation/ScrollToTop'
import { SummaryShell } from '@/components/summary/SummaryShell'
import { WizardShell } from '@/components/wizard/WizardShell'
import { useHydrated } from '@/lib/use-hydrated'
import { useInterviewStore } from '@/stores/interview-store'

export default function EditorPage() {
  const hydrated = useHydrated()
  const interview = useInterviewStore((state) => state.getActiveInterview())
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
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

      <div className="sticky top-16 z-30 flex border-b border-terrazzo-grey bg-studio-white lg:hidden">
        <button
          type="button"
          onClick={() => setMobileView('edit')}
          className={`flex-1 py-3 text-center type-small font-semibold ${
            mobileView === 'edit'
              ? 'border-b-2 border-botanical-green text-botanical-green'
              : 'text-carbon-black/50'
          }`}
        >
          Bearbeiten
        </button>
        <button
          type="button"
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-3 text-center type-small font-semibold ${
            mobileView === 'preview'
              ? 'border-b-2 border-botanical-green text-botanical-green'
              : 'text-carbon-black/50'
          }`}
        >
          Vorschau
        </button>
      </div>

      <main id="main-content" className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <div
          className={`w-full overflow-y-auto border-terrazzo-grey p-4 lg:w-1/2 lg:border-r lg:p-6 xl:w-[45%] ${
            mobileView === 'edit' ? 'block' : 'hidden lg:block'
          }`}
        >
          <WizardShell />
        </div>

        <div
          className={`w-full overflow-y-auto ${
            mobileView === 'preview' ? 'block' : 'hidden lg:block'
          } lg:w-1/2 xl:w-[55%]`}
        >
          <SummaryShell interview={interview} />
        </div>
      </main>

      <ScrollToTop />
    </>
  )
}
