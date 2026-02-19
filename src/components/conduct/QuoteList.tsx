import type { Quote } from '@/types'

import { QuoteBadge } from '@/components/ui/quote-badge'

export function QuoteList({ quotes }: { quotes: Quote[] }) {
  if (!quotes.length) {
    return <p className="text-sm text-carbon-black/50">Noch keine Zitate im Abschnitt.</p>
  }

  return (
    <div className="space-y-2">
      {quotes.slice(0, 5).map((quote) => (
        <div key={quote.id} className="rounded-card border border-terrazzo-grey bg-terrazzo-grey/10 p-3">
          <p className="text-sm text-carbon-black">“{quote.text}”</p>
          <div className="mt-1">
            <QuoteBadge verbatim={quote.isVerbatim} />
          </div>
        </div>
      ))}
    </div>
  )
}
