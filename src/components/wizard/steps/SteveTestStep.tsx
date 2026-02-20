'use client'

import { BEANUP_PITCH_TEXT } from '@/config/defaults'

import { SectionStepBase } from './SectionStepBase'
import type { WizardStepProps } from './types'

export function SteveTestStep(_props: WizardStepProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-card border border-botanical-green/40 bg-botanical-green/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-botanical-green">bean:up Pitch (30 Sek.)</p>
        <p className="mt-2 text-sm text-carbon-black">{BEANUP_PITCH_TEXT}</p>
      </div>
      <SectionStepBase sectionKey="konzepttest_steve" />
    </div>
  )
}
