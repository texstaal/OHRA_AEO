export type FreshnessLabel = 'Fresh' | 'Needs Review' | 'Outdated' | 'Critical'
export type FreshnessStatus = 'New' | 'Needs Content Review' | 'Needs Compliance Review' | 'Approved for Update' | 'Rejected'
export type PriorityLabel = 'Low' | 'Medium' | 'High' | 'Critical'

export interface TrendSignal {
  id: string
  signal: string
  affectedTopics: string[]
  source: string
}

export interface ContentPage {
  id: string
  title: string
  topic: string
  cep: string
  slug: string
  lastUpdated: string          // '' if missing
  targetQuery: string
  contentSummary: string
  intentStage: string
  commercialRelevance: number  // 0–20 hardcoded weight
  trendSignalIds: string[]     // which trend signals affect this page
  competitorUpdates: { brand: string; lastUpdated: string }[]
  hasRecentExamples: boolean
  hasCurrentFAQ: boolean
  hasUpdatedSchema: boolean
  hasCurrentInternalLinks: boolean
  hasComplianceReview: boolean
}

export interface FreshnessChecklist {
  hasLastUpdatedDate: boolean
  hasRecentExamples: boolean
  hasCurrentFAQ: boolean
  hasUpdatedSchema: boolean
  hasCurrentInternalLinks: boolean
  hasComplianceReview: boolean
}

export interface CompetitorGap {
  brand: string
  theirDate: string
  ourDate: string
  daysDiff: number
  gapLevel: 'High' | 'Medium' | 'Low' | 'None'
}

export interface UpdateSuggestion {
  suggestion: string
  reason: string
  priority: 'High' | 'Medium' | 'Low'
}

export interface FreshnessReport {
  pageId: string
  pageTitle: string
  ageInDays: number | null
  freshnessLabel: FreshnessLabel
  priorityScore: number
  priorityLabel: PriorityLabel
  ageScore: number
  trendScore: number
  competitorScore: number
  commercialScore: number
  checklist: FreshnessChecklist
  competitorGaps: CompetitorGap[]
  suggestions: UpdateSuggestion[]
}
