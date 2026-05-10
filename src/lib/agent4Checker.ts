import type { ComplianceRule, ComplianceReport, FlaggedIssue, DraftInput } from '@/types/agent4'

export const complianceRules: ComplianceRule[] = [
  {
    id: 'r01',
    pattern: 'cheapest option',
    category: 'Unsupported Claim',
    severity: 'High',
    why: 'Superlative price claim requires continuous market verification and is unsubstantiated.',
    suggestion: 'Replace with "a competitive option" or add a verified source date.',
  },
  {
    id: 'r02',
    pattern: 'best no-claim discount',
    category: 'Unsupported Claim',
    severity: 'High',
    why: 'Comparative superlative claim about competitor no-claim structures needs market research support.',
    suggestion: 'Use "a strong no-claim discount structure" without the superlative.',
  },
  {
    id: 'r03',
    pattern: 'guarantees the lowest premium',
    category: 'Unsupported Claim',
    severity: 'High',
    why: 'Price guarantee claim creates legal liability and requires continuous benchmarking.',
    suggestion: 'Remove the guarantee. Use "offers competitive premiums across all coverage levels".',
  },
  {
    id: 'r04',
    pattern: 'all damage is fully covered',
    category: 'Insurance Compliance',
    severity: 'High',
    why: 'All-risk policies have exclusions. "All damage" is factually inaccurate and creates consumer expectation gaps.',
    suggestion: 'Use "covers a broad range of damage, including own-fault accidents — see policy terms for exclusions".',
  },
  {
    id: 'r05',
    pattern: 'always included',
    category: 'Insurance Compliance',
    severity: 'High',
    why: 'Absolute coverage claims ignore policy exclusions and conditions.',
    suggestion: 'Use "included as standard" followed by a reference to policy terms.',
  },
  {
    id: 'r06',
    pattern: 'no exceptions',
    category: 'Insurance Compliance',
    severity: 'High',
    why: 'Insurance policies always have exceptions. This claim will mislead customers.',
    suggestion: 'Remove "no exceptions". Add "subject to standard policy terms and conditions".',
  },
  {
    id: 'r07',
    pattern: '100% coverage',
    category: 'Insurance Compliance',
    severity: 'High',
    why: 'No insurance product offers 100% coverage in all situations. Creates legal risk.',
    suggestion: 'Use "extensive coverage across the Netherlands and most European countries — see your policy for details".',
  },
  {
    id: 'r08',
    pattern: 'always handled within 24 hours',
    category: 'Unsupported Claim',
    severity: 'High',
    why: 'Time commitment without verified operational data creates liability for missed SLAs.',
    suggestion: 'Use "most straightforward claims are processed quickly — contact us for current processing times".',
  },
  {
    id: 'r09',
    pattern: 'fastest claims processing',
    category: 'Unsupported Claim',
    severity: 'High',
    why: 'Comparative superlative requires independent benchmarking data to substantiate.',
    suggestion: 'Use "efficient claims processing" without the market comparison.',
  },
  {
    id: 'r10',
    pattern: 'never worry',
    category: 'Brand Tone',
    severity: 'Medium',
    why: 'Dismisses legitimate customer anxiety. Inconsistent with OHRA\'s trusted-guide tone.',
    suggestion: 'Use "you can feel confident knowing that..." to acknowledge the concern while providing reassurance.',
  },
  {
    id: 'r11',
    pattern: 'guarantee fair compensation',
    category: 'Insurance Compliance',
    severity: 'High',
    why: '"Guarantee" combined with "fair" is subjective and unenforceable. Creates expectation risk.',
    suggestion: 'Use "we assess all verified claims according to your policy coverage".',
  },
  {
    id: 'r12',
    pattern: 'at any time without conditions',
    category: 'Insurance Compliance',
    severity: 'High',
    why: 'Insurance policy cancellation has legal conditions under Dutch law. Factually incorrect.',
    suggestion: 'Use "in most cases you can switch at annual renewal or within 30 days of a premium increase — see policy terms".',
  },
  {
    id: 'r13',
    pattern: 'guaranteed within 24 hours',
    category: 'Unsupported Claim',
    severity: 'High',
    why: 'Operational guarantee without product team verification creates SLA liability.',
    suggestion: 'Use "we aim to complete your switch quickly — our team will confirm the exact timeline".',
  },
  {
    id: 'r14',
    pattern: 'always the best option',
    category: 'Unsupported Claim',
    severity: 'Medium',
    why: 'Absolute superlative is impossible to substantiate for all customer segments.',
    suggestion: 'Use "a strong option to consider" and link to a comparison tool.',
  },
  {
    id: 'r15',
    pattern: 'best choice for ev',
    category: 'Unsupported Claim',
    severity: 'Medium',
    why: 'Competitive superlative for EV insurance requires verified market comparison data.',
    suggestion: 'Use "a specialist option for EV owners" without the superlative.',
  },
  {
    id: 'r16',
    pattern: '[placeholder',
    category: 'Missing Evidence',
    severity: 'Medium',
    why: 'Draft contains unfilled placeholder — content is not ready for marketing review.',
    suggestion: 'Fill the placeholder with verified data from the product team before proceeding.',
  },
  {
    id: 'r17',
    pattern: 'satisfaction is guaranteed',
    category: 'Brand Tone',
    severity: 'Low',
    why: 'Vague guarantee language without definition creates unmet expectations.',
    suggestion: 'Replace with specific commitments: response time, appeals process, or service standards.',
  },
  {
    id: 'r18',
    pattern: 'best value',
    category: 'Unsupported Claim',
    severity: 'Low',
    why: 'Subjective value claim without comparison context or supporting data.',
    suggestion: 'Qualify with conditions: "WA+ often provides the best value for cars in the €5,000–€15,000 range".',
  },
]

export function scanDraft(draft: DraftInput, rules: ComplianceRule[]): ComplianceReport {
  const lower = draft.text.toLowerCase()
  const issues: FlaggedIssue[] = []

  for (const rule of rules) {
    const idx = lower.indexOf(rule.pattern.toLowerCase())
    if (idx === -1) continue

    const start = Math.max(0, idx - 40)
    const end   = Math.min(draft.text.length, idx + rule.pattern.length + 40)
    const snippet = (start > 0 ? '…' : '') + draft.text.slice(start, end) + (end < draft.text.length ? '…' : '')

    issues.push({ rule, snippet })
  }

  const rawScore = issues.reduce((acc, { rule }) => {
    return acc + (rule.severity === 'High' ? 15 : rule.severity === 'Medium' ? 7 : 3)
  }, 0)
  const riskScore = Math.min(100, rawScore)
  const riskLevel = riskScore <= 30 ? 'Low' : riskScore <= 60 ? 'Medium' : 'High'

  return {
    opportunityId:  draft.id,
    draftLabel:     draft.label,
    checkedAt:      new Date().toISOString(),
    status:         'Not Reviewed',
    issues,
    riskScore,
    riskLevel,
    missingEvidence: draft.missingEvidence,
    brandToneNotes:  draft.brandToneNotes,
  }
}
