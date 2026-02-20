'use client'

import { useMemo, useState } from 'react'

import { Plus, Trash2 } from 'lucide-react'
import { INTERVIEW_SECTIONS } from '@/config/defaults'
import { TOOLTIP_TEXT } from '@/config/tooltips'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { QuoteBadge } from '@/components/ui/quote-badge'
import { Textarea } from '@/components/ui/textarea'
import { segmentLabel } from '@/lib/labels'
import { useInterviewStore } from '@/stores/interview-store'
import type { InterviewSectionKey } from '@/types'

interface SectionStepBaseProps {
  sectionKey: InterviewSectionKey
}

export function SectionStepBase({ sectionKey }: SectionStepBaseProps) {
  const interview = useInterviewStore((state) => state.getActiveInterview())
  const updateSectionNote = useInterviewStore((state) => state.updateSectionNote)
  const addQuote = useInterviewStore((state) => state.addQuote)
  const addCustomQuestion = useInterviewStore((state) => state.addCustomQuestion)
  const removeCustomQuestion = useInterviewStore((state) => state.removeCustomQuestion)

  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false)
  const [quoteText, setQuoteText] = useState('')
  const [quoteVerbatim, setQuoteVerbatim] = useState(true)
  const [customQuestionText, setCustomQuestionText] = useState('')

  const sectionConfig = useMemo(
    () => INTERVIEW_SECTIONS.find((section) => section.key === sectionKey),
    [sectionKey],
  )

  if (!sectionConfig) return null

  const sectionNote = interview.config.sectionNotes[sectionKey]
  const segment = interview.config.coreFacts.segment
  const questions = sectionConfig.questions.filter(
    (question) => question.segment === 'both' || question.segment === segment,
  )
  const customQuestions = interview.config.customQuestions?.[sectionKey] ?? []
  const tooltipText = TOOLTIP_TEXT[sectionKey as keyof typeof TOOLTIP_TEXT]

  function handleAddCustomQuestion() {
    const trimmed = customQuestionText.trim()
    if (!trimmed) return
    addCustomQuestion(sectionKey, trimmed)
    setCustomQuestionText('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="type-h4 text-carbon-black">
            {sectionConfig.label}
            {tooltipText ? <InfoTooltip text={tooltipText} /> : null}
          </h2>
          <p className="type-body text-carbon-black/60">{sectionConfig.description}</p>
        </div>
        <span className="rounded-full bg-nordic-oak/40 px-3 py-1 text-xs font-semibold text-carbon-black/80">
          {sectionConfig.durationMinutes} min
        </span>
      </div>

      <div className="rounded-card border border-terrazzo-grey bg-terrazzo-grey/10 p-4">
        <p className="mb-2 text-sm font-semibold text-carbon-black">Leitfragen ({segmentLabel(segment)})</p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-carbon-black/80">
          {questions.map((question) => (
            <li key={question.id}>
              {question.text}
              {question.isFollowUp ? (
                <span className="ml-2 rounded bg-terrazzo-grey px-1.5 py-0.5 text-[11px] text-carbon-black/60">
                  Nachfrage
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        {/* Custom questions */}
        {customQuestions.length > 0 && (
          <ul className="mt-3 space-y-2 pl-5 text-sm text-carbon-black/80">
            {customQuestions.map((question) => (
              <li
                key={question.id}
                className="flex items-start gap-2 rounded-button border border-botanical-green/40 bg-botanical-green/5 px-3 py-2"
              >
                <span className="flex-1">{question.text}</span>
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
        <div className="mt-3 flex items-center gap-2">
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
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-carbon-black">Notizen</p>
          <Button variant="outline" size="sm" onClick={() => setQuoteDialogOpen(true)}>
            Zitat erfassen
          </Button>
        </div>
        <Textarea
          rows={10}
          value={sectionNote.content}
          onChange={(event) => updateSectionNote(sectionKey, event.target.value)}
          placeholder="Notiere Antworten, Beobachtungen und konkrete Beispiele..."
        />
      </div>

      {sectionNote.quotes.length ? (
        <div className="space-y-2 rounded-card border border-terrazzo-grey bg-studio-white p-3">
          <p className="text-sm font-semibold text-carbon-black">Zitate in diesem Abschnitt</p>
          {sectionNote.quotes.slice(0, 5).map((quote) => (
            <div key={quote.id} className="rounded-button border border-terrazzo-grey bg-terrazzo-grey/10 px-3 py-2">
              <p className="text-sm text-carbon-black">"{quote.text}"</p>
              <div className="mt-1">
                <QuoteBadge verbatim={quote.isVerbatim} />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="rounded-card border border-warning/40 bg-warning/10 p-4">
        <p className="mb-1 text-sm font-semibold text-carbon-black">NICHT TUN</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-carbon-black/80">
          {sectionConfig.donts.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <Dialog
        open={quoteDialogOpen}
        onClose={() => setQuoteDialogOpen(false)}
        title="Zitat erfassen"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setQuoteDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={() => {
                if (!quoteText.trim()) return
                addQuote({
                  text: quoteText.trim(),
                  sectionKey,
                  isVerbatim: quoteVerbatim,
                })
                setQuoteText('')
                setQuoteDialogOpen(false)
              }}
            >
              Speichern
            </Button>
          </div>
        }
      >
        <Textarea
          rows={4}
          placeholder="Zitattext"
          value={quoteText}
          onChange={(event) => setQuoteText(event.target.value)}
        />
        <label className="inline-flex items-center gap-2 text-sm text-carbon-black/80">
          <input
            type="checkbox"
            checked={quoteVerbatim}
            onChange={(event) => setQuoteVerbatim(event.target.checked)}
            className="accent-botanical-green"
          />
          Wörtlich markieren
        </label>
      </Dialog>
    </div>
  )
}
