'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  createDefaultInterview,
  createDefaultInterviewConfig,
  createDefaultCustomQuestions,
  createDefaultSummary,
  SECTION_KEYS,
} from '@/config/defaults'
import { createId } from '@/lib/utils'
import { useWizardStore } from '@/stores/wizard-store'
import type {
  AdditionalFounder,
  CoreFacts,
  Interview,
  InterviewConfig,
  InterviewQuestion,
  InterviewSectionKey,
  InterviewStatus,
  JTBDAnalysis,
  OverallAssessment,
  PainPoint,
  PostInterviewSummary,
  Quote,
  SteveReaction,
  TimerState,
} from '@/types'

interface InterviewStore {
  interviews: Interview[]
  activeInterviewId: string
  createInterview: (name?: string) => string
  duplicateInterview: (id: string) => string | null
  deleteInterview: (id: string) => void
  renameInterview: (id: string, name: string) => void
  setActiveInterview: (id: string) => void
  getActiveInterview: () => Interview
  updateStatus: (status: InterviewStatus) => void
  updateCoreFacts: (payload: Partial<CoreFacts>) => void
  updateSectionNote: (sectionKey: InterviewSectionKey, content: string) => void
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt'>) => void
  removeQuote: (quoteId: string) => void
  updateChecklist: (itemId: string, checked: boolean) => void
  addChecklistItem: (label: string) => void
  removeChecklistItem: (id: string) => void
  updateTimerState: (payload: Partial<TimerState>) => void
  updateSummary: (payload: Partial<PostInterviewSummary>) => void
  updateJTBD: (payload: Partial<JTBDAnalysis>) => void
  addPainPoint: (painPoint: Omit<PainPoint, 'id'>) => void
  updatePainPoint: (id: string, payload: Partial<PainPoint>) => void
  removePainPoint: (id: string) => void
  reorderPainPoints: (fromIndex: number, toIndex: number) => void
  updateSteveReaction: (payload: Partial<SteveReaction>) => void
  updateOverallAssessment: (payload: Partial<OverallAssessment>) => void
  replaceActiveConfig: (config: InterviewConfig) => void
  addFounder: () => void
  updateFounder: (id: string, payload: Partial<AdditionalFounder>) => void
  removeFounder: (id: string) => void
  addCustomQuestion: (sectionKey: InterviewSectionKey, text: string) => void
  removeCustomQuestion: (sectionKey: InterviewSectionKey, questionId: string) => void
}

function withUpdatedInterview(
  state: Pick<InterviewStore, 'interviews' | 'activeInterviewId'>,
  updater: (interview: Interview) => Interview,
): Interview[] {
  return state.interviews.map((interview) =>
    interview.id === state.activeInterviewId
      ? updater({ ...interview, updatedAt: new Date().toISOString() })
      : interview,
  )
}

function mergeSummaryWithDefaults(summary: unknown, coreFacts?: CoreFacts): PostInterviewSummary {
  const defaults = createDefaultSummary(coreFacts)

  if (!summary || typeof summary !== 'object') {
    return defaults
  }

  const incoming = summary as Partial<PostInterviewSummary>

  return {
    ...defaults,
    ...incoming,
    coreFacts: {
      ...defaults.coreFacts,
      ...(incoming.coreFacts ?? {}),
      additionalFounders: Array.isArray(incoming.coreFacts?.additionalFounders)
        ? incoming.coreFacts.additionalFounders
        : defaults.coreFacts.additionalFounders,
    },
    jtbd: {
      ...defaults.jtbd,
      ...(incoming.jtbd ?? {}),
      pushFactors: Array.isArray(incoming.jtbd?.pushFactors)
        ? incoming.jtbd.pushFactors
        : defaults.jtbd.pushFactors,
      pullFactors: Array.isArray(incoming.jtbd?.pullFactors)
        ? incoming.jtbd.pullFactors
        : defaults.jtbd.pullFactors,
      anxiety: Array.isArray(incoming.jtbd?.anxiety)
        ? incoming.jtbd.anxiety
        : defaults.jtbd.anxiety,
      habit: Array.isArray(incoming.jtbd?.habit) ? incoming.jtbd.habit : defaults.jtbd.habit,
    },
    painPoints: Array.isArray(incoming.painPoints)
      ? incoming.painPoints.map((point, index) => ({
          ...point,
          id: typeof point.id === 'string' && point.id ? point.id : createId('pain'),
          rank: typeof point.rank === 'number' ? point.rank : index + 1,
        }))
      : defaults.painPoints,
    workaroundsAttempted: Array.isArray(incoming.workaroundsAttempted)
      ? incoming.workaroundsAttempted
      : defaults.workaroundsAttempted,
    aiToolsUsed: Array.isArray(incoming.aiToolsUsed) ? incoming.aiToolsUsed : defaults.aiToolsUsed,
    aiBarriers: Array.isArray(incoming.aiBarriers) ? incoming.aiBarriers : defaults.aiBarriers,
    steveReaction: {
      ...defaults.steveReaction,
      ...(incoming.steveReaction ?? {}),
      quotesAboutSteve: Array.isArray(incoming.steveReaction?.quotesAboutSteve)
        ? incoming.steveReaction.quotesAboutSteve
        : defaults.steveReaction.quotesAboutSteve,
    },
    keyQuotes: Array.isArray(incoming.keyQuotes)
      ? incoming.keyQuotes.map((quote) => ({
          ...quote,
          id: typeof quote.id === 'string' && quote.id ? quote.id : createId('quote'),
          createdAt:
            typeof quote.createdAt === 'string' && quote.createdAt
              ? quote.createdAt
              : new Date().toISOString(),
        }))
      : defaults.keyQuotes,
    overallAssessment: {
      ...defaults.overallAssessment,
      ...(incoming.overallAssessment ?? {}),
    },
  }
}

