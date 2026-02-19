# Interviewleitfaden-App -- Implementation Plan

## Context

The Beanies needs to conduct structured discovery interviews with founders to validate STEVE and improve the product. A detailed interview outline already exists in Obsidian (`Discovery Interview Outline.md`) with 6 sections, segment-aware questions (Retrospektiv vs. Aktuell gründend), and a structured post-interview summary template. This app digitizes that workflow into an interactive tool for preparing, conducting, and analyzing founder interviews -- following the exact architecture of the Brand_Book_Generator_v1.2.

**Goal:** An app that guides interviewers through the discovery process, captures structured findings, and aggregates insights across interviews for product improvement.

---

## Architecture

Mirror the Brand_Book_Generator_v1.2 exactly:

- **Framework:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **State:** Zustand v5 with localStorage persistence
- **Location:** `apps/Interviewleitfaden-App/`
- **No backend** -- pure client-side, localStorage only

---

## Data Model (`src/types/index.ts`)

### Core Types

| Type | Purpose |
|------|---------|
| `Interview` | Top-level entity (id, name, config, status, timestamps) |
| `InterviewConfig` | All interview data (coreFacts, sectionNotes, quotes, summary, checklist, timerState) |
| `CoreFacts` | Interviewee metadata (name, segment, industry, team size, contact) |
| `SectionNote` | Notes per interview section (content text + quotes) |
| `Quote` | Verbatim quote with section reference |
| `PostInterviewSummary` | Structured summary (JTBD, pain points, AI attitude, STEVE reaction, assessment) |
| `JTBDAnalysis` | Jobs-to-be-done analysis (trigger, push/pull factors, anxiety, habit) |
| `PainPoint` | Ranked pain point (description, intensity 1-5, current solution, cost) |
| `SteveReaction` | STEVE concept test results (first reaction, interest level, WTP, concerns) |
| `OverallAssessment` | Scoring (relevance, pain intensity, STEVE-fit, follow-up priority) |
| `TimerState` | Section timer tracking (current section, elapsed time, paused state) |
| `InsightsSummary` | Aggregated cross-interview analysis |

### Enums/Literals

- `InterviewSegment`: `'retrospektiv' | 'aktuell_gruendend'`
- `InterviewStatus`: `'geplant' | 'in_durchfuehrung' | 'abgeschlossen'`
- `InterviewSectionKey`: `'warmup' | 'gruendungsreise' | 'schmerz_workarounds' | 'ki_automatisierung' | 'konzepttest_steve' | 'abschluss'`
- `PainIntensity`: 1-5 scale
- `SteveInterestLevel`: `'stark' | 'hoeflich' | 'skeptisch'`
- `AIAttitude`: `'offen' | 'neutral' | 'skeptisch' | 'ablehnend'`
- `FollowUpPriority`: `'hoch' | 'mittel' | 'niedrig'`

### Full Type Definitions

```typescript
// --- Enums / Literals ---

export type InterviewSegment = 'retrospektiv' | 'aktuell_gruendend'
export type InterviewStatus = 'geplant' | 'in_durchfuehrung' | 'abgeschlossen' | 'abgebrochen'
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
}

export interface InterviewQuestion {
  id: string
  text: string
  segment: 'both' | InterviewSegment
  isFollowUp: boolean
  category?: string
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
}

// --- Interview (top-level) ---

export interface Interview {
  id: string
  name: string
  config: InterviewConfig
  status: InterviewStatus
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
```

---

## Stores (`src/stores/`)

### 1. `interview-store.ts` (primary, analogous to `brand-store.ts`)

- Persisted to localStorage key `'interview-guide-interviews'`
- CRUD for `Interview[]` + `activeInterviewId`
- `withUpdatedInterview()` helper (mirrors `withUpdatedProject()`)
- Granular updaters: `updateCoreFacts()`, `updateSectionNote()`, `addQuote()`, `updateSummary()`, `addPainPoint()`, etc.
- `normalizeInterview()` for schema migration

