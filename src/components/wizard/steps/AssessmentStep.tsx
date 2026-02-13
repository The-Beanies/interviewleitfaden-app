'use client'

import { InfoTooltip } from '@/components/ui/info-tooltip'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { TOOLTIP_TEXT } from '@/config/tooltips'
import { useInterviewStore } from '@/stores/interview-store'

import type { WizardStepProps } from './types'

export function AssessmentStep({ interview }: WizardStepProps) {
  const updateOverallAssessment = useInterviewStore((state) => state.updateOverallAssessment)
  const updateSteveReaction = useInterviewStore((state) => state.updateSteveReaction)

  const assessment = interview.config.summary.overallAssessment
  const steveReaction = interview.config.summary.steveReaction

  return (
    <div className="space-y-5">
      <h2 className="type-h4 text-carbon-black">Bewertung</h2>

      <ScoreSlider
        label="Relevanz"
        tooltip={TOOLTIP_TEXT.relevanzScore}
        value={assessment.relevanceScore}
        onChange={(value) => updateOverallAssessment({ relevanceScore: value as 1 | 2 | 3 | 4 | 5 })}
      />
      <ScoreSlider
        label="Schmerzintensität"
        tooltip={TOOLTIP_TEXT.painIntensityScore}
        value={assessment.painIntensityScore}
        onChange={(value) => updateOverallAssessment({ painIntensityScore: value as 1 | 2 | 3 | 4 | 5 })}
      />
      <ScoreSlider
        label="STEVE-Fit"
        tooltip={TOOLTIP_TEXT.steveFitScore}
        value={assessment.steveFitScore}
        onChange={(value) => updateOverallAssessment({ steveFitScore: value as 1 | 2 | 3 | 4 | 5 })}
      />

      <div className="space-y-2 rounded-card border border-terrazzo-grey p-4">
        <div className="flex items-center gap-1">
          <Label>Nachfass-Priorität</Label>
          <InfoTooltip text={TOOLTIP_TEXT.followUpPriority} />
        </div>
        <Select
          value={assessment.followUpPriority}
          onChange={(event) =>
            updateOverallAssessment({
              followUpPriority: event.target.value as 'hoch' | 'mittel' | 'niedrig' | 'keine',
            })
          }
        >
          <option value="hoch">hoch</option>
          <option value="mittel">mittel</option>
          <option value="niedrig">niedrig</option>
          <option value="keine">keine</option>
        </Select>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2 rounded-card border border-terrazzo-grey p-4">
          <Label>STEVE-Interesse</Label>
          <Select
            value={steveReaction.interestLevel}
            onChange={(event) =>
              updateSteveReaction({
                interestLevel: event.target.value as 'stark' | 'hoeflich' | 'skeptisch',
              })
            }
          >
            <option value="stark">stark</option>
            <option value="hoeflich">höflich</option>
            <option value="skeptisch">skeptisch</option>
          </Select>
        </div>

        <div className="space-y-2 rounded-card border border-terrazzo-grey p-4">
          <Label>Zahlungsbereitschaft (Monat)</Label>
          <Textarea
            rows={2}
            value={steveReaction.willingnessToPayMonthly}
            onChange={(event) => updateSteveReaction({ willingnessToPayMonthly: event.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2 rounded-card border border-terrazzo-grey p-4">
        <Label>Bewertungsnotizen</Label>
        <Textarea
          rows={5}
          value={assessment.notes}
          onChange={(event) => updateOverallAssessment({ notes: event.target.value })}
        />
      </div>
    </div>
  )
}

function ScoreSlider({
  label,
  tooltip,
  value,
  onChange,
}: {
  label: string
  tooltip?: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="space-y-2 rounded-card border border-terrazzo-grey p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Label>{label}</Label>
          {tooltip ? <InfoTooltip text={tooltip} /> : null}
        </div>
        <span className="text-sm font-semibold text-carbon-black">{value}/5</span>
      </div>
      <Slider min={1} max={5} step={1} value={value} onValueChange={onChange} />
    </div>
  )
}
