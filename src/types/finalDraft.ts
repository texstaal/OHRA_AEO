import type { ContentDraft } from '@/types/agent3'

export interface ComplianceFix {
  ruleId: string
  field: string        // which part of the draft was fixed (e.g. "Section 2 body")
  original: string     // the exact phrase that was replaced
  replacement: string  // what it was replaced with
  severity: 'High' | 'Medium' | 'Low'
}

export interface TechImprovement {
  item: string
  action: 'Generated' | 'Noted' | 'Fixed'
  detail: string
}

export interface FinalDraft {
  opportunityId: string
  opportunityLabel: string
  processedAt: string
  processedDraft: ContentDraft  // compliance-fixed version of the draft
  complianceFixes: ComplianceFix[]
  placeholderCount: number      // [PLACEHOLDER] items still needing human input
  technicalImprovements: TechImprovement[]
  seoTitle: string
  metaDescription: string
  slug: string
  jsonLdArticle: object
  jsonLdFAQ: object | null
  preFixIssueCount: number
  postFixIssueCount: number
  techScore: number
}
