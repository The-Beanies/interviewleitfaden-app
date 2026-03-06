'use client'

import { useSyncStore } from '@/stores/sync-store'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'

export function SyncIndicator() {
  const syncStatus = useSyncStore((s) => s.syncStatus)
  const lastError = useSyncStore((s) => s.lastError)

  if (syncStatus === 'idle') return null

  return (
    <span className="relative flex items-center" role="status" aria-live="polite" title={lastError ?? undefined}>
      {syncStatus === 'syncing' && (
        <>
          <Loader2 className="size-4 animate-spin text-carbon-black/40" />
          <span className="sr-only">Synchronisiere...</span>
        </>
      )}
      {syncStatus === 'success' && (
        <>
          <CheckCircle2 className="size-4 text-botanical-green" />
          <span className="sr-only">Synchronisiert</span>
        </>
      )}
      {syncStatus === 'error' && (
        <>
          <AlertTriangle className="size-4 text-error" />
          <span className="sr-only">Synchronisation fehlgeschlagen</span>
        </>
      )}
    </span>
  )
}
