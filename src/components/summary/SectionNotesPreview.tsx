import type { InterviewSectionKey, SectionNote } from '@/types'

import { sectionLabel } from '@/lib/labels'
import { SECTION_KEYS } from '@/config/defaults'
import { SectionWrapper } from '@/components/summary/SectionWrapper'

interface SectionNotesPreviewProps {
  sectionNotes: Record<InterviewSectionKey, SectionNote>
}

export function SectionNotesPreview({ sectionNotes }: SectionNotesPreviewProps) {
  const nonEmpty = SECTION_KEYS.filter(
    (key) => sectionNotes[key].content || sectionNotes[key].quotes.length > 0,
  )

  if (nonEmpty.length === 0) return null

  return (
    <SectionWrapper id="section-notes" title="Abschnittsnotizen">
      <div className="space-y-6">
        {nonEmpty.map((key) => {
          const note = sectionNotes[key]
          return (
            <div key={key}>
              <h3 className="text-sm font-semibold text-carbon-black">{sectionLabel(key)}</h3>
              {note.content ? (
                <p className="mt-1 whitespace-pre-wrap text-sm text-carbon-black/80">
                  {note.content}
                </p>
              ) : null}
              {note.quotes.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {note.quotes.map((quote) => (
                    <li
                      key={quote.id}
                      className="border-l-2 border-botanical-green pl-3 text-sm italic text-carbon-black/70"
                    >
                      &ldquo;{quote.text}&rdquo;
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
