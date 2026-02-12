import type { InsightsSummary } from '@/types'

export function AIAttitudeOverview({ summary }: { summary: InsightsSummary }) {
  const total = Math.max(1, summary.totalInterviews)

  return (
    <div className="rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1">
      <h3 className="text-sm font-semibold text-carbon-black">KI-Haltung</h3>
      <div className="mt-3 space-y-2 text-sm text-carbon-black/80">
        {Object.entries(summary.aiAttitudeDistribution).map(([key, count]) => {
          const pct = (count / total) * 100
          return (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between">
                <span>{key}</span>
                <span>
                  {count} ({pct.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-terrazzo-grey">
                {count > 0 && (
                  <div
                    className="h-full rounded-full bg-botanical-green transition-all"
                    style={{ width: `${Math.max(pct, 2)}%` }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
