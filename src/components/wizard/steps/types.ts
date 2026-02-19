import type { Interview } from '@/types'

export interface WizardStepProps {
  interviewId: string
  interview: Interview
  onNext?: () => void
}
