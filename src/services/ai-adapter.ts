import type {
  CoreFacts,
  InsightsSummary,
  InterviewSectionKey,
  InterviewSegment,
  JTBDAnalysis,
  PainPoint,
  PostInterviewSummary,
  Quote,
  SectionNote,
} from '@/types'

export interface AIInterviewService {
  generateSummary(input: {
    coreFacts: CoreFacts
    sectionNotes: Record<InterviewSectionKey, SectionNote>
    allQuotes: Quote[]
  }): Promise<Partial<PostInterviewSummary>>

  extractPainPoints(input: {
    sectionNotes: string
    quotes: Quote[]
  }): Promise<PainPoint[]>

  generateJTBD(input: {
    gruendungsreiseNotes: string
    schmerzNotes: string
  }): Promise<JTBDAnalysis>

  synthesizeInsights(input: {
    interviews: Array<{ coreFacts: CoreFacts; summary: PostInterviewSummary }>
  }): Promise<InsightsSummary>

  suggestFollowUpQuestions(input: {
    sectionKey: InterviewSectionKey
    currentNotes: string
    segment: InterviewSegment
  }): Promise<string[]>
}
