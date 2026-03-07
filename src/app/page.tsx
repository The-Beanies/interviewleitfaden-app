'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Header } from '@/components/layout/Header'
import ScrollToTop from '@/components/navigation/ScrollToTop'
import { Skeleton } from '@/components/ui/skeleton'
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

  if (!hydrated || !interview) {
    return (
      <div className="min-h-screen bg-studio-white">
        <div className="sticky top-0 z-40 border-b border-terrazzo-grey bg-studio-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-4 md:px-8">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
            <div className="hidden rounded-card border border-terrazzo-grey p-4 lg:block">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-32 mb-3" />
              <Skeleton className="h-2 w-full mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            </div>
            <div className="rounded-card border border-terrazzo-grey p-5">
              <Skeleton className="h-7 w-48 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
