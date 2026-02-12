import type { InsightsSummary } from '@/types'

export function WorkaroundPatterns({ summary }: { summary: InsightsSummary }) {
  return (
    <div className="rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1">
      <h3 className="text-sm font-semibold text-carbon-black">Muster bei Umgehungslösungen</h3>
      <ul className="mt-3 space-y-2 text-sm text-carbon-black/80">
        {summary.commonWorkarounds.length ? (
          summary.commonWorkarounds.map((item) => (
            <li key={item.description} className="flex items-center justify-between rounded-button border border-terrazzo-grey px-3 py-2">
              <span>{item.description}</span>
              <span className="font-semibold">{item.count}</span>
            </li>
          ))
        ) : (
          <li className="list-none rounded-button border border-dashed border-terrazzo-grey bg-terrazzo-grey/5 px-3 py-4 text-center">
            <p className="text-carbon-black/50">Keine Umgehungslösungen erfasst.</p>
            <p className="mt-1 text-xs text-carbon-black/40">
              Workarounds werden unter &quot;Schmerz &amp; Umgehungslösungen&quot; dokumentiert.
            </p>
          </li>
        )}
      </ul>
    </div>
  )
}
