'use client'

import { SectionStepBase } from './SectionStepBase'
import type { WizardStepProps } from './types'

export function AbschlussStep({ onNext }: WizardStepProps) {
  return <SectionStepBase sectionKey="abschluss" onMarkComplete={onNext} />
}
