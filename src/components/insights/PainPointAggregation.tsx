import type { InsightsSummary } from '@/types'

export function PainPointAggregation({ summary }: { summary: InsightsSummary }) {
  return (
    <div className="rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1">
      <h3 className="text-sm font-semibold text-carbon-black">Top Schmerzpunkte</h3>
      <div className="mt-3 space-y-2">
        {summary.topPainPoints.length ? (
          summary.topPainPoints.map((item) => (
            <div key={item.description} className="rounded-button border border-terrazzo-grey bg-terrazzo-grey/10 p-2 text-sm">
              <p className="font-medium text-carbon-black">{item.description}</p>
              <p className="text-carbon-black/60">
                {item.count} Nennungen · Ø {item.avgIntensity.toFixed(2)}/5
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-button border border-dashed border-terrazzo-grey bg-terrazzo-grey/5 px-3 py-4 text-center">
            <p className="text-sm text-carbon-black/50">Noch keine Schmerzpunkte erfasst.</p>
            <p className="mt-1 text-xs text-carbon-black/40">
              Erfasse Schmerzpunkte im Reiter &quot;Bearbeiten&quot; unter Schritt 5.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
