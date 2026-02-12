import type { CoreFacts } from '@/types'

import { segmentLabel } from '@/lib/labels'
import { SectionWrapper } from '@/components/summary/SectionWrapper'

export function CoreFactsSection({ facts }: { facts: CoreFacts }) {
  return (
    <SectionWrapper id="core-facts" title="Basisdaten">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Interviewpartner:in" value={facts.intervieweeName} />
        <Field label="Segment" value={segmentLabel(facts.segment)} />
        <Field label="Branche" value={facts.industry} />
        <Field label="Gründungsdatum" value={facts.foundingDate} />
        <Field label="Teamgröße" value={facts.teamSize} />
        <Field label="Ort" value={facts.location} />
        <Field label="E-Mail" value={facts.contactEmail} />
        <Field label="Telefon" value={facts.contactPhone} />
        <Field label="Empfohlen von" value={facts.referredBy} />
      </div>
    </SectionWrapper>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-button border border-terrazzo-grey bg-terrazzo-grey/10 px-3 py-2">
      <p className="type-caption uppercase tracking-wide text-carbon-black/50">{label}</p>
      <p className="type-body text-carbon-black">{value || '-'}</p>
    </div>
  )
}
