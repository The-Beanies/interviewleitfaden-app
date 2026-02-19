import type { Quote } from '@/types'

import { sectionLabel } from '@/lib/labels'
import { QuoteBadge } from '@/components/ui/quote-badge'
import { SectionWrapper } from '@/components/summary/SectionWrapper'

export function KeyQuotesSection({ quotes }: { quotes: Quote[] }) {
  return (
    <SectionWrapper id="quotes" title="Schlüsselzitate">
      {quotes.length ? (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <blockquote key={quote.id} className="rounded-card border border-terrazzo-grey bg-terrazzo-grey/10 p-4">
              <p className="type-body text-carbon-black">“{quote.text}”</p>
              <div className="mt-2 flex items-center gap-2">
                <QuoteBadge verbatim={quote.isVerbatim} />
                <span className="type-caption text-carbon-black/50">{sectionLabel(quote.sectionKey)}</span>
              </div>
            </blockquote>
          ))}
        </div>
      ) : (
        <p className="text-sm text-carbon-black/50">Keine Zitate vorhanden.</p>
      )}
    </SectionWrapper>
  )
}
