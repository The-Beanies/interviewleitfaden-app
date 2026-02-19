import type { InsightsSummary } from '@/types'

import { sectionLabel } from '@/lib/labels'
import { QuoteBadge } from '@/components/ui/quote-badge'

export function QuoteWall({ summary }: { summary: InsightsSummary }) {
  return (
    <div className="rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1">
      <h3 className="text-sm font-semibold text-carbon-black">Zitatwand</h3>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {summary.topQuotes.length ? (
          summary.topQuotes.map((quote) => (
            <blockquote key={quote.id} className="rounded-button border border-terrazzo-grey bg-terrazzo-grey/10 p-3">
              <p className="text-sm text-carbon-black">“{quote.text}”</p>
              <div className="mt-2 flex items-center gap-2">
                <QuoteBadge verbatim={quote.isVerbatim} />
                <span className="text-xs text-carbon-black/50">{sectionLabel(quote.sectionKey)}</span>
              </div>
            </blockquote>
          ))
        ) : (
          <p className="text-sm text-carbon-black/50">Noch keine Zitate vorhanden.</p>
        )}
      </div>
    </div>
  )
}
