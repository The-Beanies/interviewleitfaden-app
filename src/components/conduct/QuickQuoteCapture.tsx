'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useInterviewStore } from '@/stores/interview-store'
import type { InterviewSectionKey } from '@/types'

export function QuickQuoteCapture({ sectionKey }: { sectionKey: InterviewSectionKey }) {
  const addQuote = useInterviewStore((state) => state.addQuote)

  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [verbatim, setVerbatim] = useState(true)

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 z-40 min-h-12 min-w-12 rounded-full px-4 py-3 shadow-level2"
        onClick={() => setOpen(true)}
      >
        + Zitat
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Schnellzitat"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Abbrechen
            </Button>
            <Button
              onClick={() => {
                if (!text.trim()) return
                addQuote({
                  text: text.trim(),
                  sectionKey,
                  isVerbatim: verbatim,
                })
                setText('')
                setVerbatim(true)
                setOpen(false)
              }}
            >
              Speichern
            </Button>
          </div>
        }
      >
        <Textarea rows={5} value={text} onChange={(event) => setText(event.target.value)} placeholder="Zitat" />
        <label className="inline-flex items-center gap-2 text-sm text-carbon-black/80">
          <input
            type="checkbox"
            checked={verbatim}
            onChange={(event) => setVerbatim(event.target.checked)}
            className="accent-botanical-green"
          />
          Verbatim markieren
        </label>
      </Dialog>
    </>
  )
}
