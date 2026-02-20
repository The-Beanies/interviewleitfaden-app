import { createId } from '@/lib/utils'
import type {
  ChecklistItem,
  CoreFacts,
  Interview,
  InterviewConfig,
  InterviewQuestion,
  InterviewSectionConfig,
  InterviewSectionKey,
  JTBDAnalysis,
  OverallAssessment,
  PainPoint,
  PostInterviewSummary,
  Quote,
  SectionNote,
  SteveReaction,
  TimerState,
} from '@/types'

export const WIZARD_STEP_LABELS = [
  'Basisdaten',
  'Checkliste',
  'Warm-up',
  'Gründungsreise',
  'Schmerz & Umgehungslösungen',
  'KI & Automatisierung',
  'bean:up-Test',
  'Abschluss',
  'Zusammenfassung',
  'Bewertung',
] as const

export const SECTION_KEYS: InterviewSectionKey[] = [
  'warmup',
  'gruendungsreise',
  'schmerz_workarounds',
  'ki_automatisierung',
  'konzepttest_steve',
  'abschluss',
]

export const SECTION_IDS = [
  'cover',
  'core-facts',
  'jtbd',
  'pain-points',
  'workarounds',
  'ai-attitude',
  'steve-reaction',
  'quotes',
  'assessment',
] as const

export const PAGE_NAMES = [
  'Deckblatt',
  'Basisdaten',
  'JTBD',
  'Schmerzpunkte',
  'Umgehungslösungen',
  'KI-Haltung',
  'bean:up-Reaktion',
  'Schlüsselzitate',
  'Bewertung',
] as const

export const BEANUP_PITCH_TEXT =
  'Stell dir vor, du hättest einen KI-gestützten Co-Piloten für deine Gründung — wir nennen ihn bean:up. bean:up begleitet dich von der ersten Idee bis zum fertigen Businessplan. Er hilft dir, deinen Markt zu verstehen, dein Geschäftsmodell zu validieren, und erstellt dir bankfertige Unterlagen — alles in einem Tool, für einen Bruchteil der Kosten einer klassischen Beratung. Du sagst bean:up, was du vorhast, und er führt dich Schritt für Schritt durch den Prozess.'

const QUESTION_SETS: Record<InterviewSectionKey, InterviewQuestion[]> = {
  warmup: [
    {
      id: 'warmup-1',
      text: 'Erzähl bitte kurz von dir und deinem Gründungskontext.',
      segment: 'both',
      isFollowUp: false,
      category: 'intro',
    },
    {
      id: 'warmup-2',
      text: 'Wann hast du angefangen zu gründen bzw. wann hast du gegründet?',
      segment: 'both',
      isFollowUp: false,
      category: 'timeline',
    },
    {
      id: 'warmup-3',
      text: 'Wenn du auf die Anfangsphase zurückblickst: Was war am unklarsten?',
      segment: 'retrospektiv',
      isFollowUp: false,
      category: 'retrospective',
    },
    {
      id: 'warmup-4',
      text: 'Welche Entscheidung steht in den nächsten 2 Wochen bei dir konkret an?',
      segment: 'aktuell_gruendend',
      isFollowUp: false,
      category: 'current',
    },
  ],
  gruendungsreise: [
    {
      id: 'reise-1',
      text: 'Welche Schritte deiner Gründungsreise waren bisher am schwierigsten?',
      segment: 'both',
      isFollowUp: false,
      category: 'journey',
    },
    {
      id: 'reise-2',
      text: 'Was hat den Ausschlag gegeben, aktiv nach Lösungen zu suchen?',
      segment: 'both',
      isFollowUp: false,
      category: 'jtbd-trigger',
    },
    {
      id: 'reise-3',
      text: 'Rückblickend: Welche frühen Entscheidungen würdest du heute anders treffen?',
      segment: 'retrospektiv',
      isFollowUp: true,
      category: 'retrospective',
    },
    {
      id: 'reise-4',
      text: 'Was blockiert dich aktuell am meisten auf dem Weg zum nächsten Meilenstein?',
      segment: 'aktuell_gruendend',
      isFollowUp: true,
      category: 'current',
    },
  ],
  schmerz_workarounds: [
    {
      id: 'pain-1',
      text: 'Welche Aufgaben fühlen sich aktuell besonders frustrierend oder zeitintensiv an?',
      segment: 'both',
      isFollowUp: false,
      category: 'pain',
    },
    {
      id: 'pain-2',
      text: 'Wie oft tritt dieses Problem auf und was kostet es dich (Zeit/Geld/Nerven)?',
      segment: 'both',
      isFollowUp: true,
      category: 'cost',
    },
    {
      id: 'pain-3',
      text: 'Welche Umgehungslösungen hast du probiert und warum waren sie nicht ausreichend?',
      segment: 'both',
      isFollowUp: true,
      category: 'workaround',
    },
  ],
  ki_automatisierung: [
    {
      id: 'ki-1',
      text: 'Wie stehst du grundsätzlich zu KI in deinem Gründungsalltag?',
      segment: 'both',
      isFollowUp: false,
      category: 'attitude',
    },
    {
      id: 'ki-2',
      text: 'Welche KI-Tools nutzt du bereits und für welche Aufgaben?',
      segment: 'both',
      isFollowUp: false,
      category: 'usage',
    },
    {
      id: 'ki-3',
      text: 'Welche Hürden halten dich davon ab, mehr zu automatisieren?',
      segment: 'both',
      isFollowUp: true,
      category: 'barriers',
    },
  ],
  konzepttest_steve: [
    {
      id: 'steve-1',
      text: 'Was ist deine erste Reaktion auf das bean:up-Konzept?',
      segment: 'both',
      isFollowUp: false,
      category: 'reaction',
    },
    {
      id: 'steve-2',
      text: 'Welche Funktion wäre für dich am wertvollsten?',
      segment: 'both',
      isFollowUp: true,
      category: 'feature',
    },
    {
      id: 'steve-3',
      text: 'Wofür wärst du bereit, monatlich zu zahlen?',
      segment: 'both',
      isFollowUp: true,
      category: 'wtp',
    },
  ],
  abschluss: [
    {
      id: 'abschluss-1',
      text: 'Was sollten wir zum Abschluss noch verstehen, was bisher nicht gefragt wurde?',
      segment: 'both',
      isFollowUp: false,
      category: 'closing',
    },
    {
      id: 'abschluss-2',
      text: 'Dürfen wir bei Rückfragen erneut auf dich zukommen?',
      segment: 'both',
      isFollowUp: false,
      category: 'follow-up',
    },
    {
      id: 'abschluss-3',
      text: 'Kennst du weitere Gründer:innen, mit denen wir sprechen sollten?',
      segment: 'both',
      isFollowUp: true,
      category: 'referral',
    },
  ],
}

