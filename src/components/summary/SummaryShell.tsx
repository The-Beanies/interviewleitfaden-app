'use client'

import type { Interview } from '@/types'

import { AssessmentSection } from '@/components/summary/AssessmentSection'
import { AIAttitudeSection } from '@/components/summary/AIAttitudeSection'
import { ChecklistPreview } from '@/components/summary/ChecklistPreview'
import { CoreFactsSection } from '@/components/summary/CoreFactsSection'
import { CoverSection } from '@/components/summary/CoverSection'
import { JTBDSection } from '@/components/summary/JTBDSection'
import { KeyQuotesSection } from '@/components/summary/KeyQuotesSection'
import { PainPointsSection } from '@/components/summary/PainPointsSection'
import { SectionNotesPreview } from '@/components/summary/SectionNotesPreview'
import { SteveReactionSection } from '@/components/summary/SteveReactionSection'
import { WorkaroundsSection } from '@/components/summary/WorkaroundsSection'

export function SummaryShell({ interview }: { interview: Interview }) {
  const summary = interview.config.summary

  return (
    <div className="bg-studio-white text-carbon-black">
      <CoverSection interview={interview} />
      <CoreFactsSection facts={interview.config.coreFacts} />
      <ChecklistPreview checklist={interview.config.checklist} />
      <JTBDSection jtbd={summary.jtbd} />
      <PainPointsSection painPoints={summary.painPoints} />
      <WorkaroundsSection workarounds={summary.workaroundsAttempted} />
      <AIAttitudeSection
        attitude={summary.aiAttitude}
        tools={summary.aiToolsUsed}
        barriers={summary.aiBarriers}
      />
      <SteveReactionSection reaction={summary.steveReaction} />
      <KeyQuotesSection quotes={summary.keyQuotes.length ? summary.keyQuotes : interview.config.allQuotes} />
      <SectionNotesPreview sectionNotes={interview.config.sectionNotes} />
      <AssessmentSection assessment={summary.overallAssessment} />
    </div>
  )
}
