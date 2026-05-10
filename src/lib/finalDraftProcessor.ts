import type { ContentDraft } from '@/types/agent3'
import type { FinalDraft, ComplianceFix, TechImprovement } from '@/types/finalDraft'

// ── Auto-replacement rules ────────────────────────────────────────────────────
// Each entry maps a risky pattern (lowercase) to a safe replacement string.
// [PLACEHOLDER] items are flagged but NOT auto-replaced — they need human input.

const AUTO_REPLACEMENTS: { ruleId: string; pattern: string; fix: string; severity: 'High' | 'Medium' | 'Low' }[] = [
  { ruleId: 'r01', severity: 'High',   pattern: 'cheapest option',              fix: 'competitive option' },
  { ruleId: 'r02', severity: 'High',   pattern: 'best no-claim discount',       fix: 'a strong no-claim discount structure' },
  { ruleId: 'r03', severity: 'High',   pattern: 'guarantees the lowest premium', fix: 'offers competitive premiums' },
  { ruleId: 'r04', severity: 'High',   pattern: 'all damage is fully covered',  fix: 'covers a broad range of damage — see policy terms for exclusions' },
  { ruleId: 'r05', severity: 'High',   pattern: 'always included',              fix: 'included as standard — see policy terms' },
  { ruleId: 'r06', severity: 'High',   pattern: 'no exceptions',                fix: 'subject to standard policy terms and conditions' },
  { ruleId: 'r07', severity: 'High',   pattern: '100% coverage',                fix: 'extensive coverage — see your policy for details' },
  { ruleId: 'r08', severity: 'High',   pattern: 'always handled within 24 hours', fix: 'typically processed quickly — contact us for current timelines' },
  { ruleId: 'r09', severity: 'High',   pattern: 'fastest claims processing',    fix: 'efficient claims processing' },
  { ruleId: 'r10', severity: 'Medium', pattern: 'never worry',                  fix: 'feel confident knowing that' },
  { ruleId: 'r11', severity: 'High',   pattern: 'guarantee fair compensation',  fix: 'assess all verified claims according to your policy coverage' },
  { ruleId: 'r12', severity: 'High',   pattern: 'at any time without conditions', fix: 'in most cases at annual renewal or within 30 days of a premium increase' },
  { ruleId: 'r13', severity: 'High',   pattern: 'guaranteed within 24 hours',   fix: 'processed as quickly as possible — our team will confirm the timeline' },
  { ruleId: 'r14', severity: 'Medium', pattern: 'always the best option',       fix: 'a strong option to consider' },
  { ruleId: 'r15', severity: 'Medium', pattern: 'best choice for ev',           fix: 'a great option for EV owners' },
  { ruleId: 'r17', severity: 'Low',    pattern: 'satisfaction is guaranteed',   fix: 'our team is committed to resolving your query' },
  { ruleId: 'r18', severity: 'Low',    pattern: 'best value',                   fix: 'often provides good value' },
]

