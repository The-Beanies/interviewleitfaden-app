'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { WizardState } from '@/types'

const MAX_STEP = 9

interface WizardStore {
  currentInterviewId: string | null
  byInterview: Record<string, WizardState>
  setInterview: (interviewId: string) => void
  setValidationErrors: (step: number, errors: string[]) => void
  clearValidationErrors: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  markComplete: (step: number) => void
  resetInterviewState: (interviewId: string) => void
  removeInterview: (interviewId: string) => void
  getCurrentState: () => WizardState
}

function createInitialWizardState(): WizardState {
  return {
    currentStep: 0,
    completedSteps: [],
    validationErrors: {},
  }
}

function clampStep(step: number) {
  return Math.max(0, Math.min(MAX_STEP, step))
}

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      currentInterviewId: null,
      byInterview: {},
      setInterview: (interviewId) => {
        set((state) => ({
          currentInterviewId: interviewId,
          byInterview: {
            ...state.byInterview,
            [interviewId]: state.byInterview[interviewId] ?? createInitialWizardState(),
          },
        }))
      },
      setValidationErrors: (step, errors) => {
        const interviewId = get().currentInterviewId
        if (!interviewId) return

        set((state) => ({
          byInterview: {
            ...state.byInterview,
            [interviewId]: {
              ...(state.byInterview[interviewId] ?? createInitialWizardState()),
              validationErrors: {
                ...(state.byInterview[interviewId]?.validationErrors ?? {}),
                [step]: errors,
              },
            },
          },
        }))
      },
      clearValidationErrors: (step) => {
        const interviewId = get().currentInterviewId
        if (!interviewId) return

        set((state) => {
          const current = state.byInterview[interviewId] ?? createInitialWizardState()
          const { [step]: _unused, ...rest } = current.validationErrors
          void _unused
          return {
            byInterview: {
              ...state.byInterview,
              [interviewId]: {
                ...current,
                validationErrors: rest,
              },
            },
          }
        })
      },
      nextStep: () => {
        const interviewId = get().currentInterviewId
        if (!interviewId) return

        set((state) => {
          const current = state.byInterview[interviewId] ?? createInitialWizardState()
          return {
            byInterview: {
              ...state.byInterview,
              [interviewId]: {
                ...current,
                currentStep: clampStep(current.currentStep + 1),
              },
            },
          }
        })
      },
      prevStep: () => {
        const interviewId = get().currentInterviewId
        if (!interviewId) return

        set((state) => {
          const current = state.byInterview[interviewId] ?? createInitialWizardState()
          return {
            byInterview: {
              ...state.byInterview,
              [interviewId]: {
                ...current,
                currentStep: clampStep(current.currentStep - 1),
              },
            },
          }
        })
      },
      goToStep: (step) => {
        const interviewId = get().currentInterviewId
        if (!interviewId) return

        set((state) => {
          const current = state.byInterview[interviewId] ?? createInitialWizardState()
          return {
            byInterview: {
              ...state.byInterview,
              [interviewId]: {
                ...current,
                currentStep: clampStep(step),
              },
            },
          }
        })
      },
      markComplete: (step) => {
        const interviewId = get().currentInterviewId
        if (!interviewId) return

        set((state) => {
          const current = state.byInterview[interviewId] ?? createInitialWizardState()
          if (current.completedSteps.includes(step)) {
            return state
          }

          return {
            byInterview: {
              ...state.byInterview,
              [interviewId]: {
                ...current,
                completedSteps: [...current.completedSteps, step].sort((a, b) => a - b),
              },
            },
          }
        })
      },
      resetInterviewState: (interviewId) => {
        set((state) => ({
          byInterview: {
            ...state.byInterview,
            [interviewId]: createInitialWizardState(),
          },
        }))
      },
      removeInterview: (interviewId) => {
        set((state) => {
          const { [interviewId]: _unused, ...rest } = state.byInterview
          void _unused
          return { byInterview: rest }
        })
      },
      getCurrentState: () => {
        const state = get()
        if (!state.currentInterviewId) {
          return createInitialWizardState()
        }

        return state.byInterview[state.currentInterviewId] ?? createInitialWizardState()
      },
    }),
    {
      name: 'interview-guide-wizard',
      version: 1,
      partialize: (state) => ({
        currentInterviewId: state.currentInterviewId,
        byInterview: state.byInterview,
      }),
    },
  ),
)
