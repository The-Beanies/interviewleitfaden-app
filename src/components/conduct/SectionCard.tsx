'use client'

import { useMemo } from 'react'

import { INTERVIEW_SECTIONS } from '@/config/defaults'
import { Textarea } from '@/components/ui/textarea'
import { useInterviewStore } from '@/stores/interview-store'
import type { InterviewSectionKey } from '@/types'

import { QuestionList } from './QuestionList'
import { QuoteList } from './QuoteList'

export function SectionCard({ sectionKey }: { sectionKey: InterviewSectionKey }) {
  const interview = useInterviewStore((state) => state.getActiveInterview())
  const updateSectionNote = useInterviewStore((state) => state.updateSectionNote)

  const section = useMemo(
    () => INTERVIEW_SECTIONS.find((item) => item.key === sectionKey),
    [sectionKey],
  )

  if (!section) return null

  const segment = interview.config.coreFacts.segment
  const note = interview.config.sectionNotes[sectionKey]

  const questions = section.questions.filter(
    (question) => question.segment === 'both' || question.segment === segment,
  )

  return (
    <div className="space-y-4 rounded-card border border-terrazzo-grey bg-studio-white p-4 shadow-level1">
      <div>
        <h2 className="type-h3 text-carbon-black">{section.label}</h2>
        <p className="type-body text-carbon-black/60">{section.description}</p>
      </div>

      <QuestionList questions={questions} />

      <div className="space-y-2">
        <p className="text-sm font-semibold text-carbon-black">Live-Notizen</p>
        <Textarea
          rows={9}
          value={note.content}
          onChange={(event) => updateSectionNote(sectionKey, event.target.value)}
          className="min-h-[210px] text-base"
          placeholder="Notizen während des Gesprächs..."
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-carbon-black">Zitate</p>
        <QuoteList quotes={note.quotes} />
      </div>
    </div>
  )
}
