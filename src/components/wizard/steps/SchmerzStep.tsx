'use client'

import { AISuggestButton } from '@/components/wizard/AISuggestButton'
import { mockAIService } from '@/services/ai-mock'
import { useInterviewStore } from '@/stores/interview-store'

import { SectionStepBase } from './SectionStepBase'

export function SchmerzStep() {
  const interview = useInterviewStore((state) => state.getActiveInterview())
  const updateSummary = useInterviewStore((state) => state.updateSummary)

  return (
    <div className="space-y-4">
      <SectionStepBase sectionKey="schmerz_workarounds" />
      <div className="rounded-card border border-terrazzo-grey bg-terrazzo-grey/10 p-3">
        <p className="mb-2 text-sm font-semibold text-carbon-black">KI-Unterstützung</p>
        <AISuggestButton
          label="Schmerzpunkte extrahieren"
          onSuggest={() =>
            mockAIService.extractPainPoints({
              sectionNotes: interview.config.sectionNotes.schmerz_workarounds.content,
              quotes: interview.config.sectionNotes.schmerz_workarounds.quotes,
            })
          }
          onApply={(painPoints) => updateSummary({ painPoints })}
        />
      </div>
    </div>
  )
}
