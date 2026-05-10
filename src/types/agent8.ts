export interface AEOEntry {
  id: string
  date: string       // YYYY-MM-DD
  total: number
  visibility: number
  content: number
  authority: number
  technical: number
  notes: string
}

export type WeekStatus = 'Improving' | 'Stable' | 'Declining'

export interface WeekComparison {
  status: WeekStatus
  delta: number
  subDeltas: { label: string; delta: number }[]
  analysis: string
  recommendations: string[]
}
