import type { Interview } from '@/types'
import type { Database, Json } from '@/types/database'
import { useSyncStore } from '@/stores/sync-store'
import { createClient } from './client'

type InterviewRow = Database['public']['Tables']['interviews']['Row']
type InterviewInsert = Database['public']['Tables']['interviews']['Insert']

function rowToInterview(row: InterviewRow): Interview {
  const config = row.config as unknown as Interview['config']
  return {
    id: row.id,
    name: row.name,
    config,
    status: row.status as Interview['status'],
    scheduledAt: row.scheduled_at,
    conductedAt: row.conducted_at ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function interviewToRow(
  interview: Interview,
  userId: string,
): InterviewInsert {
  return {
    id: interview.id,
    user_id: userId,
    name: interview.name,
    config: interview.config as unknown as Json,
    status: interview.status,
    scheduled_at: interview.scheduledAt,
    conducted_at: interview.conductedAt || null,
    created_at: interview.createdAt,
    updated_at: interview.updatedAt,
  }
}

export async function fetchInterviews(
  userId: string,
): Promise<Interview[]> {
  const { setSyncing, setSyncSuccess, setSyncError } =
    useSyncStore.getState()
  setSyncing()
  const supabase = createClient()
  const { data, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  if (error) {
    console.error('Failed to fetch interviews:', error.message)
    setSyncError(`Laden fehlgeschlagen: ${error.message}`)
    return []
  }
  setSyncSuccess()
  return (data ?? []).map(rowToInterview)
}

export async function upsertInterview(
  interview: Interview,
  userId: string,
): Promise<boolean> {
  const { setSyncing, setSyncSuccess, setSyncError } =
    useSyncStore.getState()
  setSyncing()
  const supabase = createClient()
  const { error } = await supabase
    .from('interviews')
    .upsert(interviewToRow(interview, userId), { onConflict: 'id' })
  if (error) {
    console.error('Failed to upsert interview:', error.message)
    setSyncError(`Speichern fehlgeschlagen: ${error.message}`)
    return false
  }
  setSyncSuccess()
  return true
}

export async function deleteInterviewRemote(
  interviewId: string,
): Promise<boolean> {
  const { setSyncing, setSyncSuccess, setSyncError } =
    useSyncStore.getState()
  setSyncing()
  const supabase = createClient()
  const { error } = await supabase
    .from('interviews')
    .delete()
    .eq('id', interviewId)
  if (error) {
    console.error('Failed to delete interview:', error.message)
    setSyncError(`Löschen fehlgeschlagen: ${error.message}`)
    return false
  }
  setSyncSuccess()
  return true
}

export function mergeInterviewLists(
  local: Interview[],
  remote: Interview[],
): Interview[] {
  const merged = new Map<string, Interview>()
  for (const interview of remote) merged.set(interview.id, interview)
  for (const interview of local) {
    const existing = merged.get(interview.id)
    if (
      !existing ||
      new Date(interview.updatedAt) > new Date(existing.updatedAt)
    )
      merged.set(interview.id, interview)
  }
  return Array.from(merged.values()).sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}
