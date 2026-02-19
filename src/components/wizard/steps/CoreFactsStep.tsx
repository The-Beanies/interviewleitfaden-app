'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useInterviewStore } from '@/stores/interview-store'

import type { WizardStepProps } from './types'

export function CoreFactsStep({ interview }: WizardStepProps) {
  const updateCoreFacts = useInterviewStore((state) => state.updateCoreFacts)
  const addFounder = useInterviewStore((state) => state.addFounder)
  const updateFounder = useInterviewStore((state) => state.updateFounder)
  const removeFounder = useInterviewStore((state) => state.removeFounder)
  const facts = interview.config.coreFacts

  return (
    <div className="space-y-4">
      <h2 className="type-h4 text-carbon-black">Basisdaten</h2>

      <div className="space-y-2">
        <Label>Segment</Label>
        <RadioGroup
          name="segment"
          value={facts.segment}
          onValueChange={(value) =>
            updateCoreFacts({
              segment: value === 'aktuell_gruendend' ? 'aktuell_gruendend' : 'retrospektiv',
            })
          }
          options={[
            {
              value: 'retrospektiv',
              label: 'Retrospektiv',
              description: 'Gründung liegt bereits hinter der Person.',
            },
            {
              value: 'aktuell_gruendend',
              label: 'Aktuell gründend',
              description: 'Person befindet sich aktuell in der Gründungsphase.',
            },
          ]}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" value={facts.intervieweeName} onChange={(value) => updateCoreFacts({ intervieweeName: value })} />
        <Field label="Branche" value={facts.industry} onChange={(value) => updateCoreFacts({ industry: value })} />
        <Field label="Gründungsdatum" value={facts.foundingDate} onChange={(value) => updateCoreFacts({ foundingDate: value })} />
        <Field label="Teamgröße" value={facts.teamSize} onChange={(value) => updateCoreFacts({ teamSize: value })} />
        <Field label="Ort" value={facts.location} onChange={(value) => updateCoreFacts({ location: value })} />
        <Field label="E-Mail" value={facts.contactEmail} onChange={(value) => updateCoreFacts({ contactEmail: value })} />
        <Field label="Telefon" value={facts.contactPhone} onChange={(value) => updateCoreFacts({ contactPhone: value })} />
        <Field label="Empfohlen von" value={facts.referredBy} onChange={(value) => updateCoreFacts({ referredBy: value })} />
      </div>

      {/* Business Description */}
      <div className="space-y-1.5">
        <Label>Geschäftsbeschreibung</Label>
        <Textarea
          rows={3}
          value={facts.businessDescription}
          onChange={(event) => updateCoreFacts({ businessDescription: event.target.value })}
          placeholder="Kurze Beschreibung des Geschäftsmodells..."
        />
      </div>

      {/* Additional Founders */}
      <div className="space-y-3 rounded-card border border-terrazzo-grey p-4">
        <div className="flex items-center justify-between">
          <Label>Weitere Gründer:innen</Label>
          <Button variant="outline" size="sm" onClick={addFounder}>
            <Plus className="size-4" />
            Hinzufügen
          </Button>
        </div>
        {facts.additionalFounders.length === 0 && (
          <p className="text-sm text-carbon-black/40">Noch keine weiteren Gründer:innen hinzugefügt.</p>
        )}
        {facts.additionalFounders.map((founder) => (
          <div key={founder.id} className="flex items-start gap-2">
            <div className="grid flex-1 gap-2 sm:grid-cols-3">
              <Input
                value={founder.name}
                onChange={(event) => updateFounder(founder.id, { name: event.target.value })}
                placeholder="Name"
              />
              <Input
                value={founder.role}
                onChange={(event) => updateFounder(founder.id, { role: event.target.value })}
                placeholder="Rolle"
              />
              <Input
                value={founder.contact}
                onChange={(event) => updateFounder(founder.id, { contact: event.target.value })}
                placeholder="Kontakt"
              />
            </div>
            <button
              type="button"
              onClick={() => removeFounder(founder.id)}
              aria-label="Gründer:in entfernen"
              className="shrink-0 rounded p-2 text-carbon-black/40 hover:text-error transition-colors"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label>Notizen</Label>
        <Textarea
          rows={4}
          value={facts.notes}
          onChange={(event) => updateCoreFacts({ notes: event.target.value })}
          placeholder="Allgemeine Notizen zum Interview..."
        />
      </div>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="min-w-0 space-y-1.5">
      <Label className="truncate">{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={label} />
    </div>
  )
}
