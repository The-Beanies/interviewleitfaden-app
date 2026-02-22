'use client'

import { useMemo, useState } from 'react'

import { Plus, Trash2 } from 'lucide-react'
import { INTERVIEW_SECTIONS } from '@/config/defaults'
import { Textarea } from '@/components/ui/textarea'
import { useInterviewStore } from '@/stores/interview-store'
import type { InterviewSectionKey } from '@/types'

import { QuestionList } from './QuestionList'
import { QuoteList } from './QuoteList'

export function SectionCard({ sectionKey }: { sectionKey: InterviewSectionKey }) {
  const interview = useInterviewStore((state) => state.getActiveInterview())!
  const updateSectionNote = useInterviewStore((state) => state.updateSectionNote)
  const addCustomQuestion = useInterviewStore((state) => state.addCustomQuestion)
  const removeCustomQuestion = useInterviewStore((state) => state.removeCustomQuestion)

  const [customQuestionText, setCustomQuestionText] = useState('')

  const section = useMemo(
    () => INTERVIEW_SECTIONS.find((item) => item.key === sectionKey),
    [sectionKey],
  )

  if (!section) return null

  const segment = interview.config.coreFacts.segment
  const note = interview.config.sectionNotes[sectionKey]
  const customQuestions = interview.config.customQuestions?.[sectionKey] ?? []

  const questions = section.questions.filter(
    (question) => question.segment === 'both' || question.segment === segment,
  )

  function handleAddCustomQuestion() {
    const trimmed = customQuestionText.trim()
    if (!trimmed) return
    addCustomQuestion(sectionKey, trimmed)
    setCustomQuestionText('')
  }

  return (
    <div className="space-y-2 rounded-card border border-terrazzo-grey bg-studio-white p-3 shadow-level1">
      <div>
        <h2 className="type-h3 text-carbon-black">{section.label}</h2>
        <p className="type-body text-carbon-black/60">{section.description}</p>
      </div>

      <QuestionList questions={questions} />

      {/* Custom questions */}
      {customQuestions.length > 0 && (
        <ul className="space-y-2">
          {customQuestions.map((question) => (
            <li
              key={question.id}
              className="flex items-start gap-2 rounded-card border border-botanical-green/40 bg-botanical-green/5 p-3"
            >
              <span className="flex-1 text-base text-carbon-black/85">{question.text}</span>
              <span className="shrink-0 rounded bg-botanical-green/20 px-1.5 py-0.5 text-[11px] font-semibold text-botanical-green">
                Eigene Frage
              </span>
              <button
                type="button"
                onClick={() => removeCustomQuestion(sectionKey, question.id)}
                aria-label="Frage entfernen"
                className="shrink-0 rounded p-2 text-carbon-black/40 hover:text-error transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add custom question */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customQuestionText}
          onChange={(event) => setCustomQuestionText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleAddCustomQuestion()
          }}
          placeholder="Eigene Frage hinzufügen..."
          className="flex-1 rounded-button border border-terrazzo-grey bg-studio-white px-3 py-2 text-sm text-carbon-black placeholder:text-carbon-black/40 outline-none focus:border-botanical-green"
        />
        <button
          type="button"
          onClick={handleAddCustomQuestion}
          aria-label="Eigene Frage hinzufügen"
          className="rounded p-2 text-botanical-green hover:bg-botanical-green/10 transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-carbon-black">Live-Notizen</p>
        <Textarea
          rows={5}
          value={note.content}
          onChange={(event) => updateSectionNote(sectionKey, event.target.value)}
          className="min-h-[120px] text-base"
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