export const INTERVIEW_SECTIONS: InterviewSectionConfig[] = [
  {
    key: 'warmup',
    label: '1. Warm-up',
    durationMinutes: 8,
    description:
      'Kontext setzen, Vertrauen aufbauen und Interviewziel transparent machen. TODO: Exakte Outline-Formulierung einpflegen.',
    questions: QUESTION_SETS.warmup,
    donts: [
      'Nicht pitchen oder verkaufen.',
      'Nicht mit Ja/Nein-Fragen starten.',
      'Keine suggestiven Formulierungen verwenden.',
    ],
  },
  {
    key: 'gruendungsreise',
    label: '2. Gründungsreise',
    durationMinutes: 12,
    description:
      'Ablauf, Trigger und Kontext der Gründungsreise verstehen. TODO: Exakte Outline-Formulierung einpflegen.',
    questions: QUESTION_SETS.gruendungsreise,
    donts: [
      'Nicht auf Lösungsdetails springen, bevor das Problem klar ist.',
      'Nicht eigene Annahmen als Fakten darstellen.',
    ],
  },
  {
    key: 'schmerz_workarounds',
    label: '3. Schmerz & Umgehungslösungen',
    durationMinutes: 15,
    description:
      'Konkrete Schmerzpunkte, Häufigkeit, Intensität und aktuelle Umgehungslösungen aufdecken.',
    questions: QUESTION_SETS.schmerz_workarounds,
    donts: [
      'Keine abstrakten Probleme akzeptieren, immer konkrete Beispiele erfragen.',
      'Nicht vorschnell priorisieren ohne Evidenz.',
    ],
  },
  {
    key: 'ki_automatisierung',
    label: '4. KI & Automatisierung',
    durationMinutes: 10,
    description: 'KI-Reifegrad, Haltung, genutzte Tools und Barrieren erfassen.',
    questions: QUESTION_SETS.ki_automatisierung,
    donts: [
      'Nicht bewerten, wenn jemand KI ablehnt.',
      'Technische Begriffe nicht ungefragt voraussetzen.',
    ],
  },
  {
    key: 'konzepttest_steve',
    label: '5. Konzepttest bean:up',
    durationMinutes: 10,
    description: 'bean:up-Pitch testen, Reaktion und Zahlungsbereitschaft dokumentieren.',
    questions: QUESTION_SETS.konzepttest_steve,
    donts: [
      'Nicht verteidigen oder argumentieren, wenn Kritik kommt.',
      'Nicht Features vor Problemen priorisieren.',
    ],
  },
  {
    key: 'abschluss',
    label: '6. Abschluss',
    durationMinutes: 5,
    description: 'Offene Punkte klären, Nachfassen sichern, Empfehlungen erfragen.',
    questions: QUESTION_SETS.abschluss,
    donts: [
      'Nicht ohne nächsten Schritt beenden.',
      'Nicht vergessen, um Erlaubnis für Rückfragen zu bitten.',
    ],
  },
]