```typescript
interface InterviewStore {
  interviews: Interview[]
  activeInterviewId: string
  createInterview: (name?: string) => string
  duplicateInterview: (id: string) => string | null
  deleteInterview: (id: string) => void
  renameInterview: (id: string, name: string) => void
  setActiveInterview: (id: string) => void
  getActiveInterview: () => Interview
  updateStatus: (status: InterviewStatus) => void
  updateCoreFacts: (payload: Partial<CoreFacts>) => void
  updateSectionNote: (sectionKey: InterviewSectionKey, content: string) => void
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt'>) => void
  removeQuote: (quoteId: string) => void
  updateChecklist: (itemId: string, checked: boolean) => void
  updateTimerState: (payload: Partial<TimerState>) => void
  updateSummary: (payload: Partial<PostInterviewSummary>) => void
  updateJTBD: (payload: Partial<JTBDAnalysis>) => void
  addPainPoint: (painPoint: Omit<PainPoint, 'id'>) => void
  updatePainPoint: (id: string, payload: Partial<PainPoint>) => void
  removePainPoint: (id: string) => void
  reorderPainPoints: (fromIndex: number, toIndex: number) => void
  updateSteveReaction: (payload: Partial<SteveReaction>) => void
  updateOverallAssessment: (payload: Partial<OverallAssessment>) => void
  replaceActiveConfig: (config: InterviewConfig) => void
}
```

### 2. `wizard-store.ts` (UI state, adapted from Brand Book)

- Per-interview wizard progress tracking
- Persisted to localStorage key `'interview-guide-wizard'`

### 3. `insights-store.ts` (computed, not persisted)

- Aggregation methods over all interviews
- `getInsightsSummary()`, `getPainPointClusters()`, `getSteveInterestTrend()`

---

## Pages & Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Editor | Split view: wizard (left) + live summary preview (right) |
| `/interviews` | Interview List | Manage all interviews (create/duplicate/delete) |
| `/conduct` | Conducting Mode | Tablet-optimized live interview mode with timer |
| `/preview` | Full Preview | Print-friendly complete interview summary |
| `/insights` | Insights Dashboard | Cross-interview aggregation and patterns |

---

## Wizard Steps (10 steps in editor view)

| # | Step | Component | Content |
|---|------|-----------|---------|
| 0 | Basisdaten | `CoreFactsStep` | Name, segment selection, industry, contact info |
| 1 | Checkliste | `ChecklistStep` | Pre-interview preparation checklist (7 items from outline) |
| 2 | Warm-up | `WarmupStep` | Section 1 notes + segment-filtered questions |
| 3 | Gruendungsreise | `GruendungsreiseStep` | Section 2 notes + timeline questions |
| 4 | Schmerz & Workarounds | `SchmerzStep` | Section 3 notes + pain discovery questions |
| 5 | KI & Automatisierung | `KIStep` | Section 4 notes + AI attitude questions |
| 6 | STEVE-Test | `SteveTestStep` | Section 5 notes + concept pitch + reaction capture |
| 7 | Abschluss | `AbschlussStep` | Section 6 notes + follow-up + referrals |
| 8 | Zusammenfassung | `SummaryStep` | Post-interview structured summary (JTBD, pain points, workarounds) |
| 9 | Bewertung | `AssessmentStep` | Overall scoring + assessment |

Each section step (2-7) shows:

- Section title + time allocation badge
- Questions filtered by selected segment (Retrospektiv vs. Aktuell gruendend)
- Freeform note textarea
- Quote capture button (marks verbatim quotes)
- "NICHT TUN" reminders from the original outline

---

## Conducting Mode (`/conduct`)

Tablet-optimized interface for live interviews:

- **One section at a time**, full screen
- **Prominent countdown timer** per section (green -> yellow -> red)
- **Large touch targets** (min 48px)
- **Floating quote capture button** always visible
- **Segment-filtered questions** displayed as prompts
- **Auto-save** on every keystroke (Zustand persist)
- **Swipe/button navigation** between sections
- Timer persists through browser refresh via `TimerState` in store

### Key components:

- `ConductShell.tsx` -- fullscreen layout
- `SectionTimer.tsx` -- visual countdown
- `SectionCard.tsx` -- current section with questions + notes
- `QuickQuoteCapture.tsx` -- floating button
- `SectionProgress.tsx` -- progress indicator (6 dots)

---

## AI Service (`src/services/`)

