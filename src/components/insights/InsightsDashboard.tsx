'use client'

import { useMemo } from 'react'
import dynamic from 'next/dynamic'

import { useInterviewStore } from '@/stores/interview-store'
import { useInsightsStore } from '@/stores/insights-store'

const AIAttitudeOverview = dynamic(() => import('./AIAttitudeOverview').then((m) => m.AIAttitudeOverview), { ssr: false })
const InterviewTimeline = dynamic(() => import('./InterviewTimeline').then((m) => m.InterviewTimeline), { ssr: false })
const PainPointAggregation = dynamic(() => import('./PainPointAggregation').then((m) => m.PainPointAggregation), { ssr: false })
const QuoteWall = dynamic(() => import('./QuoteWall').then((m) => m.QuoteWall), { ssr: false })
const ScoreOverview = dynamic(() => import('./ScoreOverview').then((m) => m.ScoreOverview), { ssr: false })
const SegmentBreakdown = dynamic(() => import('./SegmentBreakdown').then((m) => m.SegmentBreakdown), { ssr: false })
const SteveInterestChart = dynamic(() => import('./SteveInterestChart').then((m) => m.SteveInterestChart), { ssr: false })
const WorkaroundPatterns = dynamic(() => import('./WorkaroundPatterns').then((m) => m.WorkaroundPatterns), { ssr: false })

export function InsightsDashboard() {
  const interviews = useInterviewStore((state) => state.interviews)
  const summary = useMemo(() => useInsightsStore.getState().getInsightsSummary(), [interviews])

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 py-6 md:px-8">
      <div>
        <h1 className="type-h2 text-carbon-black">Auswertungs-Dashboard</h1>
        <p className="type-body text-carbon-black/60">
          Aggregierte Muster aus {summary.totalInterviews} Interviews
        </p>
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