export const DEFAULT_CHECKLIST_LABELS = [
  'Interviewziel für dieses Gespräch notiert',
  'Segment (retrospektiv/aktuell gründend) vorab eingeschätzt',
  'Einwilligung für Notizen/Zitate vorbereitet',
  'Interviewleitfaden und Fragen geprüft',
  'Timer und Durchführungsmodus bereit',
  'bean:up-Pitch final abgestimmt',
  'Post-Interview-Zusammenfassung direkt im Anschluss eingeplant',
]

export function createDefaultChecklist(): ChecklistItem[] {
  return DEFAULT_CHECKLIST_LABELS.map((label) => ({
    id: createId('checklist'),
    label,
    checked: false,
  }))
}

export function createDefaultCoreFacts(): CoreFacts {
  return {
    intervieweeName: '',
    segment: 'retrospektiv',
    industry: '',
    foundingDate: '',
    teamSize: '',
    location: '',
    contactEmail: '',
    contactPhone: '',
    referredBy: '',
    additionalFounders: [],
    businessDescription: '',
    notes: '',
  }
}

export function createEmptySectionNote(sectionKey: InterviewSectionKey): SectionNote {
  return {
    id: createId(`section-${sectionKey}`),
    sectionKey,
    content: '',
    quotes: [],
    timestamp: new Date().toISOString(),
  }
}

export function createDefaultSectionNotes(): Record<InterviewSectionKey, SectionNote> {
  return {
    warmup: createEmptySectionNote('warmup'),
    gruendungsreise: createEmptySectionNote('gruendungsreise'),
    schmerz_workarounds: createEmptySectionNote('schmerz_workarounds'),
    ki_automatisierung: createEmptySectionNote('ki_automatisierung'),
    konzepttest_steve: createEmptySectionNote('konzepttest_steve'),
    abschluss: createEmptySectionNote('abschluss'),
  }
}

export function createDefaultJTBD(): JTBDAnalysis {
  return {
    trigger: '',
    pushFactors: [],
    pullFactors: [],
    anxiety: [],
    habit: [],
  }
}

export function createDefaultSteveReaction(): SteveReaction {
  return {
    firstReaction: '',
    interestLevel: 'hoeflich',
    mostInterestingFeature: '',
    useCase: '',
    willingnessToPayMonthly: '',
    concerns: '',
    quotesAboutSteve: [],
  }
}

export function createDefaultOverallAssessment(): OverallAssessment {
  return {
    relevanceScore: 3,
    painIntensityScore: 3,
    steveFitScore: 3,
    followUpPriority: 'mittel',
    notes: '',
  }
}

export function createDefaultSummary(coreFacts?: CoreFacts): PostInterviewSummary {
  const facts = coreFacts ?? createDefaultCoreFacts()
  return {
    coreFacts: { ...facts },
    jtbd: createDefaultJTBD(),
    painPoints: [],
    workaroundsAttempted: [],
    aiAttitude: 'neutral',
    aiToolsUsed: [],
    aiBarriers: [],
    steveReaction: createDefaultSteveReaction(),
    keyQuotes: [],
    overallAssessment: createDefaultOverallAssessment(),
    generatedAt: new Date().toISOString(),
    aiGenerated: false,
  }
}

export function createDefaultTimerState(): TimerState {
  return {
    currentSectionKey: null,
    sectionStartedAt: null,
    sectionElapsedMs: 0,
    totalElapsedMs: 0,
    isPaused: true,
  }
}

function createDefaultPainPoints(): PainPoint[] {
  return []
}

export function createDefaultCustomQuestions(): Record<InterviewSectionKey, InterviewQuestion[]> {
  return {
    warmup: [],
    gruendungsreise: [],
    schmerz_workarounds: [],
    ki_automatisierung: [],
    konzepttest_steve: [],
    abschluss: [],
  }
}

export function createDefaultInterviewConfig(): InterviewConfig {
  const coreFacts = createDefaultCoreFacts()
  const summary = createDefaultSummary(coreFacts)

  return {
    coreFacts,
    sectionNotes: createDefaultSectionNotes(),
    allQuotes: [] as Quote[],
    summary: {
      ...summary,
      painPoints: createDefaultPainPoints(),
    },
    checklist: createDefaultChecklist(),
    timerState: createDefaultTimerState(),
    customQuestions: createDefaultCustomQuestions(),
  }
}

export function createDefaultInterview(name = 'Unbenanntes Interview'): Interview {
  const now = new Date().toISOString()
  return {
    id: createId('interview'),
    name,
    config: createDefaultInterviewConfig(),
    status: 'geplant',
    scheduledAt: now,
    conductedAt: '',
    createdAt: now,
    updatedAt: now,
  }
}
