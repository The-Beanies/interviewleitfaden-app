import { create } from 'zustand'

type SyncStatus = 'idle' | 'syncing' | 'error' | 'success'

interface SyncStore {
  syncStatus: SyncStatus
  lastError: string | null
  lastSyncedAt: string | null
  setSyncing: () => void
  setSyncSuccess: () => void
  setSyncError: (error: string) => void
  clearError: () => void
}

export const useSyncStore = create<SyncStore>()((set) => ({
  syncStatus: 'idle',
  lastError: null,
  lastSyncedAt: null,
  setSyncing: () => set({ syncStatus: 'syncing' }),
  setSyncSuccess: () => set({ syncStatus: 'success', lastError: null, lastSyncedAt: new Date().toISOString() }),
  setSyncError: (error) => set({ syncStatus: 'error', lastError: error }),
  clearError: () => set({ syncStatus: 'idle', lastError: null }),
}))
