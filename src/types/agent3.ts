export type DraftStatus =
  | 'Draft Generated'
  | 'Needs Marketing Review'
  | 'Needs Compliance Review'
  | 'Approved'
  | 'Rejected'

export interface DraftSection {
  heading: string
  body: string
  requiresProof?: boolean // flags sections that need OHRA-specific data before publishing
}

export interface ComparisonTable {
  caption: string
  headers: string[]
  rows: string[][]
}

export interface GeoItem {
  item: string
  reason: string // why this element helps GEO/AEO
}

export interface ContentDraft {
  opportunityId: string
  opportunityLabel: string
  generatedAt: string
  status: DraftStatus
  h1: string
  intro: string
  answerBlock: string
  sections: DraftSection[]
  comparisonTable?: ComparisonTable
  faq: { question: string; answer: string }[]
  cta: string
  complianceNotes: string[]
  geoItems: GeoItem[]
}
