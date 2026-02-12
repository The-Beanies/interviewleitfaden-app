'use client'

import { useEffect, type ReactElement } from 'react'

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

  const currentInterviewId = useWizardStore((state) => state.currentInterviewId)
  const byInterview = useWizardStore((state) => state.byInterview)
  const setInterview = useWizardStore((state) => state.setInterview)
  const nextStep = useWizardStore((state) => state.nextStep)
  const prevStep = useWizardStore((state) => state.prevStep)
  const goToStep = useWizardStore((state) => state.goToStep)
  const markComplete = useWizardStore((state) => state.markComplete)

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

  return (
    <div className="grid h-full min-h-[calc(100vh-6rem)] gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1">
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

      <section className="rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1 sm:p-5">
        <CurrentStep interviewId={activeInterview.id} interview={activeInterview} onNext={nextStep} />

        <div className="mt-6 flex items-center justify-between border-t border-terrazzo-grey pt-4">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
            Zurück
          </Button>
          <Button
            onClick={() => {
              markComplete(currentStep)
              if (currentStep < WIZARD_STEP_LABELS.length - 1) {
                nextStep()
              }
            }}
            disabled={currentStep >= WIZARD_STEP_LABELS.length - 1}
          >
            Weiter
          </Button>
        </div>
      </section>
    </div>
  )
}
