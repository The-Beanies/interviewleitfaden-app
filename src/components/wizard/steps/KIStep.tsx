'use client'

import { SectionStepBase } from './SectionStepBase'
import type { WizardStepProps } from './types'

export function KIStep({ onNext }: WizardStepProps) {
  return <SectionStepBase sectionKey="ki_automatisierung" onMarkComplete={onNext} />
}