function mergeConfigWithDefaults(config: unknown): InterviewConfig {
  const defaults = createDefaultInterviewConfig()

  if (!config || typeof config !== 'object') {
    return defaults
  }

  const incoming = config as Partial<InterviewConfig>
  const coreFacts = {
    ...defaults.coreFacts,
    ...(incoming.coreFacts ?? {}),
    additionalFounders: Array.isArray(incoming.coreFacts?.additionalFounders)
      ? incoming.coreFacts.additionalFounders
      : defaults.coreFacts.additionalFounders,
  }

  // Build sectionNotes using SECTION_KEYS loop for DRY
  const sectionNotes = {} as Record<InterviewSectionKey, (typeof defaults.sectionNotes)[InterviewSectionKey]>
  for (const key of SECTION_KEYS) {
    sectionNotes[key] = {
      ...defaults.sectionNotes[key],
      ...(incoming.sectionNotes?.[key] ?? {}),
      quotes: Array.isArray(incoming.sectionNotes?.[key]?.quotes)
        ? incoming.sectionNotes![key].quotes
        : defaults.sectionNotes[key].quotes,
    }
  }

  // Merge customQuestions
  const defaultCustomQuestions = createDefaultCustomQuestions()
  const customQuestions = {} as Record<InterviewSectionKey, InterviewQuestion[]>
  for (const key of SECTION_KEYS) {
    customQuestions[key] = Array.isArray(incoming.customQuestions?.[key])
      ? incoming.customQuestions![key]
      : defaultCustomQuestions[key]
  }

  return {
    ...defaults,
    ...incoming,
    coreFacts,
    sectionNotes,
    allQuotes: Array.isArray(incoming.allQuotes)
      ? incoming.allQuotes.map((quote) => ({
          ...quote,
          id: typeof quote.id === 'string' && quote.id ? quote.id : createId('quote'),
          createdAt:
            typeof quote.createdAt === 'string' && quote.createdAt
              ? quote.createdAt
              : new Date().toISOString(),
        }))
      : defaults.allQuotes,
    summary: mergeSummaryWithDefaults(incoming.summary, coreFacts),
    checklist: Array.isArray(incoming.checklist)
      ? incoming.checklist.map((item) => ({
          id: typeof item.id === 'string' && item.id ? item.id : createId('checklist'),
          label: typeof item.label === 'string' ? item.label : '',
          checked: Boolean(item.checked),
        }))
      : defaults.checklist,
    timerState: {
      ...defaults.timerState,
      ...(incoming.timerState ?? {}),
    },
    customQuestions,
  }
}

