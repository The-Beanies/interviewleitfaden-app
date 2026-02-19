'use client'

import { useSyncStore } from '@/stores/sync-store'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'

export function SyncIndicator() {
  const syncStatus = useSyncStore((s) => s.syncStatus)
  const lastError = useSyncStore((s) => s.lastError)

  if (syncStatus === 'idle') return null

  return (
    <span className="relative flex items-center" title={lastError ?? undefined}>
      {syncStatus === 'syncing' && <Loader2 className="size-4 animate-spin text-carbon-black/40" />}
      {syncStatus === 'success' && <CheckCircle2 className="size-4 text-botanical-green" />}
      {syncStatus === 'error' && <AlertTriangle className="size-4 text-error" />}
    </span>
  )
}
