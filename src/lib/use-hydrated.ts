import { useState, useEffect } from 'react'

import { useInterviewStore } from '@/stores/interview-store'

/**
 * Returns true once Zustand persist stores have rehydrated from localStorage.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (useInterviewStore.persist.hasHydrated()) {
      setHydrated(true)
      return
    }

    const unsubscribe = useInterviewStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    return unsubscribe
  }, [])

  return hydrated
}
