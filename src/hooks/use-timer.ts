'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { useInterviewStore } from '@/stores/interview-store'
import type { InterviewSectionKey, TimerState } from '@/types'

function nowIso() {
  return new Date().toISOString()
}

function msSince(iso: string | null) {
  if (!iso) return 0
  return Math.max(0, Date.now() - new Date(iso).getTime())
}

/**
 * Subscribe to timer state via individual primitives to avoid re-render loops.
 * React 19 + Zustand 5 require getSnapshot to return stable references;
 * subscribing to primitives (string, number, boolean) ensures Object.is equality.
 */
function useTimerState() {
  const currentSectionKey = useInterviewStore(
    (s) => s.interviews.find((i) => i.id === s.activeInterviewId)?.config.timerState.currentSectionKey ?? null,
  )
  const sectionStartedAt = useInterviewStore(
    (s) => s.interviews.find((i) => i.id === s.activeInterviewId)?.config.timerState.sectionStartedAt ?? null,
  )
  const sectionElapsedMs = useInterviewStore(
    (s) => s.interviews.find((i) => i.id === s.activeInterviewId)?.config.timerState.sectionElapsedMs ?? 0,
  )
  const totalElapsedMs = useInterviewStore(
    (s) => s.interviews.find((i) => i.id === s.activeInterviewId)?.config.timerState.totalElapsedMs ?? 0,
  )
  const isPaused = useInterviewStore(
    (s) => s.interviews.find((i) => i.id === s.activeInterviewId)?.config.timerState.isPaused ?? true,
  )

  return { currentSectionKey, sectionStartedAt, sectionElapsedMs, totalElapsedMs, isPaused }
}

export function useTimer(sectionKey: InterviewSectionKey, durationMinutes: number) {
  const timerState = useTimerState()
  const updateTimerState = useInterviewStore((state) => state.updateTimerState)

  const [tick, setTick] = useState(0)

  // Use a ref to prevent the initialization effect from running more than once per section
  const initRef = useRef<string | null>(null)

  useEffect(() => {
    // Auto-pause if session is stale (e.g. browser was closed overnight)
    const STALE_THRESHOLD_MS = 2 * 60 * 60 * 1000 // 2 hours
    if (
      !timerState.isPaused &&
      timerState.sectionStartedAt &&
      msSince(timerState.sectionStartedAt) > STALE_THRESHOLD_MS
    ) {
      updateTimerState({
        sectionElapsedMs: timerState.sectionElapsedMs,
        sectionStartedAt: null,
        isPaused: true,
      })
      return
    }

    if (timerState.currentSectionKey !== sectionKey) {
      // Prevent re-running if we already initialized this section
      if (initRef.current === sectionKey) return
      initRef.current = sectionKey

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

    // Reset the init guard when section matches
    initRef.current = null

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
