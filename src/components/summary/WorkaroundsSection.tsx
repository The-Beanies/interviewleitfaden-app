import { SectionWrapper } from '@/components/summary/SectionWrapper'

export function WorkaroundsSection({ workarounds }: { workarounds: string[] }) {
  return (
    <SectionWrapper id="workarounds" title="Umgehungslösungen">
      {workarounds.length ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-carbon-black/80">
          {workarounds.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-carbon-black/50">Keine Umgehungslösungen dokumentiert.</p>
      )}
    </SectionWrapper>
  )
}
