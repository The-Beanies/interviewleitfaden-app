import type { OverallAssessment } from '@/types'

import { followUpPriorityLabel } from '@/lib/labels'
import { ScoreIndicator } from '@/components/ui/score-indicator'
import { SectionWrapper } from '@/components/summary/SectionWrapper'

export function AssessmentSection({ assessment }: { assessment: OverallAssessment }) {
  return (
    <SectionWrapper id="assessment" title="Gesamtbewertung">
      <div className="grid gap-3 md:grid-cols-3">
        <ScoreIndicator label="Relevanz" value={assessment.relevanceScore} />
        <ScoreIndicator label="Schmerzintensität" value={assessment.painIntensityScore} />
        <ScoreIndicator label="bean:up-Fit" value={assessment.steveFitScore} />
      </div>
      <p className="type-body">
        <strong>Nachfass-Priorität:</strong> {followUpPriorityLabel(assessment.followUpPriority)}
      </p>
      <p className="type-body text-carbon-black/80">{assessment.notes || 'Keine Zusatznotizen.'}</p>
    </SectionWrapper>
  )
}
