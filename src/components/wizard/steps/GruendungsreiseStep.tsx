'use client'

import { AISuggestButton } from '@/components/wizard/AISuggestButton'
import { mockAIService } from '@/services/ai-mock'
import { useInterviewStore } from '@/stores/interview-store'

import { SectionStepBase } from './SectionStepBase'

export function GruendungsreiseStep() {
  const interview = useInterviewStore((state) => state.getActiveInterview())
  const updateJTBD = useInterviewStore((state) => state.updateJTBD)

  return (
    <div className="space-y-4">
      <SectionStepBase sectionKey="gruendungsreise" />
      <div className="rounded-card border border-terrazzo-grey bg-terrazzo-grey/10 p-3">
        <p className="mb-2 text-sm font-semibold text-carbon-black">KI-Unterstützung</p>
        <AISuggestButton
          label="JTBD analysieren"
          onSuggest={() =>
            mockAIService.generateJTBD({
              gruendungsreiseNotes: interview.config.sectionNotes.gruendungsreise.content,
              schmerzNotes: interview.config.sectionNotes.schmerz_workarounds.content,
            })
          }
          onApply={(jtbd) => updateJTBD(jtbd)}
        />
      </div>
    </div>
  )
}
