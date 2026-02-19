import type { SteveReaction } from '@/types'

import { steveInterestLabel } from '@/lib/labels'
import { SectionWrapper } from '@/components/summary/SectionWrapper'

export function SteveReactionSection({ reaction }: { reaction: SteveReaction }) {
  return (
    <SectionWrapper id="steve-reaction" title="STEVE-Reaktion">
      <p className="type-body">
        <strong>Erste Reaktion:</strong> {reaction.firstReaction || '-'}
      </p>
      <p className="type-body">
        <strong>Interesse:</strong> {steveInterestLabel(reaction.interestLevel)}
      </p>
      <p className="type-body">
        <strong>Interessantestes Feature:</strong> {reaction.mostInterestingFeature || '-'}
      </p>
      <p className="type-body">
        <strong>Anwendungsfall:</strong> {reaction.useCase || '-'}
      </p>
      <p className="type-body">
        <strong>Zahlungsbereitschaft/Monat:</strong> {reaction.willingnessToPayMonthly || '-'}
      </p>
      <p className="type-body">
        <strong>Bedenken:</strong> {reaction.concerns || '-'}
      </p>
    </SectionWrapper>
  )
}