### Interface (`ai-adapter.ts`)

```typescript
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
```

### Mock (`ai-mock.ts`)

Returns plausible German-language results with simulated delay (800-1500ms).

### AI Suggest Buttons in:

- SummaryStep: "KI-Zusammenfassung generieren"
- SchmerzStep: "Schmerzpunkte extrahieren"
- GruendungsreiseStep: "JTBD analysieren"
- Insights dashboard: "Insights synthetisieren"

---

## Config & Defaults (`src/config/defaults.ts`)

Content pulled directly from the Discovery Interview Outline:

- **6 interview sections** with all questions from the outline, durations, descriptions
- **Questions tagged by segment** (`'both' | 'retrospektiv' | 'aktuell_gruendend'`)
- **Default checklist** (7 items from the outline's interviewer checklist)
- **STEVE concept pitch text** (30-second version from outline)
- **"NICHT TUN" reminders** per section
- **Factory functions:** `createDefaultInterviewConfig()`, `createDefaultInterview()`
- **Wizard step labels** (German)

---

## Export (`src/lib/export.ts`)

- `downloadInterviewJSON()` -- full interview data as JSON
- `downloadInterviewMarkdown()` -- structured summary (PDF-ready via print)
- `downloadInsightsReport()` -- cross-interview findings as Markdown
- `downloadInterviewsCSV()` -- tabular export for spreadsheet analysis
- Print CSS in `globals.css` for browser print

---

## Insights Dashboard (`/insights`)

Components for cross-interview analysis:

- **PainPointAggregation** -- top pain points ranked by frequency + intensity
- **SteveInterestChart** -- interest level distribution
- **WorkaroundPatterns** -- common workarounds across interviews
- **SegmentBreakdown** -- retrospektiv vs. aktuell gruendend distribution
- **AIAttitudeOverview** -- AI attitude distribution
- **QuoteWall** -- most valuable verbatim quotes
- **ScoreOverview** -- average relevance, pain, STEVE-fit scores

---

## Files to Reuse from Brand_Book_Generator_v1.2

| Source File | Reuse Strategy |
|-------------|---------------|
| `src/stores/brand-store.ts` | Adapt pattern for `interview-store.ts` (withUpdated*, normalize, persist) |
| `src/stores/wizard-store.ts` | Copy and rename keys |
| `src/components/wizard/WizardShell.tsx` | Adapt (change steps array, keep layout) |
| `src/components/wizard/AISuggestButton.tsx` | Copy as-is |
| `src/components/ui/*` | Copy all shadcn components |
| `src/components/motion/*` | Copy FadeIn, SlideUp, StaggerChildren |
| `src/components/navigation/*` | Copy ScrollToTop, MobileNav |
| `src/lib/utils.ts` | Copy (cn, createId) |
| `src/lib/use-hydrated.ts` | Copy as-is |
| `src/services/ai-adapter.ts` | Adapt interface for interview methods |
| `src/app/globals.css` | Copy brand tokens, add interview-specific tokens |
| `src/app/layout.tsx` | Copy, change metadata |
| `package.json` | Copy, rename, same dependencies |
| `next.config.ts`, `postcss.config.mjs`, `tsconfig.json` | Copy as-is |

---

## File Structure

```
apps/Interviewleitfaden-App/
  package.json
  next.config.ts
  tsconfig.json
  postcss.config.mjs
  PLAN.md
  public/
    favicon.svg
  src/
    app/
      layout.tsx
      page.tsx                      # Editor (split view)
      globals.css
      error.tsx
      preview/
        page.tsx                    # Full summary preview
      interviews/
        page.tsx                    # Interview management
      conduct/
        page.tsx                    # Tablet conducting mode
      insights/
        page.tsx                    # Cross-interview dashboard
    components/
      layout/
        Header.tsx
      ui/
        button.tsx, card.tsx, input.tsx, label.tsx, textarea.tsx,
        tabs.tsx, slider.tsx, progress.tsx, badge.tsx, dialog.tsx,
        select.tsx, radio-group.tsx, checkbox.tsx,
        timer-display.tsx, score-indicator.tsx, quote-badge.tsx
      wizard/
        WizardShell.tsx
        AISuggestButton.tsx
        steps/
          types.ts
          CoreFactsStep.tsx
          ChecklistStep.tsx
          WarmupStep.tsx
          GruendungsreiseStep.tsx
          SchmerzStep.tsx
          KIStep.tsx
          SteveTestStep.tsx
          AbschlussStep.tsx
          SummaryStep.tsx
          AssessmentStep.tsx
      conduct/
        ConductShell.tsx
        SectionTimer.tsx
        SectionCard.tsx
        QuestionList.tsx
        QuickQuoteCapture.tsx
        QuoteList.tsx
        SectionProgress.tsx
        PauseOverlay.tsx
      summary/
        SummaryShell.tsx
        CoverSection.tsx
        CoreFactsSection.tsx
        JTBDSection.tsx
        PainPointsSection.tsx
        WorkaroundsSection.tsx
        AIAttitudeSection.tsx
        SteveReactionSection.tsx
        KeyQuotesSection.tsx
        AssessmentSection.tsx
        SectionWrapper.tsx
      insights/
        InsightsDashboard.tsx
        PainPointAggregation.tsx
        SteveInterestChart.tsx
        WorkaroundPatterns.tsx
        SegmentBreakdown.tsx
        AIAttitudeOverview.tsx
        QuoteWall.tsx
        InterviewTimeline.tsx
        ScoreOverview.tsx
      navigation/
        ScrollToTop.tsx
        MobileNav.tsx
      motion/
        FadeIn.tsx
        SlideUp.tsx
        StaggerChildren.tsx
    stores/
      interview-store.ts
      wizard-store.ts
      insights-store.ts
    config/
      defaults.ts
    services/
      ai-adapter.ts
      ai-mock.ts
    lib/
      utils.ts
      use-hydrated.ts
      export.ts
    hooks/
      use-timer.ts
    types/
      index.ts
```

---

## Implementation Phases

### Phase 1: Foundation + Types + Store
- Scaffold project (copy configs from Brand Book)
- `types/index.ts`, `config/defaults.ts`, `lib/utils.ts`
- `stores/interview-store.ts`, `stores/wizard-store.ts`
- Copy `components/ui/` from Brand Book
- Basic `app/layout.tsx`, `app/page.tsx`, `app/globals.css`

### Phase 2: Wizard + Editor View
- `WizardShell.tsx` adapted from Brand Book
- All 10 wizard step components
- Split view layout (wizard | summary preview)
- Segment-aware question filtering

### Phase 3: Summary Preview
- All summary section components (Cover, CoreFacts, JTBD, PainPoints, etc.)
- `SummaryShell.tsx` assembling all sections
- `/preview` page with print-friendly layout

### Phase 4: Interview Management + Export
- `/interviews` page (list, create, duplicate, delete)
- Export functions (JSON, Markdown, CSV)
- Status management flow
- Print CSS

### Phase 5: Conducting Mode
- `/conduct` page with tablet-optimized UI
- Timer logic (`use-timer.ts` hook)
- Section-by-section flow with floating quote capture
- Large touch targets, minimal chrome

### Phase 6: AI Integration
- `ai-adapter.ts` interface + `ai-mock.ts`
- AI suggest buttons in wizard steps
- Summary generation from raw notes

### Phase 7: Insights Dashboard
- `insights-store.ts` with aggregation logic
- `/insights` page with all dashboard components
- Cross-interview pattern visualization

---

## Verification

1. **Run the app:** `cd apps/Interviewleitfaden-App && npm install && npm run dev`
2. **Create an interview:** Verify CRUD on `/interviews` page
3. **Walk through wizard:** Fill in all 10 steps, verify data persists on refresh
4. **Test segment filtering:** Switch between Retrospektiv/Aktuell gruendend, verify questions change
5. **Test conducting mode:** Run through `/conduct` with timer, capture quotes
6. **Test export:** Download JSON + Markdown, verify completeness
7. **Test insights:** Create 3+ interviews, verify aggregation on `/insights`
8. **Test print:** Use browser print on `/preview`, verify clean layout
9. **Test tablet:** Resize to tablet viewport, verify conducting mode usability
10. **Type check:** `npm run type-check` passes with no errors
