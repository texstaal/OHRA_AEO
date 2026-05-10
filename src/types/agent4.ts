export type ComplianceSeverity = 'High' | 'Medium' | 'Low'
export type ComplianceCategory =
  | 'Unsupported Claim'
  | 'Insurance Compliance'
  | 'Missing Evidence'
  | 'Brand Tone'
  | 'GEO Safety'

export type ComplianceStatus =
  | 'Not Reviewed'
  | 'Needs Marketing Review'
  | 'Needs Compliance Review'
  | 'Approved for Next Step'
  | 'Rejected'

export interface ComplianceRule {
  id: string
  pattern: string           // case-insensitive substring to match
  category: ComplianceCategory
  severity: ComplianceSeverity
  why: string               // why this is a risk
  suggestion: string        // safer alternative wording
}

export interface FlaggedIssue {
  rule: ComplianceRule
  snippet: string           // ~80 chars of surrounding text
}

export interface ComplianceReport {
  opportunityId: string
  draftLabel: string
  checkedAt: string
  status: ComplianceStatus
  issues: FlaggedIssue[]
  riskScore: number         // 0–100
  riskLevel: 'Low' | 'Medium' | 'High'
  missingEvidence: string[]
  brandToneNotes: string[]
}

export interface DraftInput {
  id: string
  label: string
  intentStage: string
  gapLevel: 'High' | 'Medium' | 'Low'
  priorityScore: number
  text: string              // full draft text to scan
  missingEvidence: string[] // predefined per draft
  brandToneNotes: string[]  // predefined per draft
}
