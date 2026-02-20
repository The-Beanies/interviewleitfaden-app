// --- Enums / Literals ---

export type InterviewSegment = 'retrospektiv' | 'aktuell_gruendend'
export type InterviewStatus = 'geplant' | 'in_durchfuehrung' | 'abgeschlossen' | 'abgebrochen'
export type InterviewVisibility = 'private' | 'public'
export type PainIntensity = 1 | 2 | 3 | 4 | 5
export type SteveInterestLevel = 'stark' | 'hoeflich' | 'skeptisch'
export type AIAttitude = 'enthusiastisch' | 'offen' | 'neutral' | 'skeptisch' | 'ablehnend'
export type FollowUpPriority = 'hoch' | 'mittel' | 'niedrig' | 'keine'

export type InterviewSectionKey =
  | 'warmup'
  | 'gruendungsreise'
  | 'schmerz_workarounds'
  | 'ki_automatisierung'
  | 'konzepttest_steve'
  | 'abschluss'

// --- Interview Section Config ---

export interface InterviewSectionConfig {
  key: InterviewSectionKey
  label: string
  durationMinutes: number
  description: string
  questions: InterviewQuestion[]
  donts: string[]
}

export interface InterviewQuestion {
  id: string
  text: string
  segment: 'both' | InterviewSegment
  isFollowUp: boolean
  category?: string
}

// --- Additional Founder ---

export interface AdditionalFounder {
  id: string
  name: string
  role: string
  contact: string
}

// --- Section Notes ---

export interface SectionNote {
  id: string
  sectionKey: InterviewSectionKey
  content: string
  quotes: Quote[]
  timestamp: string
}

// --- Quote ---

export interface Quote {
  id: string
  text: string
  sectionKey: InterviewSectionKey
  isVerbatim: boolean
  createdAt: string
}

// --- Core Facts ---

export interface CoreFacts {
  intervieweeName: string
  segment: InterviewSegment
  industry: string
  foundingDate: string
  teamSize: string
  location: string
  contactEmail: string
  contactPhone: string
  referredBy: string
  additionalFounders: AdditionalFounder[]
  businessDescription: string
  notes: string
}

// --- JTBD Analysis ---

export interface JTBDAnalysis {
  trigger: string
  pushFactors: string[]
  pullFactors: string[]
  anxiety: string[]
  habit: string[]
}

// --- Pain Point ---

export interface PainPoint {
  id: string
  description: string
  intensity: PainIntensity
  frequency: string
  currentSolution: string
  costOfProblem: string
  rank: number
}

// --- STEVE Reaction ---

export interface SteveReaction {
  firstReaction: string
  interestLevel: SteveInterestLevel
  mostInterestingFeature: string
  useCase: string
  willingnessToPayMonthly: string
  concerns: string
  quotesAboutSteve: string[]
}

// --- Overall Assessment ---

export interface OverallAssessment {
  relevanceScore: PainIntensity
  painIntensityScore: PainIntensity
  steveFitScore: PainIntensity
  followUpPriority: FollowUpPriority
  notes: string
}

// --- Post-Interview Summary ---

export interface PostInterviewSummary {
  coreFacts: CoreFacts
  jtbd: JTBDAnalysis
  painPoints: PainPoint[]
  workaroundsAttempted: string[]
  aiAttitude: AIAttitude
  aiToolsUsed: string[]
  aiBarriers: string[]
  steveReaction: SteveReaction
  keyQuotes: Quote[]
  overallAssessment: OverallAssessment
  generatedAt: string
  aiGenerated: boolean
}

// --- Timer ---

export interface TimerState {
  currentSectionKey: InterviewSectionKey | null
  sectionStartedAt: string | null
  sectionElapsedMs: number
  totalElapsedMs: number
  isPaused: boolean
}

// --- Checklist ---

export interface ChecklistItem {
  id: string
  label: string
  checked: boolean
}

// --- Interview Config ---

export interface InterviewConfig {
  coreFacts: CoreFacts
  sectionNotes: Record<InterviewSectionKey, SectionNote>
  allQuotes: Quote[]
  summary: PostInterviewSummary
  checklist: ChecklistItem[]
  timerState: TimerState
  customQuestions: Record<InterviewSectionKey, InterviewQuestion[]>
}

// --- Interview (top-level) ---

export interface Interview {
  id: string
  name: string
  config: InterviewConfig
  status: InterviewStatus
  visibility: InterviewVisibility
  scheduledAt: string
  conductedAt: string
  createdAt: string
  updatedAt: string
}

// --- Wizard ---

export interface WizardState {
  currentStep: number
  completedSteps: number[]
  validationErrors: Record<number, string[]>
}

// --- Insights ---

export interface InsightsSummary {
  totalInterviews: number
  segmentBreakdown: Record<InterviewSegment, number>
  topPainPoints: Array<{ description: string; count: number; avgIntensity: number }>
  commonWorkarounds: Array<{ description: string; count: number }>
  steveInterestDistribution: Record<SteveInterestLevel, number>
  avgSteveFit: number
  aiAttitudeDistribution: Record<AIAttitude, number>
  topQuotes: Quote[]
}
