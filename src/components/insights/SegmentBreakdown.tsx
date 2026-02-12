import type { InsightsSummary } from '@/types'

export function SegmentBreakdown({ summary }: { summary: InsightsSummary }) {
  const total = summary.totalInterviews || 1
  const retrospektiv = summary.segmentBreakdown.retrospektiv
  const aktuell = summary.segmentBreakdown.aktuell_gruendend

  return (
    <div className="rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1">
      <h3 className="text-sm font-semibold text-carbon-black">Segmentverteilung</h3>
      <div className="mt-3 space-y-2 text-sm text-carbon-black/80">
        <Row label="Retrospektiv" value={retrospektiv} percentage={(retrospektiv / total) * 100} />
        <Row label="Aktuell gründend" value={aktuell} percentage={(aktuell / total) * 100} />
      </div>
    </div>
  )
}

function Row({ label, value, percentage }: { label: string; value: number; percentage: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span>{label}</span>
        <span>
          {value} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-terrazzo-grey">
        {value > 0 && (
          <div
            className="h-full rounded-full bg-botanical-green transition-all"
            style={{ width: `${Math.max(percentage, 2)}%` }}
          />
        )}
      </div>
    </div>
  )
}
