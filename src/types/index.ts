export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple'

export type AgentStatus = 'active' | 'idle' | 'review' | 'coming-soon'

export interface KPI {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  color: 'navy' | 'green' | 'purple' | 'orange' | 'red' | 'blue'
  icon: string
}

export interface AEOPlatformScore {
  platform: 'OpenAI' | 'Perplexity' | 'Gemini'
  overall: number
  maxOverall: 100
  brandRecognition: number
  brandRecognitionMax: 20
  marketScore: number
  marketScoreMax: 10
  presenceQuality: number
  presenceQualityMax: 20
  brandSentiment: number
  brandSentimentMax: 40
  shareOfVoice: number
  shareOfVoiceMax: 10
}

export interface PipelineStep {
  id: number
  label: string
  agent?: string
  agentNumber?: number
  humanReview?: string
  status: 'done' | 'active' | 'pending'
  color: string
}

export interface AgentDefinition {
  id: number
  slug: string
  name: string
  tagline: string
  description: string
  layer: 1 | 2 | 3
  color: string
  accentClass: string
  status: AgentStatus
  inputLabel: string
  outputLabel: string
  humanReviewLabel: string
  comingNext: string
}

export interface LayerDefinition {
  id: 1 | 2 | 3
  name: string
  subtitle: string
  agentIds: number[]
  color: string
  borderClass: string
  bgClass: string
}
