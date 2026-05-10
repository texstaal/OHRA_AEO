export type Sentiment = 'Positive' | 'Neutral' | 'Negative'
export type EarnedStatus = 'New' | 'Needs PR Review' | 'Needs Marketing Review' | 'Approved' | 'Rejected'
export type GapLevel = 'High' | 'Medium' | 'Low'

export interface Mention {
  id: string
  source: string
  date: string
  text: string
  brands: string[]
  topic: string
  sentiment: Sentiment
  authorityScore: number
  url: string
}

export interface BrandShare {
  brand: string
  count: number
  pct: number
}

export interface TopicVisibility {
  topic: string
  ohraCount: number
  topCompetitor: string
  topCompetitorCount: number
  gapLevel: GapLevel
  opportunity: string
}

export interface SourceGap {
  source: string
  authorityScore: number
  ohraMentions: number
  competitorMentions: number
  gapLevel: GapLevel
  action: string
}

export interface EarnedOpportunity {
  id: string
  topic: string
  insight: string
  priority: 'High' | 'Medium' | 'Low'
}

export interface TrustScore {
  total: number
  mentionScore: number
  authorityScore: number
  sentimentScore: number
  topicScore: number
}

export interface SentimentTally {
  positive: number
  neutral: number
  negative: number
}
