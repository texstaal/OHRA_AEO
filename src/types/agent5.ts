export type TechnicalStatus =
  | 'Not Checked'
  | 'Needs Technical Review'
  | 'Needs Content Update'
  | 'Approved for Publishing Queue'
  | 'Rejected'

export type IssueSeverity = 'High' | 'Medium' | 'Low'

export type SchemaType =
  | 'FAQPage'
  | 'Article'
  | 'BreadcrumbList'
  | 'InsuranceAgency'
  | 'HowTo'

export interface PageFAQ {
  question: string
  answer: string
}

export interface TechnicalPage {
  id: string
  label: string
  intentStage: string
  gapLevel: 'High' | 'Medium' | 'Low'
  priorityScore: number
  h1: string
  headings: { level: 2 | 3; text: string }[]
  answerBlock: string      // direct answer text near top
  targetQuery: string
  faq: PageFAQ[]
  hasComparisonTable: boolean
  hasDisclaimer: boolean
  hasCTA: boolean
  seoTitle: string         // '' if missing
  metaDescription: string  // '' if missing
  slug: string
  lastUpdated: string      // '' if missing
  internalLinks: string[]  // existing links on the page (URLs)
  isHowTo: boolean         // does it explain a step-by-step process?
}

export interface SubScore {
  label: string
  score: number
  max: number
  status: 'pass' | 'warn' | 'fail'
}

export interface TechnicalIssue {
  issue: string
  why: string
  fix: string
  severity: IssueSeverity
}

export interface SchemaRecommendation {
  type: SchemaType
  reason: string
  jsonLd: object
}

export interface TechnicalReport {
  pageId: string
  pageLabel: string
  checkedAt: string
  status: TechnicalStatus
  totalScore: number
  subScores: SubScore[]
  issues: TechnicalIssue[]
  schemaRecommendations: SchemaRecommendation[]
  internalLinkSuggestions: string[]
  metadataItems: { label: string; value: string; ok: boolean }[]
}
