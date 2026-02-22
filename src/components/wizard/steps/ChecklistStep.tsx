'use client'

import { useState } from 'react'

import { Plus, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { useInterviewStore } from '@/stores/interview-store'

import type { WizardStepProps } from './types'

export function ChecklistStep({ interview }: WizardStepProps) {
  const updateChecklist = useInterviewStore((state) => state.updateChecklist)
  const addChecklistItem = useInterviewStore((state) => state.addChecklistItem)
  const removeChecklistItem = useInterviewStore((state) => state.removeChecklistItem)
  const [newItemText, setNewItemText] = useState('')

  function handleAdd() {
    const trimmed = newItemText.trim()
    if (!trimmed) return
    addChecklistItem(trimmed)
    setNewItemText('')
  }

  return (
    <div className="space-y-4">
      <h2 className="type-h4 text-carbon-black">Checkliste vor Interview</h2>
      <p className="type-body text-carbon-black/60">
        Markiere alle Punkte, die vor dem Gespraech vorbereitet sind.
      </p>
      <div className="space-y-2">
        {interview.config.checklist.map((item) => (
          <div key={item.id} className="flex items-center gap-2 rounded-card border border-terrazzo-grey bg-studio-white p-3">
            <div className="flex-1">
              <Checkbox
                id={item.id}
                checked={item.checked}
                onChange={(event) => updateChecklist(item.id, event.target.checked)}
                label={item.label}
              />
            </div>
            <button
              type="button"
              onClick={() => removeChecklistItem(item.id)}
              aria-label="Eintrag entfernen"
              className="shrink-0 rounded p-2 text-carbon-black/40 hover:text-error transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={(event) => setNewItemText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') handleAdd()
          }}
          placeholder="Neuen Punkt hinzufuegen..."
          className="flex-1 rounded-button border border-terrazzo-grey bg-studio-white px-3 py-2 text-sm text-carbon-black placeholder:text-carbon-black/40 outline-none focus:border-botanical-green"
        />
        <button
          type="button"
          onClick={handleAdd}
          aria-label="Punkt hinzufuegen"
          className="rounded p-2 text-botanical-green hover:bg-botanical-green/10 transition-colors"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}
