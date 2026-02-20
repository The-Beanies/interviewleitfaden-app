import type { Interview } from '@/types'

import { ScoreIndicator } from '@/components/ui/score-indicator'

export function ScoreOverview({ interviews }: { interviews: Interview[] }) {
  const stats = interviews.reduce(
    (acc, interview) => {
      acc.relevance += interview.config.summary.overallAssessment.relevanceScore
      acc.pain += interview.config.summary.overallAssessment.painIntensityScore
      acc.fit += interview.config.summary.overallAssessment.steveFitScore
      return acc
    },
    { relevance: 0, pain: 0, fit: 0 },
  )

  const count = Math.max(1, interviews.length)

  return (
    <div className="rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1">
      <h3 className="text-sm font-semibold text-carbon-black">Score-Überblick</h3>
      <div className="mt-3 space-y-3">
        <ScoreIndicator label="Relevanz (Ø)" value={stats.relevance / count} />
        <ScoreIndicator label="Schmerz (Ø)" value={stats.pain / count} />
        <ScoreIndicator label="bean:up-Fit (Ø)" value={stats.fit / count} />
      </div>
    </div>
  )
}
