'use client'

import { useMemo, useState } from 'react'

import { INTERVIEW_SECTIONS, SECTION_KEYS } from '@/config/defaults'
import { Button } from '@/components/ui/button'
import { TimerDisplay } from '@/components/ui/timer-display'
import { useTimer } from '@/hooks/use-timer'
import { segmentLabel } from '@/lib/labels'
import { useInterviewStore } from '@/stores/interview-store'
import type { InterviewSectionKey } from '@/types'

import { PauseOverlay } from './PauseOverlay'
import { QuickQuoteCapture } from './QuickQuoteCapture'
import { SectionCard } from './SectionCard'
import { SectionProgress } from './SectionProgress'
import { SectionTimer } from './SectionTimer'

export function ConductShell() {
  const interview = useInterviewStore((state) => state.getActiveInterview())
  const updateStatus = useInterviewStore((state) => state.updateStatus)

  const [sectionIndex, setSectionIndex] = useState(() => {
    const current = interview.config.timerState.currentSectionKey
    const found = current ? SECTION_KEYS.indexOf(current) : -1
    return found >= 0 ? found : 0
  })

  const sectionKey = SECTION_KEYS[sectionIndex] as InterviewSectionKey
  const section = useMemo(
    () => INTERVIEW_SECTIONS.find((item) => item.key === sectionKey),
    [sectionKey],
  )

  const { isPaused, pause, resume, resetSection, remainingMs, totalElapsedMs } = useTimer(
    sectionKey,
    section?.durationMinutes ?? 10,
  )

  function nextSection() {
    setSectionIndex((value) => Math.min(SECTION_KEYS.length - 1, value + 1))
  }

  function prevSection() {
    setSectionIndex((value) => Math.max(0, value - 1))
  }

  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  return (
    <div
      className="relative min-h-[calc(100vh-4rem)] bg-studio-white px-3 py-3 md:px-6"
      onTouchStart={(event) => setTouchStartX(event.changedTouches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchStartX === null) return
        const diff = event.changedTouches[0].clientX - touchStartX
        if (Math.abs(diff) < 45) return
        if (diff < 0) nextSection()
        if (diff > 0) prevSection()
      }}
    >
      <PauseOverlay visible={isPaused} />

      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h1 className="type-h3 text-carbon-black">Durchführungsmodus: {interview.name}</h1>
            <p className="text-sm text-carbon-black/60">
              Segment: {segmentLabel(interview.config.coreFacts.segment)} | Gesamtzeit: <TimerDisplay remainingMs={totalElapsedMs} />
            </p>
          </div>
          {section ? (
            <SectionTimer
              remainingMs={remainingMs}
              sectionDurationMs={section.durationMinutes * 60 * 1000}
            />
          ) : null}
        </div>

        <SectionProgress currentIndex={sectionIndex} total={SECTION_KEYS.length} />

        <SectionCard sectionKey={sectionKey} />

        <div className="grid grid-cols-2 gap-2 rounded-card border border-terrazzo-grey bg-studio-white p-3 shadow-level1 md:grid-cols-3 lg:grid-cols-6">
          <Button variant="outline" className="min-h-12" onClick={prevSection} disabled={sectionIndex === 0}>
            <span className="sm:hidden">Zurück</span>
            <span className="hidden sm:inline">Vorherige</span>
          </Button>
          <Button variant="outline" className="min-h-12" onClick={nextSection} disabled={sectionIndex === SECTION_KEYS.length - 1}>
            <span className="sm:hidden">Weiter</span>
            <span className="hidden sm:inline">Nächste</span>
          </Button>
          <Button variant="outline" className="min-h-12" onClick={resetSection}>
            <span className="sm:hidden">Reset</span>
            <span className="hidden sm:inline">Abschnitt zurücksetzen</span>
          </Button>
          <Button variant="outline" className="min-h-12" onClick={isPaused ? resume : pause}>
            {isPaused ? 'Fortsetzen' : 'Pausieren'}
          </Button>
          <Button
            variant="outline"
            className="min-h-12"
            onClick={() => updateStatus('in_durchfuehrung')}
          >
            <span className="sm:hidden">Laufend</span>
            <span className="hidden sm:inline">Als laufend markieren</span>
          </Button>
          <Button className="min-h-12" onClick={() => updateStatus('abgeschlossen')}>
            <span className="sm:hidden">Fertig</span>
            <span className="hidden sm:inline">Als abgeschlossen markieren</span>
          </Button>
        </div>
      </div>

      <QuickQuoteCapture sectionKey={sectionKey} />
    </div>
  )
}
