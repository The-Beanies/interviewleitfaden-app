'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Header } from '@/components/layout/Header'
import ScrollToTop from '@/components/navigation/ScrollToTop'
import { SummaryShell } from '@/components/summary/SummaryShell'
import { WizardShell } from '@/components/wizard/WizardShell'
import { useHydrated } from '@/lib/use-hydrated'
import { useInterviewStore } from '@/stores/interview-store'

const STORAGE_KEY = 'editor-split-pct'
const MIN_PCT = 25
const MAX_PCT = 75
const DEFAULT_PCT = 45

function loadSplitPct(): number {
  if (typeof window === 'undefined') return DEFAULT_PCT
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return DEFAULT_PCT
  const val = Number(stored)
  if (Number.isNaN(val) || val < MIN_PCT || val > MAX_PCT) return DEFAULT_PCT
  return val
}

export default function EditorPage() {
  const hydrated = useHydrated()
  const interview = useInterviewStore((state) => state.getActiveInterview())
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit')
  const router = useRouter()

  const [splitPct, setSplitPct] = useState(DEFAULT_PCT)
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setSplitPct(loadSplitPct())
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    isDragging.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      if (!isDragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      const clamped = Math.min(MAX_PCT, Math.max(MIN_PCT, pct))
      setSplitPct(clamped)
    }

    function handlePointerUp() {
      if (!isDragging.current) return
      isDragging.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      setSplitPct((current) => {
        localStorage.setItem(STORAGE_KEY, String(Math.round(current)))
        return current
      })
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

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

      <main id="main-content" ref={containerRef} className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left panel — editor */}
        <div
          className={`overflow-y-auto border-terrazzo-grey p-4 lg:border-r lg:p-6 ${
            mobileView === 'edit' ? 'block' : 'hidden lg:block'
          }`}
          style={{ width: `${splitPct}%` }}
        >
          <WizardShell />
        </div>

        {/* Drag handle — desktop only */}
        <div
          onPointerDown={handlePointerDown}
          className="hidden lg:flex shrink-0 w-2 cursor-col-resize items-center justify-center bg-terrazzo-grey/30 hover:bg-botanical-green/20 active:bg-botanical-green/30 transition-colors"
        >
          <div className="h-8 w-0.5 rounded-full bg-terrazzo-grey" />
        </div>

        {/* Right panel — preview */}
        <div
          className={`overflow-y-auto ${
            mobileView === 'preview' ? 'block' : 'hidden lg:block'
          }`}
          style={{ width: `${100 - splitPct}%` }}
        >
          <SummaryShell interview={interview} />
        </div>
      </main>

      <ScrollToTop />
    </>
  )
}
