import { aiAttitudeLabel } from '@/lib/labels'
import type { AIAttitude } from '@/types'
import { SectionWrapper } from '@/components/summary/SectionWrapper'

export function AIAttitudeSection({
  attitude,
  tools,
  barriers,
}: {
  attitude: AIAttitude
  tools: string[]
  barriers: string[]
}) {
  return (
    <SectionWrapper id="ai-attitude" title="KI & Automatisierung">
      <p className="type-body">
        <strong>Haltung:</strong> {aiAttitudeLabel(attitude)}
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <List title="Genutzte Tools" items={tools} />
        <List title="Barrieren" items={barriers} />
      </div>
    </SectionWrapper>
  )
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-card border border-terrazzo-grey bg-terrazzo-grey/10 p-3">
      <p className="mb-2 text-sm font-semibold text-carbon-black">{title}</p>
      {items.length ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-carbon-black/80">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-carbon-black/50">Keine Angaben.</p>
      )}
    </div>
  )
}
