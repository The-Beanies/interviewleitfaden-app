'use client'

import { useMemo } from 'react'

import { AISuggestButton } from '@/components/wizard/AISuggestButton'
import { mockAIService } from '@/services/ai-mock'
import { useInterviewStore } from '@/stores/interview-store'
import { useInsightsStore } from '@/stores/insights-store'

import { AIAttitudeOverview } from './AIAttitudeOverview'
import { InterviewTimeline } from './InterviewTimeline'
import { PainPointAggregation } from './PainPointAggregation'
import { QuoteWall } from './QuoteWall'
import { ScoreOverview } from './ScoreOverview'
import { SegmentBreakdown } from './SegmentBreakdown'
import { SteveInterestChart } from './SteveInterestChart'
import { WorkaroundPatterns } from './WorkaroundPatterns'

export function InsightsDashboard() {
  const interviews = useInterviewStore((state) => state.interviews)
  const summary = useMemo(() => useInsightsStore.getState().getInsightsSummary(), [interviews])

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-6 md:px-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="type-h2 text-carbon-black">Auswertungs-Dashboard</h1>
          <p className="type-body text-carbon-black/60">
            Aggregierte Muster aus {summary.totalInterviews} Interviews
          </p>
        </div>

        <AISuggestButton
          label="Auswertung synthetisieren"
          onSuggest={() =>
            mockAIService.synthesizeInsights({
              interviews: interviews.map((interview) => ({
                coreFacts: interview.config.coreFacts,
                summary: interview.config.summary,
              })),
            })
          }
          onApply={() => {
            // Aggregation wird im Store berechnet; Button dient als explorative KI-Unterstützung.
          }}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SegmentBreakdown summary={summary} />
        <SteveInterestChart summary={summary} />
        <PainPointAggregation summary={summary} />
        <WorkaroundPatterns summary={summary} />
        <AIAttitudeOverview summary={summary} />
        <ScoreOverview interviews={interviews} />
      </div>

      <InterviewTimeline />
      <QuoteWall summary={summary} />
    </div>
  )
}
