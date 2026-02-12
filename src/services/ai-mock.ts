import { createId } from '@/lib/utils'
import type { AIInterviewService } from '@/services/ai-adapter'
import type {
  AIAttitude,
  InsightsSummary,
  JTBDAnalysis,
  PainPoint,
  SteveInterestLevel,
} from '@/types'

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

function randomDelay() {
  return 800 + Math.round(Math.random() * 700)
}

function toSentences(input: string): string[] {
  return input
    .split(/[\n\.]/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function pick<T>(values: T[], index = 0): T {
  return values[index % values.length]
}

function inferAIAttitude(text: string): AIAttitude {
  const lower = text.toLowerCase()
  if (lower.includes('liebe') || lower.includes('super') || lower.includes('viel')) return 'enthusiastisch'
  if (lower.includes('offen') || lower.includes('neugierig')) return 'offen'
  if (lower.includes('skept')) return 'skeptisch'
  if (lower.includes('ablehn')) return 'ablehnend'
  return 'neutral'
}

function inferSteveInterest(text: string): SteveInterestLevel {
  const lower = text.toLowerCase()
  if (lower.includes('stark') || lower.includes('wow') || lower.includes('sofort')) return 'stark'
  if (lower.includes('skept') || lower.includes('unnötig')) return 'skeptisch'
  return 'hoeflich'
}

export const mockAIService: AIInterviewService = {
  async generateSummary({ coreFacts, sectionNotes, allQuotes }) {
    await wait(randomDelay())

    const concatenatedNotes = Object.values(sectionNotes)
      .map((section) => section.content)
      .join('\n')

    const statements = toSentences(concatenatedNotes)
    const firstPain = statements[0] ?? 'Unklare Priorisierung in der Gründungsphase'
    const secondPain = statements[1] ?? 'Zu viel manueller Aufwand in wiederkehrenden Aufgaben'

    return {
      aiGenerated: true,
      generatedAt: new Date().toISOString(),
      workaroundsAttempted: ['Tabellen/Notion', 'Ad-hoc Beratung', 'Einzeltools ohne Integration'],
      aiAttitude: inferAIAttitude(concatenatedNotes),
      aiToolsUsed: ['ChatGPT', 'Notion AI'],
      aiBarriers: ['Fehlende Zeit für Setup', 'Unsicherheit bei Datenqualität'],
      painPoints: [
        {
          id: createId('pain'),
          description: firstPain,
          intensity: 4,
          frequency: 'mehrmals pro Woche',
          currentSolution: 'manuelle Listen und Erinnerungen',
          costOfProblem: 'Zeitverlust und Entscheidungsmüdigkeit',
          rank: 1,
        },
        {
          id: createId('pain'),
          description: secondPain,
          intensity: 3,
          frequency: 'wöchentlich',
          currentSolution: 'Workarounds mit mehreren Tools',
          costOfProblem: 'Kontextwechsel und Fehleranfälligkeit',
          rank: 2,
        },
      ],
      steveReaction: {
        firstReaction: 'Interessant, wenn es wirklich Zeit spart.',
        interestLevel: inferSteveInterest(sectionNotes.konzepttest_steve.content),
        mostInterestingFeature: 'Automatisierte Priorisierung nächster Schritte',
        useCase: 'Wöchentliche Planung und Aufgabenbündelung',
        willingnessToPayMonthly: '39-79 EUR',
        concerns: 'Datenschutz und Integration in bestehende Tools',
        quotesAboutSteve: allQuotes
          .filter((quote) => quote.sectionKey === 'konzepttest_steve')
          .map((quote) => quote.text)
          .slice(0, 3),
      },
      jtbd: {
        trigger: 'Zeitdruck und Unsicherheit in operativen Entscheidungen',
        pushFactors: ['Zu viele offene To-dos', 'Manuelle Prozesse'],
        pullFactors: ['Schnellere Klarheit', 'Weniger Tool-Wechsel'],
        anxiety: ['Abhängigkeit von einer neuen Plattform', 'Lernaufwand'],
        habit: ['Weiterarbeit mit Tabellen', 'Ad-hoc Problemlösung'],
      },
      keyQuotes: allQuotes.slice(0, 6),
    }
  },

  async extractPainPoints({ sectionNotes, quotes }) {
    await wait(randomDelay())

    const sentences = toSentences(sectionNotes)
    const baseDescriptions = sentences.length
      ? sentences.slice(0, 3)
      : ['Manuelle Verwaltungsaufgaben kosten zu viel Zeit', 'Unklare Priorisierung im Tagesgeschäft']

    const points: PainPoint[] = baseDescriptions.map((description, index) => ({
      id: createId('pain'),
      description,
      intensity: pick([3, 4, 5], index),
      frequency: pick(['täglich', 'mehrmals pro Woche', 'wöchentlich'], index),
      currentSolution: pick(['Excel/Notion', 'Persönliche To-do-Listen', 'Externe Beratung'], index),
      costOfProblem: pick(
        ['Zeitverlust', 'Verpasste Chancen', 'Frustration und mentale Last'],
        index,
      ),
      rank: index + 1,
    }))

    if (quotes.length > 0) {
      points.push({
        id: createId('pain'),
        description: `Direktzitat-Cluster: ${quotes[0].text.slice(0, 80)}`,
        intensity: 4,
        frequency: 'mehrmals pro Monat',
        currentSolution: 'Situative Einzellösungen',
        costOfProblem: 'Inkonsistente Ergebnisse',
        rank: points.length + 1,
      })
    }

    return points
  },

  async generateJTBD({ gruendungsreiseNotes, schmerzNotes }) {
    await wait(randomDelay())

    const trigger = toSentences(gruendungsreiseNotes)[0] ?? 'Wachsender operativer Druck in der Gründungsphase'
    const pushRaw = toSentences(schmerzNotes)

    const jtbd: JTBDAnalysis = {
      trigger,
      pushFactors: pushRaw.slice(0, 3).length ? pushRaw.slice(0, 3) : ['Zu viele manuelle Aufgaben', 'Unklare Prioritäten'],
      pullFactors: ['Mehr Fokus auf Kund:innen', 'Schnellere Entscheidungen', 'Weniger Tool-Chaos'],
      anxiety: ['Fehlende Kontrolle über Daten', 'Abhängigkeit von Automatisierung'],
      habit: ['Bisherige Tabellen-Workflows', 'Ad-hoc Recherchen und Notizen'],
    }

    return jtbd
  },

  async synthesizeInsights({ interviews }) {
    await wait(randomDelay())

    const totalInterviews = interviews.length

    const summary: InsightsSummary = {
      totalInterviews,
      segmentBreakdown: {
        retrospektiv: interviews.filter((item) => item.coreFacts.segment === 'retrospektiv').length,
        aktuell_gruendend: interviews.filter((item) => item.coreFacts.segment === 'aktuell_gruendend').length,
      },
      topPainPoints: [],
      commonWorkarounds: [],
      steveInterestDistribution: {
        stark: interviews.filter((item) => item.summary.steveReaction.interestLevel === 'stark').length,
        hoeflich: interviews.filter((item) => item.summary.steveReaction.interestLevel === 'hoeflich').length,
        skeptisch: interviews.filter((item) => item.summary.steveReaction.interestLevel === 'skeptisch').length,
      },
      avgSteveFit:
        totalInterviews > 0
          ? interviews.reduce((acc, interview) => acc + interview.summary.overallAssessment.steveFitScore, 0) /
            totalInterviews
          : 0,
      aiAttitudeDistribution: {
        enthusiastisch: interviews.filter((item) => item.summary.aiAttitude === 'enthusiastisch').length,
        offen: interviews.filter((item) => item.summary.aiAttitude === 'offen').length,
        neutral: interviews.filter((item) => item.summary.aiAttitude === 'neutral').length,
        skeptisch: interviews.filter((item) => item.summary.aiAttitude === 'skeptisch').length,
        ablehnend: interviews.filter((item) => item.summary.aiAttitude === 'ablehnend').length,
      },
      topQuotes: interviews
        .flatMap((item) => item.summary.keyQuotes)
        .slice(0, 10),
    }

    const painMap = new Map<string, { count: number; intensitySum: number }>()
    const workaroundMap = new Map<string, number>()

    interviews.forEach((interview) => {
      interview.summary.painPoints.forEach((point) => {
        const key = point.description.trim().toLowerCase()
        const current = painMap.get(key) ?? { count: 0, intensitySum: 0 }
        painMap.set(key, {
          count: current.count + 1,
          intensitySum: current.intensitySum + point.intensity,
        })
      })

      interview.summary.workaroundsAttempted.forEach((workaround) => {
        const key = workaround.trim().toLowerCase()
        workaroundMap.set(key, (workaroundMap.get(key) ?? 0) + 1)
      })
    })

    summary.topPainPoints = Array.from(painMap.entries())
      .map(([description, value]) => ({
        description,
        count: value.count,
        avgIntensity: value.count > 0 ? value.intensitySum / value.count : 0,
      }))
      .sort((a, b) => b.count - a.count || b.avgIntensity - a.avgIntensity)
      .slice(0, 8)

    summary.commonWorkarounds = Array.from(workaroundMap.entries())
      .map(([description, count]) => ({ description, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    return summary
  },

  async suggestFollowUpQuestions({ sectionKey, currentNotes, segment }) {
    await wait(randomDelay())

    const signal = toSentences(currentNotes)[0] ?? 'diesem Punkt'

    return [
      `Kannst du mir ein konkretes Beispiel aus der letzten Woche zu "${signal}" geben?`,
      `Was war in der Situation der größte Engpass? (${sectionKey})`,
      `Wie würde sich dein Alltag verändern, wenn dieses Problem gelöst wäre?`,
      segment === 'retrospektiv'
        ? 'Wenn du zurückgehst: Was hätte dir damals am meisten geholfen?'
        : 'Welche Entscheidung musst du dazu in den nächsten 14 Tagen treffen?',
    ]
  },
}