function normalizeInterview(interview: unknown): Interview | null {
  if (!interview || typeof interview !== 'object') {
    return null
  }

  const incoming = interview as Partial<Interview>
  const fallback = createDefaultInterview(
    typeof incoming.name === 'string' && incoming.name.trim() ? incoming.name.trim() : 'Unbenanntes Interview',
  )

  return {
    id: typeof incoming.id === 'string' && incoming.id ? incoming.id : fallback.id,
    name: typeof incoming.name === 'string' && incoming.name.trim() ? incoming.name : fallback.name,
    createdAt: typeof incoming.createdAt === 'string' ? incoming.createdAt : fallback.createdAt,
    updatedAt: typeof incoming.updatedAt === 'string' ? incoming.updatedAt : fallback.updatedAt,
    scheduledAt: typeof incoming.scheduledAt === 'string' ? incoming.scheduledAt : fallback.scheduledAt,
    conductedAt: typeof incoming.conductedAt === 'string' ? incoming.conductedAt : fallback.conductedAt,
    status:
      incoming.status === 'geplant' ||
      incoming.status === 'in_durchfuehrung' ||
      incoming.status === 'abgeschlossen' ||
      incoming.status === 'abgebrochen'
        ? incoming.status
        : fallback.status,
    config: mergeConfigWithDefaults(incoming.config),
  }
}

function normalizePersistedState(
  persistedState: unknown,
  fallbackState: Pick<InterviewStore, 'interviews' | 'activeInterviewId'>,
): Pick<InterviewStore, 'interviews' | 'activeInterviewId'> {
  const incoming = persistedState as Partial<Pick<InterviewStore, 'interviews' | 'activeInterviewId'>> | null
  const incomingInterviews = Array.isArray(incoming?.interviews) ? incoming.interviews : []
  const interviews = incomingInterviews
    .map(normalizeInterview)
    .filter((interview): interview is Interview => interview !== null)

  if (!interviews.length) {
    return fallbackState
  }

  const activeInterviewId =
    typeof incoming?.activeInterviewId === 'string' &&
    interviews.some((interview) => interview.id === incoming.activeInterviewId)
      ? incoming.activeInterviewId
      : interviews[0].id

  return {
    interviews,
    activeInterviewId,
  }
}

