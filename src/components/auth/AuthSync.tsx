'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { initialSync, startSync, stopSync } from '@/stores/interview-store'

export function AuthSync() {
  const { user, loading } = useAuth()
  const syncStarted = useRef(false)

  useEffect(() => {
    if (loading) return

    if (user && !syncStarted.current) {
      syncStarted.current = true
      initialSync(user.id)
      const unsub = startSync()
      return () => {
        unsub()
        stopSync()
        syncStarted.current = false
      }
    }

    if (!user) {
      stopSync()
      syncStarted.current = false
    }
  }, [user, loading])

  return null
}
