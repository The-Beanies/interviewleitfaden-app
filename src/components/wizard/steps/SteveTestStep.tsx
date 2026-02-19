'use client'

import { STEVE_PITCH_TEXT } from '@/config/defaults'

import { SectionStepBase } from './SectionStepBase'
import type { WizardStepProps } from './types'

export function SteveTestStep({ onNext }: WizardStepProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-card border border-botanical-green/40 bg-botanical-green/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-botanical-green">STEVE Pitch (30 Sek.)</p>
        <p className="mt-2 text-sm text-carbon-black">{STEVE_PITCH_TEXT}</p>
      </div>
      <SectionStepBase sectionKey="konzepttest_steve" onMarkComplete={onNext} />
    </div>
  )
}