const initialInterview = createDefaultInterview('Erstes Discovery Interview')

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set, get) => ({
      interviews: [initialInterview],
      activeInterviewId: initialInterview.id,
      createInterview: (name = 'Unbenanntes Interview') => {
        const interview = createDefaultInterview(name)
        set((state) => ({
          interviews: [interview, ...state.interviews],
          activeInterviewId: interview.id,
        }))
        return interview.id
      },
      duplicateInterview: (id) => {
        const source = get().interviews.find((interview) => interview.id === id)
        if (!source) return null

        const now = new Date().toISOString()
        const duplicate: Interview = {
          ...structuredClone(source),
          id: createId('interview'),
          name: `${source.name} Kopie`,
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          interviews: [duplicate, ...state.interviews],
          activeInterviewId: duplicate.id,
        }))

        return duplicate.id
      },
      deleteInterview: (id) => {
        set((state) => {
          const interviews = state.interviews.filter((interview) => interview.id !== id)
          if (!interviews.length) {
            const fallback = createDefaultInterview('Erstes Discovery Interview')
            return {
              interviews: [fallback],
              activeInterviewId: fallback.id,
            }
          }

          const hasActive = interviews.some((interview) => interview.id === state.activeInterviewId)

          return {
            interviews,
            activeInterviewId: hasActive ? state.activeInterviewId : interviews[0].id,
          }
        })
        useWizardStore.getState().removeInterview(id)
      },
      renameInterview: (id, name) => {
        const trimmed = name.trim()
        if (!trimmed) return

        set((state) => ({
          interviews: state.interviews.map((interview) =>
            interview.id === id
              ? { ...interview, name: trimmed, updatedAt: new Date().toISOString() }
              : interview,
          ),
        }))
      },
      setActiveInterview: (id) => {
        if (!get().interviews.some((interview) => interview.id === id)) return
        set({ activeInterviewId: id })
      },
      getActiveInterview: () => {
        const state = get()
        return (
          state.interviews.find((interview) => interview.id === state.activeInterviewId) ??
          state.interviews[0] ??
          createDefaultInterview('Erstes Discovery Interview')
        )
      },
      updateStatus: (status) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            status,
            conductedAt:
              status === 'abgeschlossen' || status === 'in_durchfuehrung'
                ? interview.conductedAt || new Date().toISOString()
                : interview.conductedAt,
          })),
        }))
      },
      updateCoreFacts: (payload) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => {
            const coreFacts = {
              ...interview.config.coreFacts,
              ...payload,
            }
            return {
              ...interview,
              config: {
                ...interview.config,
                coreFacts,
                summary: {
                  ...interview.config.summary,
                  coreFacts,
                },
              },
            }
          }),
        }))
      },
      updateSectionNote: (sectionKey, content) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              sectionNotes: {
                ...interview.config.sectionNotes,
                [sectionKey]: {
                  ...interview.config.sectionNotes[sectionKey],
                  content,
                  timestamp: new Date().toISOString(),
                },
              },
            },
          })),
        }))
      },
      addQuote: (quote) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => {
            const newQuote: Quote = {
              ...quote,
              id: createId('quote'),
              createdAt: new Date().toISOString(),
            }

            const section = interview.config.sectionNotes[newQuote.sectionKey]
            const keyQuotes = newQuote.isVerbatim
              ? [newQuote, ...interview.config.summary.keyQuotes].slice(0, 20)
              : interview.config.summary.keyQuotes

            const quotesAboutSteve =
              newQuote.sectionKey === 'konzepttest_steve'
                ? [...interview.config.summary.steveReaction.quotesAboutSteve, newQuote.text]
                : interview.config.summary.steveReaction.quotesAboutSteve

            return {
              ...interview,
              config: {
                ...interview.config,
                allQuotes: [newQuote, ...interview.config.allQuotes],
                sectionNotes: {
                  ...interview.config.sectionNotes,
                  [newQuote.sectionKey]: {
                    ...section,
                    quotes: [newQuote, ...section.quotes],
                    timestamp: new Date().toISOString(),
                  },
                },
                summary: {
                  ...interview.config.summary,
                  keyQuotes,
                  steveReaction: {
                    ...interview.config.summary.steveReaction,
                    quotesAboutSteve,
                  },
                },
              },
            }
          }),
        }))
      },
      removeQuote: (quoteId) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => {
            // Find the quote text before removing so we can also filter quotesAboutSteve
            const removedQuote = interview.config.allQuotes.find((q) => q.id === quoteId)

            // Build filtered sectionNotes using SECTION_KEYS loop (DRY)
            const sectionNotes = {} as Record<InterviewSectionKey, (typeof interview.config.sectionNotes)[InterviewSectionKey]>
            for (const key of SECTION_KEYS) {
              sectionNotes[key] = {
                ...interview.config.sectionNotes[key],
                quotes: interview.config.sectionNotes[key].quotes.filter((quote) => quote.id !== quoteId),
              }
            }

            return {
              ...interview,
              config: {
                ...interview.config,
                allQuotes: interview.config.allQuotes.filter((quote) => quote.id !== quoteId),
                sectionNotes,
                summary: {
                  ...interview.config.summary,
                  keyQuotes: interview.config.summary.keyQuotes.filter((quote) => quote.id !== quoteId),
                  steveReaction: {
                    ...interview.config.summary.steveReaction,
                    quotesAboutSteve: removedQuote
                      ? interview.config.summary.steveReaction.quotesAboutSteve.filter(
                          (text) => text !== removedQuote.text,
                        )
                      : interview.config.summary.steveReaction.quotesAboutSteve,
                  },
                },
              },
            }
          }),
        }))
      },
      updateChecklist: (itemId, checked) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              checklist: interview.config.checklist.map((item) =>
                item.id === itemId ? { ...item, checked } : item,
              ),
            },
          })),
        }))
      },
      addChecklistItem: (label) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              checklist: [
                ...interview.config.checklist,
                { id: createId('checklist'), label, checked: false },
              ],
            },
          })),
        }))
      },
      removeChecklistItem: (id) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              checklist: interview.config.checklist.filter((item) => item.id !== id),
            },
          })),
        }))
      },
      updateTimerState: (payload) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              timerState: {
                ...interview.config.timerState,
                ...payload,
              },
            },
          })),
        }))
      },
      updateSummary: (payload) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              summary: {
                ...interview.config.summary,
                ...payload,
                coreFacts: {
                  ...interview.config.summary.coreFacts,
                  ...(payload.coreFacts ?? {}),
                },
                jtbd: {
                  ...interview.config.summary.jtbd,
                  ...(payload.jtbd ?? {}),
                  pushFactors: payload.jtbd?.pushFactors ?? interview.config.summary.jtbd.pushFactors,
                  pullFactors: payload.jtbd?.pullFactors ?? interview.config.summary.jtbd.pullFactors,
                  anxiety: payload.jtbd?.anxiety ?? interview.config.summary.jtbd.anxiety,
                  habit: payload.jtbd?.habit ?? interview.config.summary.jtbd.habit,
                },
                steveReaction: {
                  ...interview.config.summary.steveReaction,
                  ...(payload.steveReaction ?? {}),
                  quotesAboutSteve:
                    payload.steveReaction?.quotesAboutSteve ??
                    interview.config.summary.steveReaction.quotesAboutSteve,
                },
                overallAssessment: {
                  ...interview.config.summary.overallAssessment,
                  ...(payload.overallAssessment ?? {}),
                },
                painPoints: payload.painPoints ?? interview.config.summary.painPoints,
                workaroundsAttempted:
                  payload.workaroundsAttempted ?? interview.config.summary.workaroundsAttempted,
                aiToolsUsed: payload.aiToolsUsed ?? interview.config.summary.aiToolsUsed,
                aiBarriers: payload.aiBarriers ?? interview.config.summary.aiBarriers,
                keyQuotes: payload.keyQuotes ?? interview.config.summary.keyQuotes,
              },
            },
          })),
        }))
      },
      updateJTBD: (payload) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              summary: {
                ...interview.config.summary,
                jtbd: {
                  ...interview.config.summary.jtbd,
                  ...payload,
                  pushFactors: payload.pushFactors ?? interview.config.summary.jtbd.pushFactors,
                  pullFactors: payload.pullFactors ?? interview.config.summary.jtbd.pullFactors,
                  anxiety: payload.anxiety ?? interview.config.summary.jtbd.anxiety,
                  habit: payload.habit ?? interview.config.summary.jtbd.habit,
                },
              },
            },
          })),
        }))
      },
      addPainPoint: (painPoint) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => {
            const nextRank = interview.config.summary.painPoints.length + 1
            return {
              ...interview,
              config: {
                ...interview.config,
                summary: {
                  ...interview.config.summary,
                  painPoints: [
                    ...interview.config.summary.painPoints,
                    {
                      ...painPoint,
                      id: createId('pain'),
                      rank: painPoint.rank || nextRank,
                    },
                  ],
                },
              },
            }
          }),
        }))
      },
      updatePainPoint: (id, payload) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              summary: {
                ...interview.config.summary,
                painPoints: interview.config.summary.painPoints.map((point) =>
                  point.id === id ? { ...point, ...payload } : point,
                ),
              },
            },
          })),
        }))
      },
      removePainPoint: (id) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              summary: {
                ...interview.config.summary,
                painPoints: interview.config.summary.painPoints
                  .filter((point) => point.id !== id)
                  .map((point, index) => ({ ...point, rank: index + 1 })),
              },
            },
          })),
        }))
      },
      reorderPainPoints: (fromIndex, toIndex) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => {
            const list = [...interview.config.summary.painPoints]
            if (
              fromIndex < 0 ||
              fromIndex >= list.length ||
              toIndex < 0 ||
              toIndex >= list.length ||
              fromIndex === toIndex
            ) {
              return interview
            }

            const [moved] = list.splice(fromIndex, 1)
            list.splice(toIndex, 0, moved)

            return {
              ...interview,
              config: {
                ...interview.config,
                summary: {
                  ...interview.config.summary,
                  painPoints: list.map((point, index) => ({
                    ...point,
                    rank: index + 1,
                  })),
                },
              },
            }
          }),
        }))
      },
      updateSteveReaction: (payload) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              summary: {
                ...interview.config.summary,
                steveReaction: {
                  ...interview.config.summary.steveReaction,
                  ...payload,
                  quotesAboutSteve:
                    payload.quotesAboutSteve ?? interview.config.summary.steveReaction.quotesAboutSteve,
                },
              },
            },
          })),
        }))
      },
      updateOverallAssessment: (payload) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              summary: {
                ...interview.config.summary,
                overallAssessment: {
                  ...interview.config.summary.overallAssessment,
                  ...payload,
                },
              },
            },
          })),
        }))
      },
      replaceActiveConfig: (config) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: mergeConfigWithDefaults(config),
          })),
        }))
      },
      addFounder: () => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => {
            const newFounder: AdditionalFounder = {
              id: createId('founder'),
              name: '',
              role: '',
              contact: '',
            }
            const coreFacts = {
              ...interview.config.coreFacts,
              additionalFounders: [...interview.config.coreFacts.additionalFounders, newFounder],
            }
            return {
              ...interview,
              config: {
                ...interview.config,
                coreFacts,
                summary: {
                  ...interview.config.summary,
                  coreFacts,
                },
              },
            }
          }),
        }))
      },
      updateFounder: (id, payload) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => {
            const coreFacts = {
              ...interview.config.coreFacts,
              additionalFounders: interview.config.coreFacts.additionalFounders.map((founder) =>
                founder.id === id ? { ...founder, ...payload } : founder,
              ),
            }
            return {
              ...interview,
              config: {
                ...interview.config,
                coreFacts,
                summary: {
                  ...interview.config.summary,
                  coreFacts,
                },
              },
            }
          }),
        }))
      },
      removeFounder: (id) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => {
            const coreFacts = {
              ...interview.config.coreFacts,
              additionalFounders: interview.config.coreFacts.additionalFounders.filter(
                (founder) => founder.id !== id,
              ),
            }
            return {
              ...interview,
              config: {
                ...interview.config,
                coreFacts,
                summary: {
                  ...interview.config.summary,
                  coreFacts,
                },
              },
            }
          }),
        }))
      },
      addCustomQuestion: (sectionKey, text) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => {
            const newQuestion: InterviewQuestion = {
              id: createId('custom-q'),
              text,
              isFollowUp: false,
              segment: 'both',
            }
            return {
              ...interview,
              config: {
                ...interview.config,
                customQuestions: {
                  ...interview.config.customQuestions,
                  [sectionKey]: [...(interview.config.customQuestions[sectionKey] ?? []), newQuestion],
                },
              },
            }
          }),
        }))
      },
      removeCustomQuestion: (sectionKey, questionId) => {
        set((state) => ({
          interviews: withUpdatedInterview(state, (interview) => ({
            ...interview,
            config: {
              ...interview.config,
              customQuestions: {
                ...interview.config.customQuestions,
                [sectionKey]: (interview.config.customQuestions[sectionKey] ?? []).filter(
                  (q) => q.id !== questionId,
                ),
              },
            },
          })),
        }))
      },
    }),
    {
      name: 'interview-guide-interviews',
      partialize: (state) => ({
        interviews: state.interviews,
        activeInterviewId: state.activeInterviewId,
      }),
      version: 1,
      merge: (persistedState, currentState) => {
        const normalized = normalizePersistedState(persistedState, {
          interviews: currentState.interviews,
          activeInterviewId: currentState.activeInterviewId,
        })

        return {
          ...currentState,
          ...normalized,
        }
      },
    },
  ),
)

