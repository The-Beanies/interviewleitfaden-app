import type { InsightsSummary } from '@/types'

const colors: Record<string, string> = {
  stark: '#6d8b6e',
  hoeflich: '#e6c8a6',
  skeptisch: '#d94b4b',
}

export function SteveInterestChart({ summary }: { summary: InsightsSummary }) {
  const entries = Object.entries(summary.steveInterestDistribution)
  const total = Math.max(1, entries.reduce((sum, [, value]) => sum + value, 0))

  return (
    <div className="rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1">
      <h3 className="text-sm font-semibold text-carbon-black">STEVE-Interesse</h3>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-terrazzo-grey">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="h-full"
            style={{ width: `${(value / total) * 100}%`, backgroundColor: colors[key] }}
          />
        ))}
      </div>
      <div className="mt-3 space-y-1 text-sm text-carbon-black/80">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span>{key === 'hoeflich' ? 'höflich' : key}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
