export type BriefStatus =
  | 'Draft'
  | 'Needs Marketing Review'
  | 'Needs Compliance Review'
  | 'Approved'
  | 'Rejected'

export interface PageStructureItem {
  type: 'h1' | 'h2' | 'block' | 'cta'
  text: string
}

export interface ContentBrief {
  opportunityId: string
  opportunityLabel: string
  generatedAt: string
  status: BriefStatus
  objective: string
  targetQueries: string[]
  customerInsight: string
  cep: { label: string; explanation: string }
  pageStructure: PageStructureItem[]
  answerBlock: string
  faq: { question: string; answer: string }[]
  justificationAttributes: string[]
  requiredEvidence: string[]
  competitorAngle: string
  geoChecklist: string[]
  schemaRecommendations: string[]
}

export interface SampleOpportunity {
  id: string
  themeId: string
  label: string
  cep: string
  intentStage: string
  gapLevel: 'High' | 'Medium' | 'Low'
  priorityScore: number
}
