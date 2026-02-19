'use client'

import { TimerDisplay } from '@/components/ui/timer-display'

export function SectionTimer({
  remainingMs,
  sectionDurationMs,
}: {
  remainingMs: number
  sectionDurationMs: number
}) {
  const ratio = sectionDurationMs > 0 ? remainingMs / sectionDurationMs : 0

  const colorClass = ratio > 0.5 ? 'text-success' : ratio > 0.2 ? 'text-warning' : 'text-error'

  return (
    <div className="rounded-card border border-terrazzo-grey bg-studio-white p-4 text-center shadow-level1">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-carbon-black/50">Abschnitts-Timer</p>
      <TimerDisplay remainingMs={remainingMs} className={colorClass} />
    </div>
  )
}
