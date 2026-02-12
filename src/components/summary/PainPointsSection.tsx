import type { PainPoint } from '@/types'

import { SectionWrapper } from '@/components/summary/SectionWrapper'

export function PainPointsSection({ painPoints }: { painPoints: PainPoint[] }) {
  return (
    <SectionWrapper id="pain-points" title="Top Schmerzpunkte">
      {painPoints.length ? (
        <div className="space-y-3">
          {[...painPoints]
            .sort((a, b) => a.rank - b.rank)
            .map((point) => (
              <article key={point.id} className="rounded-card border border-terrazzo-grey bg-terrazzo-grey/10 p-4">
                <p className="text-sm font-semibold text-carbon-black">
                  #{point.rank} {point.description || 'Ohne Beschreibung'}
                </p>
                <p className="mt-1 text-sm text-carbon-black/70">Intensität: {point.intensity}/5</p>
                <p className="text-sm text-carbon-black/70">Frequenz: {point.frequency || '-'}</p>
                <p className="text-sm text-carbon-black/70">Aktuelle Lösung: {point.currentSolution || '-'}</p>
                <p className="text-sm text-carbon-black/70">Kosten: {point.costOfProblem || '-'}</p>
              </article>
            ))}
        </div>
      ) : (
        <p className="text-sm text-carbon-black/50">Noch keine Schmerzpunkte erfasst.</p>
      )}
    </SectionWrapper>
  )
}
