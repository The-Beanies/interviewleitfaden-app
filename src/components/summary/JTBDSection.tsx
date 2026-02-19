import type { JTBDAnalysis } from '@/types'

import { SectionWrapper } from '@/components/summary/SectionWrapper'

export function JTBDSection({ jtbd }: { jtbd: JTBDAnalysis }) {
  return (
    <SectionWrapper id="jtbd" title="JTBD-Analyse">
      <p className="type-body">
        <strong>Trigger:</strong> {jtbd.trigger || '-'}
      </p>
      <List title="Push-Faktoren" items={jtbd.pushFactors} />
      <List title="Pull-Faktoren" items={jtbd.pullFactors} />
      <List title="Anxiety" items={jtbd.anxiety} />
      <List title="Habit" items={jtbd.habit} />
    </SectionWrapper>
  )
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-1 text-sm font-semibold text-carbon-black">{title}</h3>
      {items.length ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-carbon-black/80">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-carbon-black/50">Keine Einträge.</p>
      )}
    </div>
  )
}
