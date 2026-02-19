'use client'

import { useEffect, useMemo, useState } from 'react'

import { useInterviewStore } from '@/stores/interview-store'
import type { InterviewSectionKey } from '@/types'

function nowIso() {
  return new Date().toISOString()
}

function msSince(iso: string | null) {
  if (!iso) return 0
  return Math.max(0, Date.now() - new Date(iso).getTime())
}

export function useTimer(sectionKey: InterviewSectionKey, durationMinutes: number) {
  const interview = useInterviewStore((state) => state.getActiveInterview())
  const updateTimerState = useInterviewStore((state) => state.updateTimerState)

  const timerState = interview.config.timerState
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (timerState.currentSectionKey !== sectionKey) {
      const previousElapsed =
        timerState.currentSectionKey && !timerState.isPaused
          ? timerState.sectionElapsedMs + msSince(timerState.sectionStartedAt)
          : timerState.sectionElapsedMs

      updateTimerState({
        currentSectionKey: sectionKey,
        sectionStartedAt: nowIso(),
        sectionElapsedMs: 0,
        totalElapsedMs: (timerState.totalElapsedMs || 0) + (previousElapsed || 0),
        isPaused: false,
      })
      return
    }

    if (!timerState.isPaused && !timerState.sectionStartedAt) {
      updateTimerState({ sectionStartedAt: nowIso() })
    }
  }, [
    sectionKey,
    timerState.currentSectionKey,
    timerState.isPaused,
    timerState.sectionElapsedMs,
    timerState.sectionStartedAt,
    timerState.totalElapsedMs,
    updateTimerState,
  ])

  useEffect(() => {
    if (timerState.isPaused || timerState.currentSectionKey !== sectionKey) return

    const id = window.setInterval(() => {
      setTick((value) => value + 1)
    }, 250)

    return () => window.clearInterval(id)
  }, [sectionKey, timerState.currentSectionKey, timerState.isPaused])

  const sectionElapsedMs = useMemo(() => {
    if (timerState.currentSectionKey !== sectionKey) return 0
    if (timerState.isPaused) return timerState.sectionElapsedMs
    return timerState.sectionElapsedMs + msSince(timerState.sectionStartedAt)
  }, [sectionKey, timerState.currentSectionKey, timerState.isPaused, timerState.sectionElapsedMs, timerState.sectionStartedAt, tick])

  const durationMs = durationMinutes * 60 * 1000
  const remainingMs = Math.max(0, durationMs - sectionElapsedMs)

  const totalElapsedMs =
    timerState.totalElapsedMs +
    (timerState.currentSectionKey === sectionKey && !timerState.isPaused
      ? msSince(timerState.sectionStartedAt)
      : 0)

  function pause() {
    if (timerState.isPaused) return
    const elapsed = timerState.sectionElapsedMs + msSince(timerState.sectionStartedAt)
    updateTimerState({
      sectionElapsedMs: elapsed,
      sectionStartedAt: null,
      isPaused: true,
    })
  }

  function resume() {
    if (!timerState.isPaused) return
    updateTimerState({
      sectionStartedAt: nowIso(),
      isPaused: false,
    })
  }

  function resetSection() {
    updateTimerState({
      sectionElapsedMs: 0,
      sectionStartedAt: timerState.isPaused ? null : nowIso(),
    })
  }

  return {
    isPaused: timerState.isPaused,
    sectionElapsedMs,
    totalElapsedMs,
    remainingMs,
    pause,
    resume,
    resetSection,
  }
}
