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

      {facts.businessDescription && (
        <div className="mt-3 rounded-button border border-terrazzo-grey bg-terrazzo-grey/10 px-3 py-2">
          <p className="type-caption uppercase tracking-wide text-carbon-black/50">Geschäftsbeschreibung</p>
          <p className="type-body text-carbon-black">{facts.businessDescription}</p>
        </div>
      )}

      {facts.additionalFounders && facts.additionalFounders.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="type-caption uppercase tracking-wide text-carbon-black/50">Weitere Gründer:innen</p>
          <div className="grid gap-2 md:grid-cols-2">
            {facts.additionalFounders.map((founder) => (
              <div
                key={founder.id}
                className="rounded-button border border-terrazzo-grey bg-terrazzo-grey/10 px-3 py-2"
              >
                <p className="type-body font-semibold text-carbon-black">{founder.name || '-'}</p>
                <p className="type-caption text-carbon-black/60">
                  {founder.role || '-'} · {founder.contact || '-'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {facts.notes && (
        <div className="mt-3 rounded-button border border-terrazzo-grey bg-terrazzo-grey/10 px-3 py-2">
          <p className="type-caption uppercase tracking-wide text-carbon-black/50">Notizen</p>
          <p className="type-body whitespace-pre-wrap text-carbon-black">{facts.notes}</p>
        </div>
      )}
    </SectionWrapper>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className={`rounded-button border border-terrazzo-grey bg-terrazzo-grey/10 px-3 py-2${!value ? ' print:hidden' : ''}`}>
      <p className="type-caption uppercase tracking-wide text-carbon-black/50">{label}</p>
      <p className="type-body text-carbon-black">{value || '-'}</p>
    </div>
  )
}
