'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { useInterviewStore } from '@/stores/interview-store'

import type { WizardStepProps } from './types'

export function ChecklistStep({ interview }: WizardStepProps) {
  const updateChecklist = useInterviewStore((state) => state.updateChecklist)

  return (
    <div className="space-y-4">
      <h2 className="type-h4 text-carbon-black">Checkliste vor Interview</h2>
      <p className="type-body text-carbon-black/60">
        Markiere alle Punkte, die vor dem Gespraech vorbereitet sind.
      </p>
      <div className="space-y-2">
        {interview.config.checklist.map((item) => (
          <div key={item.id} className="rounded-card border border-terrazzo-grey bg-studio-white p-3">
            <Checkbox
              id={item.id}
              checked={item.checked}
              onChange={(event) => updateChecklist(item.id, event.target.checked)}
              label={item.label}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
