'use client'

import { create } from 'zustand'

import { useInterviewStore } from '@/stores/interview-store'
import type { InsightsSummary, Quote } from '@/types'

interface PainPointCluster {
  key: string
  label: string
  count: number
  avgIntensity: number
  interviews: string[]
}

interface SteveInterestTrendPoint {
  date: string
  stark: number
  hoeflich: number
  skeptisch: number
}

interface InsightsStore {
  getInsightsSummary: () => InsightsSummary
  getPainPointClusters: () => PainPointCluster[]
  getSteveInterestTrend: () => SteveInterestTrendPoint[]
}

function createEmptyInsights(): InsightsSummary {
  return {
    totalInterviews: 0,
    segmentBreakdown: {
      retrospektiv: 0,
      aktuell_gruendend: 0,
    },
    topPainPoints: [],
    commonWorkarounds: [],
    steveInterestDistribution: {
      stark: 0,
      hoeflich: 0,
      skeptisch: 0,
    },
    avgSteveFit: 0,
    aiAttitudeDistribution: {
      enthusiastisch: 0,
      offen: 0,
      neutral: 0,
      skeptisch: 0,
      ablehnend: 0,
    },
    topQuotes: [],
  }
}

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function sortQuotes(quotes: Quote[]) {
  return [...quotes].sort((a, b) => {
    if (a.isVerbatim !== b.isVerbatim) {
      return a.isVerbatim ? -1 : 1
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

function computeInsights(): InsightsSummary {
  const interviews = useInterviewStore.getState().interviews
  const summary = createEmptyInsights()

  if (!interviews.length) {
    return summary
  }

  summary.totalInterviews = interviews.length

  const painMap = new Map<string, { label: string; count: number; intensitySum: number }>()
  const workaroundMap = new Map<string, { label: string; count: number }>()
  const allQuotes: Quote[] = []

  let steveFitSum = 0

  interviews.forEach((interview) => {
    const { coreFacts, summary: interviewSummary } = interview.config

    summary.segmentBreakdown[coreFacts.segment] += 1
    summary.steveInterestDistribution[interviewSummary.steveReaction.interestLevel] += 1
    summary.aiAttitudeDistribution[interviewSummary.aiAttitude] += 1
    steveFitSum += interviewSummary.overallAssessment.steveFitScore

    interviewSummary.painPoints.forEach((painPoint) => {
      const key = normalizeText(painPoint.description)
      if (!key) return

      const current = painMap.get(key) ?? {
        label: painPoint.description.trim(),
        count: 0,
        intensitySum: 0,
      }

      painMap.set(key, {
        label: current.label,
        count: current.count + 1,
        intensitySum: current.intensitySum + painPoint.intensity,
      })
    })

    interviewSummary.workaroundsAttempted.forEach((workaround) => {
      const key = normalizeText(workaround)
      if (!key) return

      const current = workaroundMap.get(key) ?? {
        label: workaround.trim(),
        count: 0,
      }

      workaroundMap.set(key, {
        label: current.label,
        count: current.count + 1,
      })
    })

    allQuotes.push(...interview.config.allQuotes)
  })

  summary.topPainPoints = Array.from(painMap.values())
    .map((item) => ({
      description: item.label,
      count: item.count,
      avgIntensity: item.count > 0 ? item.intensitySum / item.count : 0,
    }))
    .sort((a, b) => b.count - a.count || b.avgIntensity - a.avgIntensity)
    .slice(0, 10)

  summary.commonWorkarounds = Array.from(workaroundMap.values())
    .map((item) => ({
      description: item.label,
      count: item.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  summary.avgSteveFit = steveFitSum / interviews.length
  summary.topQuotes = sortQuotes(allQuotes).slice(0, 12)

  return summary
}

function computePainPointClusters(): PainPointCluster[] {
  const interviews = useInterviewStore.getState().interviews
  const map = new Map<string, PainPointCluster>()

  interviews.forEach((interview) => {
    interview.config.summary.painPoints.forEach((painPoint) => {
      const key = normalizeText(painPoint.description)
      if (!key) return

      const current = map.get(key) ?? {
        key,
        label: painPoint.description.trim(),
        count: 0,
        avgIntensity: 0,
        interviews: [],
      }

      const totalIntensity = current.avgIntensity * current.count + painPoint.intensity
      const nextCount = current.count + 1

      map.set(key, {
        ...current,
        count: nextCount,
        avgIntensity: totalIntensity / nextCount,
        interviews: current.interviews.includes(interview.id)
          ? current.interviews
          : [...current.interviews, interview.id],
      })
    })
  })

  return Array.from(map.values()).sort((a, b) => b.count - a.count || b.avgIntensity - a.avgIntensity)
}

function computeSteveTrend(): SteveInterestTrendPoint[] {
  const interviews = [...useInterviewStore.getState().interviews].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

  const map = new Map<string, SteveInterestTrendPoint>()

  interviews.forEach((interview) => {
    const date = new Date(interview.createdAt).toISOString().slice(0, 10)
    const current =
      map.get(date) ??
      {
        date,
        stark: 0,
        hoeflich: 0,
        skeptisch: 0,
      }

    current[interview.config.summary.steveReaction.interestLevel] += 1
    map.set(date, current)
  })

  return Array.from(map.values())
}

export const useInsightsStore = create<InsightsStore>(() => ({
  getInsightsSummary: () => computeInsights(),
  getPainPointClusters: () => computePainPointClusters(),
  getSteveInterestTrend: () => computeSteveTrend(),
}))
