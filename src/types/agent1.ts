export type IntentStage =
  | 'Awareness'
  | 'Consideration'
  | 'Comparison'
  | 'Purchase'
  | 'Post-purchase / Claim'

export type GapLevel = 'High' | 'Medium' | 'Low'

export type ReviewStatus = 'New' | 'Needs Review' | 'Approved' | 'Rejected'

export interface RawEntry {
  source: string
  date: string
  text: string
  competitor: string
  url: string
}

export interface ContentRecommendation {
  format: string
  title: string
  explanation: string
  geoReason: string
  schema: string
}

export interface ThemeConfig {
  id: string
  label: string
  keywords: string[]
  cep: string
  intentStage: IntentStage
  commercialScore: number      // 0–20
  urgencyScore: number         // 0–20
  ohraOpportunityScore: number // 0–20
  recommendation: ContentRecommendation
}

export interface PriorityScore {
  frequency: number           // 0–20
  commercialRelevance: number // 0–20
  urgency: number             // 0–20
  competitorGap: number       // 0–20
  ohraOpportunity: number     // 0–20
  total: number               // 0–100
}

export interface ThemeResult {
  theme: ThemeConfig
  entries: RawEntry[]
  exampleTexts: string[]
  competitorMentions: Record<string, number>
  topCompetitor: string
  topCompetitorCount: number
  ohraCount: number
  gapLevel: GapLevel
  priorityScore: PriorityScore
}

export interface AnalysisResult {
  totalEntries: number
  themes: ThemeResult[]
  uncategorized: number
}
