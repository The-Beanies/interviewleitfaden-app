'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Copy, Pencil, Plus, Trash2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Select } from '@/components/ui/select'
import { useHydrated } from '@/lib/use-hydrated'
import { formatDate } from '@/lib/utils'
import { segmentLabel, statusLabel } from '@/lib/labels'
import { useInterviewStore } from '@/stores/interview-store'

export default function InterviewsPage() {
  const hydrated = useHydrated()
  const router = useRouter()

  const interviews = useInterviewStore((state) => state.interviews)
  const activeInterviewId = useInterviewStore((state) => state.activeInterviewId)
  const setActiveInterview = useInterviewStore((state) => state.setActiveInterview)
  const createInterview = useInterviewStore((state) => state.createInterview)
  const duplicateInterview = useInterviewStore((state) => state.duplicateInterview)
  const deleteInterview = useInterviewStore((state) => state.deleteInterview)
  const renameInterview = useInterviewStore((state) => state.renameInterview)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  if (!hydrated) return null

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="type-h2 text-carbon-black">Interviews</h1>
            <p className="type-body text-carbon-black/60">Verwalte alle Discovery Interviews</p>
          </div>

          <button
            type="button"
            onClick={() => {
              createInterview('Neues Interview')
              router.push('/')
            }}
            className="inline-flex items-center gap-2 rounded-button bg-botanical-green px-4 py-2.5 text-sm font-semibold text-studio-white shadow-level1"
          >
            <Plus className="size-4" />
            Neues Interview
          </button>
        </div>

        {interviews.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-card border-2 border-dashed border-terrazzo-grey p-12 text-center">
            <h2 className="type-h4 text-carbon-black/60">Noch keine Interviews</h2>
            <p className="type-body text-carbon-black/40">Erstelle dein erstes Discovery Interview, um loszulegen.</p>
            <button
              type="button"
              onClick={() => {
                createInterview('Neues Interview')
                router.push('/')
              }}
              className="inline-flex items-center gap-2 rounded-button bg-botanical-green px-4 py-2.5 text-sm font-semibold text-studio-white shadow-level1"
            >
              <Plus className="size-4" />
              Neues Interview erstellen
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview) => {
            const isActive = interview.id === activeInterviewId
            const isEditing = editingId === interview.id
            const painPointsCount = interview.config.summary.painPoints.length

            return (
              <div
                key={interview.id}
                className={`cursor-pointer rounded-card border p-5 shadow-level1 ${
                  isActive
                    ? 'border-botanical-green bg-botanical-green/5'
                    : 'border-terrazzo-grey bg-studio-white hover:border-botanical-green/50'
                }`}
                onClick={() => {
                  setActiveInterview(interview.id)
                  router.push('/')
                }}
              >
                {isEditing ? (
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    onBlur={() => {
                      renameInterview(interview.id, editName)
                      setEditingId(null)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        renameInterview(interview.id, editName)
                        setEditingId(null)
                      }
                    }}
                    className="mb-2 w-full border-b border-botanical-green bg-transparent text-lg font-semibold outline-none"
                    autoFocus
                    onClick={(event) => event.stopPropagation()}
                  />
                ) : (
                  <h3 className="mb-1 type-h4 line-clamp-1 text-carbon-black">{interview.name}</h3>
                )}

                <p className="type-caption text-carbon-black/50">
                  Segment: {interview.config.coreFacts.segment ? segmentLabel(interview.config.coreFacts.segment) : '-'}
                </p>
                <p className="type-caption text-carbon-black/50">
                  Status: {statusLabel(interview.status)} · Schmerzpunkte: {painPointsCount}
                </p>
                <p className="mt-1 type-caption text-carbon-black/40">Aktualisiert: {formatDate(interview.updatedAt)}</p>

                <div className="mt-3 space-y-2 border-t border-terrazzo-grey pt-3">
                  <Select
                    value={interview.status}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => {
                      event.stopPropagation()
                      setActiveInterview(interview.id)
                      useInterviewStore.getState().updateStatus(
                        event.target.value as 'geplant' | 'in_durchfuehrung' | 'abgeschlossen' | 'abgebrochen',
                      )
                    }}
                  >
                    <option value="geplant">geplant</option>
                    <option value="in_durchfuehrung">in Durchführung</option>
                    <option value="abgeschlossen">abgeschlossen</option>
                    <option value="abgebrochen">abgebrochen</option>
                  </Select>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setEditingId(interview.id)
                        setEditName(interview.name)
                      }}
                      className="inline-flex items-center gap-1 text-xs text-carbon-black/60 hover:text-botanical-green"
                    >
                      <Pencil className="size-3.5" />
                      Umbenennen
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        duplicateInterview(interview.id)
                      }}
                      className="inline-flex items-center gap-1 text-xs text-carbon-black/60 hover:text-botanical-green"
                    >
                      <Copy className="size-3.5" />
                      Duplizieren
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        if (confirm(`Interview „${interview.name}“ löschen?`)) {
                          deleteInterview(interview.id)
                        }
                      }}
                      className="ml-auto inline-flex items-center gap-1 text-xs text-carbon-black/60 hover:text-error"
                    >
                      <Trash2 className="size-3.5" />
                      Löschen
                    </button>
                  </div>
                </div>

                {isActive ? (
                  <div className="mt-3">
                    <span className="rounded-button bg-botanical-green/10 px-2 py-0.5 text-xs font-semibold text-botanical-green">
                      Aktiv
                    </span>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
