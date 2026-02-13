'use client'

import { useEffect, useState, type ReactElement } from 'react'

import { Pencil } from 'lucide-react'
import { WIZARD_STEP_LABELS } from '@/config/defaults'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { useInterviewStore } from '@/stores/interview-store'
import { useWizardStore } from '@/stores/wizard-store'

import { AbschlussStep } from '@/components/wizard/steps/AbschlussStep'
import { AssessmentStep } from '@/components/wizard/steps/AssessmentStep'
import { ChecklistStep } from '@/components/wizard/steps/ChecklistStep'
import { CoreFactsStep } from '@/components/wizard/steps/CoreFactsStep'
import { GruendungsreiseStep } from '@/components/wizard/steps/GruendungsreiseStep'
import { KIStep } from '@/components/wizard/steps/KIStep'
import { SchmerzStep } from '@/components/wizard/steps/SchmerzStep'
import { SteveTestStep } from '@/components/wizard/steps/SteveTestStep'
import { SummaryStep } from '@/components/wizard/steps/SummaryStep'
import { WarmupStep } from '@/components/wizard/steps/WarmupStep'
import type { WizardStepProps } from '@/components/wizard/steps/types'

const STEP_COMPONENTS: Array<(props: WizardStepProps) => ReactElement> = [
  CoreFactsStep,
  ChecklistStep,
  WarmupStep,
  GruendungsreiseStep,
  SchmerzStep,
  KIStep,
  SteveTestStep,
  AbschlussStep,
  SummaryStep,
  AssessmentStep,
]

function createFallbackWizardState() {
  return {
    currentStep: 0,
    completedSteps: [] as number[],
    validationErrors: {} as Record<number, string[]>,
  }
}

export function WizardShell() {
  const activeInterview = useInterviewStore((state) => state.getActiveInterview())
  const activeInterviewId = useInterviewStore((state) => state.activeInterviewId)
  const renameInterview = useInterviewStore((state) => state.renameInterview)

  const currentInterviewId = useWizardStore((state) => state.currentInterviewId)
  const byInterview = useWizardStore((state) => state.byInterview)
  const setInterview = useWizardStore((state) => state.setInterview)
  const nextStep = useWizardStore((state) => state.nextStep)
  const prevStep = useWizardStore((state) => state.prevStep)
  const goToStep = useWizardStore((state) => state.goToStep)
  const markComplete = useWizardStore((state) => state.markComplete)

  const [editMode, setEditMode] = useState(false)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    if (activeInterviewId !== currentInterviewId) {
      setInterview(activeInterviewId)
    }
  }, [activeInterviewId, currentInterviewId, setInterview])

  const wizardState =
    (currentInterviewId ? byInterview[currentInterviewId] : undefined) ?? createFallbackWizardState()

  const currentStep = wizardState.currentStep
  const CurrentStep = STEP_COMPONENTS[currentStep] ?? STEP_COMPONENTS[0]
  const progress = ((currentStep + 1) / WIZARD_STEP_LABELS.length) * 100
  const isLastStep = currentStep >= WIZARD_STEP_LABELS.length - 1
  const isStepCompleted = wizardState.completedSteps.includes(currentStep)

  function handleStartEdit() {
    setEditValue(activeInterview.name)
    setEditMode(true)
  }

  function handleSaveEdit() {
    const trimmed = editValue.trim()
    if (trimmed) {
      renameInterview(activeInterviewId, trimmed)
    }
    setEditMode(false)
  }

  function handleOnNext() {
    markComplete(currentStep)
    nextStep()
  }

  return (
    <div className="grid h-full min-h-[calc(100vh-6rem)] gap-4 lg:grid-cols-[260px_1fr]">
      {/* Desktop sidebar - hidden below lg */}
      <aside className="hidden rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1 lg:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-carbon-black/50">Fortschritt</p>
        <p className="mt-1 text-lg font-semibold text-carbon-black">
          Schritt {currentStep + 1} von {WIZARD_STEP_LABELS.length}
        </p>
        <Progress value={progress} className="mt-3" />

        <ol className="mt-4 space-y-1.5">
          {WIZARD_STEP_LABELS.map((label, index) => {
            const active = currentStep === index
            const completed = wizardState.completedSteps.includes(index)

            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-button px-2.5 py-2 text-left text-sm transition',
                    active
                      ? 'bg-botanical-green text-studio-white'
                      : 'text-carbon-black/70 hover:bg-terrazzo-grey/30',
                  )}
                >
                  <span>{label}</span>
                  <span
                    className={cn(
                      'inline-flex size-5 items-center justify-center rounded-full border text-xs',
                      active
                        ? 'border-white/40 text-studio-white'
                        : completed
                          ? 'border-botanical-green bg-botanical-green/10 text-botanical-green'
                          : 'border-terrazzo-grey text-carbon-black/50',
                    )}
                  >
                    {completed ? '✓' : index + 1}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </aside>

      {/* Mobile step indicator - shown below lg */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-1 py-2 lg:hidden">
        {WIZARD_STEP_LABELS.map((label, index) => {
          const active = currentStep === index
          const completed = wizardState.completedSteps.includes(index)

          return (
            <button
              key={label}
              type="button"
              onClick={() => goToStep(index)}
              title={label}
              className={cn(
                'inline-flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition',
                active
                  ? 'border-botanical-green bg-botanical-green text-studio-white'
                  : completed
                    ? 'border-botanical-green bg-botanical-green/10 text-botanical-green'
                    : 'border-terrazzo-grey text-carbon-black/50 hover:bg-terrazzo-grey/30',
              )}
            >
              {completed ? '✓' : index + 1}
            </button>
          )
        })}
      </div>

      <section className="rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1 sm:p-5">
        {/* Inline-editable interview name */}
        <div className="mb-4 flex items-center gap-2">
          {editMode ? (
            <input
              value={editValue}
              onChange={(event) => setEditValue(event.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleSaveEdit()
              }}
              className="min-w-0 flex-1 border-b border-botanical-green bg-transparent text-lg font-semibold text-carbon-black outline-none"
              autoFocus
            />
          ) : (
            <>
              <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-carbon-black">
                {activeInterview.name}
              </h1>
              <button
                type="button"
                onClick={handleStartEdit}
                aria-label="Interview-Name bearbeiten"
                className="rounded p-2 text-carbon-black/40 hover:text-carbon-black/70 transition-colors"
              >
                <Pencil className="size-4" />
              </button>
            </>
          )}
        </div>

        <CurrentStep interviewId={activeInterview.id} interview={activeInterview} onNext={handleOnNext} />

        <div className="mt-6 flex items-center justify-between border-t border-terrazzo-grey pt-4">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            Zurück
          </Button>
          {isLastStep ? (
            <Button
              onClick={() => markComplete(currentStep)}
              disabled={isStepCompleted}
              className={isStepCompleted ? 'opacity-60' : ''}
            >
              {isStepCompleted ? 'Abgeschlossen ✓' : 'Abschließen'}
            </Button>
          ) : (
            <Button
              onClick={() => {
                markComplete(currentStep)
                nextStep()
              }}
            >
              Weiter
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
