'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup } from '@/components/ui/radio-group'
import { useInterviewStore } from '@/stores/interview-store'

import type { WizardStepProps } from './types'

export function CoreFactsStep({ interview }: WizardStepProps) {
  const updateCoreFacts = useInterviewStore((state) => state.updateCoreFacts)
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
