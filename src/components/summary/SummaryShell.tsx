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

function hasJTBDData(jtbd: Interview['config']['summary']['jtbd']) {
  return (
    jtbd.trigger ||
    jtbd.pushFactors.length > 0 ||
    jtbd.pullFactors.length > 0 ||
    jtbd.anxiety.length > 0 ||
    jtbd.habit.length > 0
  )
}

function hasSteveReactionData(reaction: Interview['config']['summary']['steveReaction']) {
  return (
    reaction.firstReaction ||
    reaction.mostInterestingFeature ||
    reaction.useCase ||
    reaction.willingnessToPayMonthly ||
    reaction.concerns ||
    reaction.quotesAboutSteve.length > 0
  )
}

function hasSectionNotesData(sectionNotes: Interview['config']['sectionNotes']) {
  return Object.values(sectionNotes).some((note) => note.content || note.quotes.length > 0)
}

export function SummaryShell({ interview }: { interview: Interview }) {
  const summary = interview.config.summary
  const quotes = summary.keyQuotes.length ? summary.keyQuotes : interview.config.allQuotes

  return (
    <div className="bg-studio-white text-carbon-black">
      <CoverSection interview={interview} />
      <CoreFactsSection facts={interview.config.coreFacts} />
      <ChecklistPreview checklist={interview.config.checklist} />
      {hasJTBDData(summary.jtbd) && <JTBDSection jtbd={summary.jtbd} />}
      {summary.painPoints.length > 0 && <PainPointsSection painPoints={summary.painPoints} />}
      {summary.workaroundsAttempted.length > 0 && <WorkaroundsSection workarounds={summary.workaroundsAttempted} />}
      <AIAttitudeSection
        attitude={summary.aiAttitude}
        tools={summary.aiToolsUsed}
        barriers={summary.aiBarriers}
      />
      {hasSteveReactionData(summary.steveReaction) && <SteveReactionSection reaction={summary.steveReaction} />}
      {quotes.length > 0 && <KeyQuotesSection quotes={quotes} />}
      {hasSectionNotesData(interview.config.sectionNotes) && <SectionNotesPreview sectionNotes={interview.config.sectionNotes} />}
      <AssessmentSection assessment={summary.overallAssessment} />
    </div>
  )
}
