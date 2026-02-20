import type {
  AIAttitude,
  FollowUpPriority,
  InterviewSectionKey,
  InterviewSegment,
  InterviewStatus,
  SteveInterestLevel,
} from '@/types'

export function sectionLabel(sectionKey: InterviewSectionKey): string {
  return (
    {
      warmup: 'Warm-up',
      gruendungsreise: 'Gründungsreise',
      schmerz_workarounds: 'Schmerz & Umgehungslösungen',
      ki_automatisierung: 'KI & Automatisierung',
      konzepttest_steve: 'Konzepttest bean:up',
      abschluss: 'Abschluss',
    }[sectionKey] ?? sectionKey
  )
}

export function segmentLabel(segment: InterviewSegment): string {
  return (
    {
      retrospektiv: 'Retrospektiv',
      aktuell_gruendend: 'Aktuell gründend',
    }[segment] ?? segment
  )
}

export function statusLabel(status: InterviewStatus): string {
  return (
    {
      geplant: 'Geplant',
      in_durchfuehrung: 'In Durchführung',
      abgeschlossen: 'Abgeschlossen',
      abgebrochen: 'Abgebrochen',
    }[status] ?? status
  )
}

export function aiAttitudeLabel(attitude: AIAttitude): string {
  return (
    {
      enthusiastisch: 'enthusiastisch',
      offen: 'offen',
      neutral: 'neutral',
      skeptisch: 'skeptisch',
      ablehnend: 'ablehnend',
    }[attitude] ?? attitude
  )
}

export function steveInterestLabel(level: SteveInterestLevel): string {
  return (
    {
      stark: 'stark',
      hoeflich: 'höflich',
      skeptisch: 'skeptisch',
    }[level] ?? level
  )
}

export function followUpPriorityLabel(priority: FollowUpPriority): string {
  return (
    {
      hoch: 'hoch',
      mittel: 'mittel',
      niedrig: 'niedrig',
      keine: 'keine',
    }[priority] ?? priority
  )
}
