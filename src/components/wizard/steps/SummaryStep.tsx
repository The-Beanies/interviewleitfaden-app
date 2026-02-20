'use client'

import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createId } from '@/lib/utils'
import { useInterviewStore } from '@/stores/interview-store'

import type { WizardStepProps } from './types'

function listToText(list: string[]) {
  return list.join('\n')
}

function textToList(text: string) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export function SummaryStep({ interview }: WizardStepProps) {
  const updateSummary = useInterviewStore((state) => state.updateSummary)
  const updatePainPoint = useInterviewStore((state) => state.updatePainPoint)
  const addPainPoint = useInterviewStore((state) => state.addPainPoint)
  const removePainPoint = useInterviewStore((state) => state.removePainPoint)

  const summary = interview.config.summary

  const sortedPainPoints = useMemo(
    () => [...summary.painPoints].sort((a, b) => a.rank - b.rank),
    [summary.painPoints],
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="type-h4 text-carbon-black">Zusammenfassung</h2>
        <p className="type-body text-carbon-black/60">
          Fuelle die Felder basierend auf deinen Notizen aus den vorherigen Abschnitten aus. Jedes Feld hilft dir, die wichtigsten Erkenntnisse strukturiert festzuhalten.
        </p>
      </div>

      <div className="space-y-2 rounded-card border border-terrazzo-grey p-4">
        <Label>JTBD-Auslöser</Label>
        <p className="text-xs text-carbon-black/50">Was hat den Gruender dazu bewogen, aktiv nach einer Loesung zu suchen?</p>
        <Textarea
          rows={3}
          value={summary.jtbd.trigger}
          onChange={(event) =>
            updateSummary({
              jtbd: {
                ...summary.jtbd,
                trigger: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <ListField
          label="Push-Faktoren"
          value={listToText(summary.jtbd.pushFactors)}
          onChange={(value) =>
            updateSummary({
              jtbd: {
                ...summary.jtbd,
                pushFactors: textToList(value),
              },
            })
          }
        />
        <ListField
          label="Pull-Faktoren"
          value={listToText(summary.jtbd.pullFactors)}
          onChange={(value) =>
            updateSummary({
              jtbd: {
                ...summary.jtbd,
                pullFactors: textToList(value),
              },
            })
          }
        />
        <ListField
          label="Ängste"
          value={listToText(summary.jtbd.anxiety)}
          onChange={(value) =>
            updateSummary({
              jtbd: {
                ...summary.jtbd,
                anxiety: textToList(value),
              },
            })
          }
        />
        <ListField
          label="Gewohnheiten"
          value={listToText(summary.jtbd.habit)}
          onChange={(value) =>
            updateSummary({
              jtbd: {
                ...summary.jtbd,
                habit: textToList(value),
              },
            })
          }
        />
      </div>

      <div className="space-y-3 rounded-card border border-terrazzo-grey p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-carbon-black">Schmerzpunkte</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              addPainPoint({
                description: '',
                intensity: 3,
                frequency: '',
                currentSolution: '',
                costOfProblem: '',
                rank: summary.painPoints.length + 1,
            })
          }
        >
            Schmerzpunkt hinzufügen
          </Button>
        </div>

        {sortedPainPoints.length ? (
          <div className="space-y-3">
            {sortedPainPoints.map((point) => (
              <div key={point.id} className="rounded-card border border-terrazzo-grey bg-terrazzo-grey/10 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-carbon-black/50">
                    Rang #{point.rank}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => removePainPoint(point.id)}>
                    Entfernen
                  </Button>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <Input
                    placeholder="Beschreibung"
                    value={point.description}
                    onChange={(event) => updatePainPoint(point.id, { description: event.target.value })}
                  />
                  <Select
                    value={String(point.intensity)}
                    onChange={(event) =>
                      updatePainPoint(point.id, {
                        intensity: Number(event.target.value) as 1 | 2 | 3 | 4 | 5,
                      })
                    }
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Select>
                  <Input
                    placeholder="Frequenz"
                    value={point.frequency}
                    onChange={(event) => updatePainPoint(point.id, { frequency: event.target.value })}
                  />
                  <Input
                    placeholder="Aktuelle Lösung"
                    value={point.currentSolution}
                    onChange={(event) => updatePainPoint(point.id, { currentSolution: event.target.value })}
                  />
                </div>
                <Input
                  className="mt-2"
                  placeholder="Kosten des Problems"
                  value={point.costOfProblem}
                  onChange={(event) => updatePainPoint(point.id, { costOfProblem: event.target.value })}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-carbon-black/50">Noch keine Schmerzpunkte erfasst.</p>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <ListField
          label="Umgehungslösungen"
          value={listToText(summary.workaroundsAttempted)}
          onChange={(value) => updateSummary({ workaroundsAttempted: textToList(value) })}
        />
        <div className="space-y-3">
          <ListField
            label="KI-Tools"
            value={listToText(summary.aiToolsUsed)}
            onChange={(value) => updateSummary({ aiToolsUsed: textToList(value) })}
          />
          <ListField
            label="KI-Barrieren"
            value={listToText(summary.aiBarriers)}
            onChange={(value) => updateSummary({ aiBarriers: textToList(value) })}
          />
        </div>
      </div>

      <div className="rounded-card border border-terrazzo-grey p-4">
        <Label>KI-Haltung</Label>
        <Select
          className="mt-2"
          value={summary.aiAttitude}
          onChange={(event) =>
            updateSummary({
              aiAttitude: event.target.value as
                | 'enthusiastisch'
                | 'offen'
                | 'neutral'
                | 'skeptisch'
                | 'ablehnend',
            })
          }
        >
          <option value="enthusiastisch">enthusiastisch</option>
          <option value="offen">offen</option>
          <option value="neutral">neutral</option>
          <option value="skeptisch">skeptisch</option>
          <option value="ablehnend">ablehnend</option>
        </Select>
      </div>

      <div className="space-y-2 rounded-card border border-terrazzo-grey p-4">
        <Label>bean:up - Erste Reaktion</Label>
        <Textarea
          rows={3}
          value={summary.steveReaction.firstReaction}
          onChange={(event) =>
            updateSummary({
              steveReaction: {
                ...summary.steveReaction,
                firstReaction: event.target.value,
              },
            })
          }
        />
      </div>

      <div className="space-y-2 rounded-card border border-terrazzo-grey p-4">
        <Label>Wichtigste Zitate (eine Zeile je Zitat)</Label>
        <Textarea
          rows={4}
          value={summary.keyQuotes.map((quote) => quote.text).join('\n')}
          onChange={(event) =>
            updateSummary({
              keyQuotes: textToList(event.target.value).map((text) => ({
                id: createId('quote'),
                text,
                sectionKey: 'abschluss',
                isVerbatim: true,
                createdAt: new Date().toISOString(),
              })),
            })
          }
        />
      </div>
    </div>
  )
}

function ListField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2 rounded-card border border-terrazzo-grey p-3">
      <Label>{label}</Label>
      <Textarea rows={4} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}
