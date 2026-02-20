import type { InsightsSummary, Interview, InterviewSectionKey } from '@/types'

import {
  aiAttitudeLabel,
  followUpPriorityLabel,
  sectionLabel,
  segmentLabel,
  statusLabel,
  steveInterestLabel,
} from '@/lib/labels'

function downloadTextFile(content: string, filename: string, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

function escapeCsv(value: string) {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function sectionTitle(key: string) {
  return sectionLabel(key as InterviewSectionKey)
}

function toMarkdown(interview: Interview) {
  const { config } = interview
  const summary = config.summary

  const sectionNotes = Object.entries(config.sectionNotes)
    .map(([key, note]) => `## ${sectionTitle(key)}\n\n${note.content || '_Keine Notizen_'}\n`)
    .join('\n')

  const painPoints = summary.painPoints.length
    ? summary.painPoints
        .map(
          (point) =>
            `- **#${point.rank} ${point.description}** (Intensität ${point.intensity}/5)\n  - Frequenz: ${point.frequency}\n  - Aktuelle Lösung: ${point.currentSolution}\n  - Kosten: ${point.costOfProblem}`,
        )
        .join('\n')
    : '_Keine Schmerzpunkte dokumentiert._'

  const quotes = config.allQuotes.length
    ? config.allQuotes.map((quote) => `> ${quote.text} _( ${sectionTitle(quote.sectionKey)} )_`).join('\n\n')
    : '_Keine Zitate dokumentiert._'

  return `# Interview: ${interview.name}

- Status: ${statusLabel(interview.status)}
- Erstellt: ${new Date(interview.createdAt).toLocaleString('de-DE')}
- Aktualisiert: ${new Date(interview.updatedAt).toLocaleString('de-DE')}

## Basisdaten

- Name: ${config.coreFacts.intervieweeName || '-'}
- Segment: ${segmentLabel(config.coreFacts.segment)}
- Branche: ${config.coreFacts.industry || '-'}
- Geschäftsbeschreibung: ${config.coreFacts.businessDescription || '-'}
- Gründungsdatum: ${config.coreFacts.foundingDate || '-'}
- Teamgröße: ${config.coreFacts.teamSize || '-'}
- Weitere Gründer: ${config.coreFacts.additionalFounders.length ? config.coreFacts.additionalFounders.map((f) => `${f.name} (${f.role})`).join(', ') : '-'}
- Ort: ${config.coreFacts.location || '-'}
- E-Mail: ${config.coreFacts.contactEmail || '-'}
- Telefon: ${config.coreFacts.contactPhone || '-'}
- Empfehlung: ${config.coreFacts.referredBy || '-'}
- Notizen: ${config.coreFacts.notes || '-'}

## JTBD

- Trigger: ${summary.jtbd.trigger || '-'}
- Push-Faktoren: ${summary.jtbd.pushFactors.join(', ') || '-'}
- Pull-Faktoren: ${summary.jtbd.pullFactors.join(', ') || '-'}
- Ängste: ${summary.jtbd.anxiety.join(', ') || '-'}
- Gewohnheiten: ${summary.jtbd.habit.join(', ') || '-'}

## Schmerzpunkte

${painPoints}

## Umgehungslösungen

${summary.workaroundsAttempted.length ? summary.workaroundsAttempted.map((item) => `- ${item}`).join('\n') : '_Keine Umgehungslösungen dokumentiert._'}

## KI & Automatisierung

- Haltung: ${aiAttitudeLabel(summary.aiAttitude)}
- Tools: ${summary.aiToolsUsed.join(', ') || '-'}
- Barrieren: ${summary.aiBarriers.join(', ') || '-'}

## bean:up-Reaktion

- Erste Reaktion: ${summary.steveReaction.firstReaction || '-'}
- Interesse: ${steveInterestLabel(summary.steveReaction.interestLevel)}
- Wichtigstes Feature: ${summary.steveReaction.mostInterestingFeature || '-'}
- Anwendungsfall: ${summary.steveReaction.useCase || '-'}
- Zahlungsbereitschaft/Monat: ${summary.steveReaction.willingnessToPayMonthly || '-'}
- Bedenken: ${summary.steveReaction.concerns || '-'}

## Gesamtbewertung

- Relevanz: ${summary.overallAssessment.relevanceScore}/5
- Schmerzintensität: ${summary.overallAssessment.painIntensityScore}/5
- bean:up-Fit: ${summary.overallAssessment.steveFitScore}/5
- Nachfass-Priorität: ${followUpPriorityLabel(summary.overallAssessment.followUpPriority)}
- Notizen: ${summary.overallAssessment.notes || '-'}

## Abschnittsnotizen

${sectionNotes}

## Schlüsselzitate

${quotes}
`
}

function flattenPainPoints(interview: Interview) {
  return interview.config.summary.painPoints
    .sort((a, b) => a.rank - b.rank)
    .map(
      (point) =>
        `#${point.rank} ${point.description} (Intensität ${point.intensity}/5; Frequenz: ${point.frequency}; Lösung: ${point.currentSolution}; Kosten: ${point.costOfProblem})`,
    )
    .join(' || ')
}

function flattenQuotes(interview: Interview) {
  return interview.config.allQuotes
    .map((quote) => `[${sectionTitle(quote.sectionKey)}] ${quote.text}`)
    .join(' | ')
}

function flattenChecklist(interview: Interview) {
  return interview.config.checklist
    .map((item) => `${item.label}: ${item.checked ? 'Ja' : 'Nein'}`)
    .join(' | ')
}

export function downloadInterviewJSON(interview: Interview) {
  downloadTextFile(
    JSON.stringify(interview, null, 2),
    `${interview.name.replace(/\s+/g, '_')}.json`,
    'application/json;charset=utf-8',
  )
}

export function downloadInterviewMarkdown(interview: Interview) {
  downloadTextFile(toMarkdown(interview), `${interview.name.replace(/\s+/g, '_')}.md`)
}

export function downloadInterviewPDF(_interview: Interview) {
  // Open the preview page with print=1 to trigger the browser print dialog
  // which allows saving as PDF via the styled preview layout
  const printWindow = window.open('/preview?print=1', '_blank')
  if (!printWindow) {
    // Fallback: alert the user if popup is blocked
    alert('Popup blockiert. Bitte erlaube Popups für diese Seite und versuche es erneut.')
  }
}

export function downloadInterviewPreviewCSV(interview: Interview) {
  const summary = interview.config.summary
  const core = interview.config.coreFacts

  const record: Record<string, string> = {
    id: interview.id,
    name: interview.name,
    status: interview.status,
    status_label: statusLabel(interview.status),
    scheduled_at: interview.scheduledAt,
    conducted_at: interview.conductedAt,
    created_at: interview.createdAt,
    updated_at: interview.updatedAt,

    core_interviewee_name: core.intervieweeName,
    core_segment: core.segment,
    core_segment_label: segmentLabel(core.segment),
    core_industry: core.industry,
    core_founding_date: core.foundingDate,
    core_team_size: core.teamSize,
    core_location: core.location,
    core_business_description: core.businessDescription,
    core_additional_founders: core.additionalFounders.map((f) => `${f.name} (${f.role}, ${f.contact})`).join(' | '),
    core_contact_email: core.contactEmail,
    core_contact_phone: core.contactPhone,
    core_referred_by: core.referredBy,
    core_notes: core.notes,

    note_warmup: interview.config.sectionNotes.warmup.content,
    note_gruendungsreise: interview.config.sectionNotes.gruendungsreise.content,
    note_schmerz_workarounds: interview.config.sectionNotes.schmerz_workarounds.content,
    note_ki_automatisierung: interview.config.sectionNotes.ki_automatisierung.content,
    note_konzepttest_steve: interview.config.sectionNotes.konzepttest_steve.content,
    note_abschluss: interview.config.sectionNotes.abschluss.content,

    checklist: flattenChecklist(interview),
    quotes_all: flattenQuotes(interview),

    jtbd_trigger: summary.jtbd.trigger,
    jtbd_push_factors: summary.jtbd.pushFactors.join(' | '),
    jtbd_pull_factors: summary.jtbd.pullFactors.join(' | '),
    jtbd_anxiety: summary.jtbd.anxiety.join(' | '),
    jtbd_habit: summary.jtbd.habit.join(' | '),

    pain_points: flattenPainPoints(interview),
    workarounds_attempted: summary.workaroundsAttempted.join(' | '),

    ai_attitude: summary.aiAttitude,
    ai_attitude_label: aiAttitudeLabel(summary.aiAttitude),
    ai_tools_used: summary.aiToolsUsed.join(' | '),
    ai_barriers: summary.aiBarriers.join(' | '),

    steve_first_reaction: summary.steveReaction.firstReaction,
    steve_interest_level: summary.steveReaction.interestLevel,
    steve_interest_level_label: steveInterestLabel(summary.steveReaction.interestLevel),
    steve_most_interesting_feature: summary.steveReaction.mostInterestingFeature,
    steve_use_case: summary.steveReaction.useCase,
    steve_willingness_to_pay_monthly: summary.steveReaction.willingnessToPayMonthly,
    steve_concerns: summary.steveReaction.concerns,
    steve_quotes_about_steve: summary.steveReaction.quotesAboutSteve.join(' | '),

    key_quotes: summary.keyQuotes.map((quote) => quote.text).join(' | '),

    assessment_relevance_score: String(summary.overallAssessment.relevanceScore),
    assessment_pain_intensity_score: String(summary.overallAssessment.painIntensityScore),
    assessment_steve_fit_score: String(summary.overallAssessment.steveFitScore),
    assessment_follow_up_priority: summary.overallAssessment.followUpPriority,
    assessment_follow_up_priority_label: followUpPriorityLabel(summary.overallAssessment.followUpPriority),
    assessment_notes: summary.overallAssessment.notes,

    timer_current_section_key: interview.config.timerState.currentSectionKey ?? '',
    timer_section_elapsed_ms: String(interview.config.timerState.sectionElapsedMs),
    timer_total_elapsed_ms: String(interview.config.timerState.totalElapsedMs),
    timer_is_paused: interview.config.timerState.isPaused ? 'ja' : 'nein',
  }

  const headers = Object.keys(record)
  const row = headers.map((header) => escapeCsv(record[header] ?? '')).join(',')
  downloadTextFile([headers.join(','), row].join('\n'), `${interview.name.replace(/\s+/g, '_')}-preview.csv`, 'text/csv;charset=utf-8')
}

export function downloadInsightsReport(summary: InsightsSummary) {
  const topPainPoints = summary.topPainPoints.length
    ? summary.topPainPoints
        .map((item) => `- ${item.description}: ${item.count} Nennungen (Ø ${item.avgIntensity.toFixed(2)}/5)`)
        .join('\n')
    : '- Keine Daten'

  const topWorkarounds = summary.commonWorkarounds.length
    ? summary.commonWorkarounds.map((item) => `- ${item.description}: ${item.count}`).join('\n')
    : '- Keine Daten'

  const topQuotes = summary.topQuotes.length
    ? summary.topQuotes.map((quote) => `> ${quote.text}`).join('\n\n')
    : '_Keine Zitate vorhanden._'

  const content = `# Interview-Auswertungsbericht

## Überblick

- Gesamtinterviews: ${summary.totalInterviews}
- Segment retrospektiv: ${summary.segmentBreakdown.retrospektiv}
- Segment aktuell gründend: ${summary.segmentBreakdown.aktuell_gruendend}
- Durchschnittlicher STEVE-Fit: ${summary.avgSteveFit.toFixed(2)}/5

## STEVE-Interesse

- Stark: ${summary.steveInterestDistribution.stark}
- Höflich: ${summary.steveInterestDistribution.hoeflich}
- Skeptisch: ${summary.steveInterestDistribution.skeptisch}

## KI-Haltung

- Enthusiastisch: ${summary.aiAttitudeDistribution.enthusiastisch}
- Offen: ${summary.aiAttitudeDistribution.offen}
- Neutral: ${summary.aiAttitudeDistribution.neutral}
- Skeptisch: ${summary.aiAttitudeDistribution.skeptisch}
- Ablehnend: ${summary.aiAttitudeDistribution.ablehnend}

## Top-Schmerzpunkte

${topPainPoints}

## Häufige Umgehungslösungen

${topWorkarounds}

## Schlüsselzitate

${topQuotes}
`

  downloadTextFile(content, 'interview-auswertungsbericht.md')
}