export function getActiveInterviewConfig() {
  return useInterviewStore.getState().getActiveInterview().config
}

// --- Supabase Sync ---

let syncDebounceTimer: ReturnType<typeof setTimeout> | null = null
let currentUserId: string | null = null

export async function initialSync(userId: string) {
  currentUserId = userId
  const { fetchInterviews, upsertInterview } = await import('@/lib/supabase/sync')
  const remote = await fetchInterviews(userId)

  if (remote.length > 0) {
    const currentActiveId = useInterviewStore.getState().activeInterviewId
    const activeStillExists = remote.some((i) => i.id === currentActiveId)
    useInterviewStore.setState({
      interviews: remote,
      activeInterviewId: activeStillExists ? currentActiveId : remote[0].id,
    })
  } else {
    const fresh = createDefaultInterview('Erstes Discovery Interview')
    useInterviewStore.setState({
      interviews: [fresh],
      activeInterviewId: fresh.id,
    })
    await upsertInterview(fresh, userId)
  }
}

export function startSync() {
  return useInterviewStore.subscribe(() => {
    if (!currentUserId) return
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer)
    syncDebounceTimer = setTimeout(async () => {
      if (!currentUserId) return
      const { upsertInterview } = await import('@/lib/supabase/sync')
      const interviews = useInterviewStore.getState().interviews
      for (const interview of interviews) {
        await upsertInterview(interview, currentUserId)
      }
    }, 2000)
  })
}

export function stopSync() {
  currentUserId = null
  if (syncDebounceTimer) {
    clearTimeout(syncDebounceTimer)
    syncDebounceTimer = null
  }
}
