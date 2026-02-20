'use client'

import { useMemo, useState } from 'react'

import { Calendar, Copy, Globe, Lock, Pencil, Plus, Trash2 } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Select } from '@/components/ui/select'
import { useHydrated } from '@/lib/use-hydrated'
import { formatDateTime } from '@/lib/utils'
import { segmentLabel, statusLabel } from '@/lib/labels'
import { useInterviewStore } from '@/stores/interview-store'
import type { InterviewStatus } from '@/types'

function isoToDatetimeLocal(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const STATUS_DOT_COLOR: Record<InterviewStatus, string> = {
  geplant: 'bg-cornflower',
  in_durchfuehrung: 'bg-[#c47d0e]',
  abgeschlossen: 'bg-[#1a7a4a]',
  abgebrochen: 'bg-[#c0392b]',
}

export default function InterviewsPage() {
  const hydrated = useHydrated()

  const interviews = useInterviewStore((state) => state.interviews)
  const activeInterviewId = useInterviewStore((state) => state.activeInterviewId)
  const setActiveInterview = useInterviewStore((state) => state.setActiveInterview)
  const createInterview = useInterviewStore((state) => state.createInterview)
  const duplicateInterview = useInterviewStore((state) => state.duplicateInterview)
  const deleteInterview = useInterviewStore((state) => state.deleteInterview)
  const renameInterview = useInterviewStore((state) => state.renameInterview)
  const updateVisibility = useInterviewStore((state) => state.updateVisibility)
  const updateScheduledAt = useInterviewStore((state) => state.updateScheduledAt)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const sortedInterviews = useMemo(
    () =>
      [...interviews].sort(
        (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      ),
    [interviews],
  )

  if (!hydrated) return null

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-cloud-dancer">
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
          {/* Page header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-[family-name:var(--font-sora)] text-3xl font-bold text-ink">
                Interviews
              </h1>
              <p className="mt-1 text-base text-text-muted">
                Verwalte alle Discovery Interviews
              </p>
            </div>

            <button
              type="button"
              onClick={() => createInterview('Neues Interview')}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-electric-blue px-8 text-base font-bold text-white shadow-sm transition-colors min-h-[56px] hover:bg-cornflower"
            >
              <Plus className="size-5" />
              Neues Interview
            </button>
          </div>

          {/* Empty state */}
          {sortedInterviews.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-5 rounded-card-lg border-2 border-dashed border-cornflower/40 bg-white p-16 text-center">
              <h2 className="font-[family-name:var(--font-sora)] text-xl font-semibold text-ink">
                Noch keine Interviews
              </h2>
              <p className="text-text-muted">
                Erstelle dein erstes Discovery Interview, um loszulegen.
              </p>
              <button
                type="button"
                onClick={() => createInterview('Neues Interview')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-electric-blue px-8 text-base font-bold text-white shadow-sm transition-colors min-h-[56px] hover:bg-cornflower"
              >
                <Plus className="size-5" />
                Neues Interview erstellen
              </button>
            </div>
          )}

          {/* Interview list */}
          <div className="flex flex-col gap-3">
            {sortedInterviews.map((interview) => {
              const isActive = interview.id === activeInterviewId
              const isEditing = editingId === interview.id
              const painPointsCount = interview.config.summary.painPoints.length

              return (
                <div
                  key={interview.id}
                  className={`cursor-pointer rounded-card-lg border bg-white transition-all ${
                    isActive
                      ? 'border-electric-blue ring-2 ring-electric-blue/20 shadow-md'
                      : 'border-cloud-dancer shadow-sm hover:shadow-md hover:border-cornflower'
                  }`}
                  onClick={() => setActiveInterview(interview.id)}
                >
                  {/* Main row: all info in a horizontal layout */}
                  <div className="flex items-center gap-4 px-5 py-4">
                    {/* Active indicator */}
                    <div className={`shrink-0 size-2.5 rounded-full ${isActive ? 'bg-electric-blue' : 'bg-transparent'}`} />

                    {/* Name */}
                    <div className="min-w-0 flex-1">
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
                          className="w-full border-b-2 border-electric-blue bg-transparent font-[family-name:var(--font-sora)] text-base font-semibold text-ink outline-none"
                          autoFocus
                          onClick={(event) => event.stopPropagation()}
                        />
                      ) : (
                        <h3 className="truncate font-[family-name:var(--font-sora)] text-base font-semibold text-ink">
                          {interview.name}
                        </h3>
                      )}
                    </div>

                    {/* Date */}
                    <div className="hidden shrink-0 items-center gap-1.5 text-sm text-ink sm:flex">
                      <Calendar className="size-3.5 text-text-muted" />
                      <span>{formatDateTime(interview.scheduledAt)}</span>
                    </div>

                    {/* Segment */}
                    <span className="hidden shrink-0 text-sm text-text-muted md:block">
                      {interview.config.coreFacts.segment
                        ? segmentLabel(interview.config.coreFacts.segment)
                        : '-'}
                    </span>

                    {/* Status dot + label */}
                    <div className="hidden shrink-0 items-center gap-1.5 text-sm text-text-muted sm:flex">
                      <span className={`inline-block size-2 rounded-full ${STATUS_DOT_COLOR[interview.status]}`} />
                      <span>{statusLabel(interview.status)}</span>
                    </div>

                    {/* Pain points */}
                    <span className="hidden shrink-0 text-sm text-text-muted lg:block">
                      {painPointsCount} Schmerzp.
                    </span>

                    {/* Visibility badge */}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        updateVisibility(
                          interview.id,
                          interview.visibility === 'public' ? 'private' : 'public',
                        )
                      }}
                      className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                        interview.visibility === 'public'
                          ? 'bg-electric-blue/10 text-electric-blue'
                          : 'bg-cloud-dancer text-text-muted'
                      }`}
                      title={interview.visibility === 'public' ? 'Auf privat setzen' : 'Öffentlich machen'}
                    >
                      {interview.visibility === 'public' ? (
                        <Globe className="size-3" />
                      ) : (
                        <Lock className="size-3" />
                      )}
                      <span className="hidden sm:inline">
                        {interview.visibility === 'public' ? 'Öffentlich' : 'Privat'}
                      </span>
                    </button>
                  </div>

                  {/* Actions row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-cloud-dancer px-5 py-2.5">
                    {/* Date picker */}
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <Calendar className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-muted" />
                      <input
                        type="datetime-local"
                        value={isoToDatetimeLocal(interview.scheduledAt)}
                        onChange={(event) => {
                          const val = event.target.value
                          if (val) {
                            updateScheduledAt(interview.id, new Date(val).toISOString())
                          }
                        }}
                        className="h-8 w-[180px] rounded-lg border border-cloud-dancer bg-white pl-8 pr-2 text-xs text-ink focus:border-electric-blue focus:outline-none"
                      />
                    </div>

                    {/* Status select */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={interview.status}
                        onChange={(event) => {
                          setActiveInterview(interview.id)
                          useInterviewStore
                            .getState()
                            .updateStatus(event.target.value as InterviewStatus)
                        }}
                        className="!h-8 !w-auto !min-w-[110px] !rounded-lg !border-cloud-dancer !bg-white !text-xs !text-ink focus:!border-electric-blue"
                      >
                        <option value="geplant">Geplant</option>
                        <option value="in_durchfuehrung">In Durchf.</option>
                        <option value="abgeschlossen">Abgeschl.</option>
                        <option value="abgebrochen">Abgebr.</option>
                      </Select>
                    </div>

                    <div className="mx-1 hidden h-4 w-px bg-cloud-dancer sm:block" />

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setEditingId(interview.id)
                        setEditName(interview.name)
                      }}
                      className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-electric-blue transition-colors"
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
                      className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-electric-blue transition-colors"
                    >
                      <Copy className="size-3.5" />
                      Duplizieren
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        if (confirm(`Interview „${interview.name}" löschen?`)) {
                          deleteInterview(interview.id)
                        }
                      }}
                      className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-[#c0392b] transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                      Löschen
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