function escRx(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
function wc(text: string) { return text.trim().split(/\s+/).filter(Boolean).length }

// Apply all auto-replacements to a single text field. Returns fixed text + list of fixes.
function fixText(text: string, fieldLabel: string): { result: string; fixes: ComplianceFix[] } {
  let result = text
  const fixes: ComplianceFix[] = []

  for (const rule of AUTO_REPLACEMENTS) {
    const rx = new RegExp(escRx(rule.pattern), 'gi')
    let match: RegExpExecArray | null
    const scratch = rx.exec(result)
    if (!scratch) continue
    // Capture the actual casing found in text for the report
    const found = scratch[0]
    result = result.replace(new RegExp(escRx(rule.pattern), 'gi'), rule.fix)
    fixes.push({ ruleId: rule.ruleId, field: fieldLabel, original: found, replacement: rule.fix, severity: rule.severity })
  }
  return { result, fixes }
}

// Count [PLACEHOLDER] occurrences in a string
function countPlaceholders(text: string): number {
  return (text.match(/\[PLACEHOLDER/gi) ?? []).length
}

// Count risky pattern occurrences in a string (for pre-fix score)
function countIssues(text: string): number {
  return AUTO_REPLACEMENTS.reduce((acc, rule) => {
    return acc + (new RegExp(escRx(rule.pattern), 'gi').test(text) ? 1 : 0)
  }, 0) + countPlaceholders(text)
}

// Compute a simple technical GEO score from the ContentDraft structure
function computeTechScore(draft: ContentDraft): number {
  let score = 0
  if (draft.h1 && draft.h1.length > 5)                        score += 15  // H1 exists
  const words = wc(draft.answerBlock)
  if (words >= 60 && words <= 90)                              score += 20  // Answer block optimal
  else if (words > 0)                                          score += 8   // Answer block exists but off
  if (draft.faq.length >= 5)                                   score += 20  // Full FAQ
  else if (draft.faq.length >= 3)                              score += 10
  if (draft.comparisonTable)                                   score += 10  // Comparison table
  if (draft.sections.length >= 4)                              score += 10  // Enough sections
  score += 15  // Schema can be generated (always true here)
  score += 10  // Metadata can be generated
  return Math.min(100, score)
}

// Generate tech improvement notes
function buildTechImprovements(draft: ContentDraft, seoTitle: string, metaDescription: string): TechImprovement[] {
  const items: TechImprovement[] = []
  const words = wc(draft.answerBlock)

  items.push({ item: 'SEO Title',        action: 'Generated', detail: seoTitle })
  items.push({ item: 'Meta Description', action: 'Generated', detail: metaDescription })
  items.push({ item: 'Article JSON-LD',  action: 'Generated', detail: 'Schema.org Article with author, publisher, and dateModified.' })

  if (draft.faq.length > 0)
    items.push({ item: 'FAQPage JSON-LD', action: 'Generated', detail: `${draft.faq.length} Q&A pairs structured for AI extraction.` })

  if (draft.faq.length < 5)
    items.push({ item: 'FAQ count',       action: 'Noted', detail: `Only ${draft.faq.length} FAQ items. AI engines prefer 5+. Expand before publishing.` })

  if (words < 60 || words > 90)
    items.push({ item: 'Answer block length', action: 'Noted', detail: `${words} words — target is 60–90. ${words < 60 ? 'Expand' : 'Trim'} before publishing.` })

  if (!draft.comparisonTable)
    items.push({ item: 'Comparison table', action: 'Noted', detail: 'No comparison table detected. Adding one increases AI extraction value for comparison-intent queries.' })

  items.push({ item: 'Internal links',  action: 'Noted', detail: 'Replace [PLACEHOLDER] links with real OHRA URLs before publishing.' })
  items.push({ item: 'Last updated date', action: 'Fixed', detail: `Set to ${new Date().toISOString().slice(0, 10)} (today).` })

  return items
}

// ── Main processor ────────────────────────────────────────────────────────────

export function processDraft(draft: ContentDraft): FinalDraft {
  const allFixes: ComplianceFix[] = []

  // Build the full original text for pre-fix issue count
  const originalFull = [
    draft.h1, draft.intro, draft.answerBlock,
    ...draft.sections.map(s => s.heading + ' ' + s.body),
    ...draft.faq.map(f => f.question + ' ' + f.answer),
    draft.cta,
  ].join(' ')
  const preFixIssueCount = countIssues(originalFull)

  // Apply compliance fixes to each field
  const { result: fixedH1,          fixes: f0 } = fixText(draft.h1,          'H1 title')
  const { result: fixedIntro,        fixes: f1 } = fixText(draft.intro,        'Introduction')
  const { result: fixedAnswer,       fixes: f2 } = fixText(draft.answerBlock,  'Answer block')
  const fixedSections = draft.sections.map((s, i) => {
    const { result: heading, fixes: fh } = fixText(s.heading, `Section ${i + 1} heading`)
    const { result: body,    fixes: fb } = fixText(s.body,    `Section ${i + 1} body`)
    allFixes.push(...fh, ...fb)
    return { ...s, heading, body }
  })
  const fixedFAQ = draft.faq.map((f, i) => {
    const { result: question, fixes: fq } = fixText(f.question, `FAQ ${i + 1} question`)
    const { result: answer,   fixes: fa } = fixText(f.answer,   `FAQ ${i + 1} answer`)
    allFixes.push(...fq, ...fa)
    return { question, answer }
  })
  const { result: fixedCTA, fixes: fc } = fixText(draft.cta, 'Call to action')

  allFixes.push(...f0, ...f1, ...f2, ...fc)

  // Build the processed draft
  const processedDraft: ContentDraft = {
    ...draft,
    h1:          fixedH1,
    intro:       fixedIntro,
    answerBlock: fixedAnswer,
    sections:    fixedSections,
    faq:         fixedFAQ,
    cta:         fixedCTA,
  }

  // Post-fix issue count (only placeholders remain — can't be auto-fixed)
  const processedFull = [fixedH1, fixedIntro, fixedAnswer, ...fixedSections.map(s => s.body), ...fixedFAQ.map(f => f.answer), fixedCTA].join(' ')
  const placeholderCount   = countPlaceholders(processedFull)
  const postFixIssueCount  = placeholderCount

  // Generate metadata
  const seoTitle      = `${fixedH1} | OHRA Autoverzekering`
  const metaDescription = (fixedAnswer.slice(0, 152) + (fixedAnswer.length > 152 ? '…' : '')).replace(/"/g, "'")
  const slug          = `autoverzekering/${draft.opportunityId}`
  const today         = new Date().toISOString().slice(0, 10)

  // Generate JSON-LD schemas
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type':    'Article',
    headline:   fixedH1,
    description: metaDescription,
    author:     { '@type': 'Organization', name: 'OHRA' },
    publisher:  { '@type': 'Organization', name: 'OHRA', url: 'https://www.ohra.nl' },
    dateModified: today,
    url: `https://www.ohra.nl/${slug}`,
  }

  const jsonLdFAQ = fixedFAQ.length > 0 ? {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: fixedFAQ.map(f => ({
      '@type': 'Question',
      name:    f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  const techImprovements = buildTechImprovements(processedDraft, seoTitle, metaDescription)
  const techScore        = computeTechScore(processedDraft)

  return {
    opportunityId:    draft.opportunityId,
    opportunityLabel: draft.opportunityLabel,
    processedAt:      new Date().toISOString(),
    processedDraft,
    complianceFixes:  allFixes,
    placeholderCount,
    technicalImprovements: techImprovements,
    seoTitle,
    metaDescription,
    slug,
    jsonLdArticle,
    jsonLdFAQ,
    preFixIssueCount,
    postFixIssueCount,
    techScore,
  }
}
