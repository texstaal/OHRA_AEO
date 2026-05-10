'use client'
import type { ContentDraft, DraftStatus } from '@/types/agent3'
import { draftToMarkdown } from '@/lib/agent3Generator'

const ALL_STATUSES: DraftStatus[] = [
  'Draft Generated', 'Needs Marketing Review', 'Needs Compliance Review', 'Approved', 'Rejected',
]

const statusStyles: Record<DraftStatus, string> = {
  'Draft Generated':          'bg-gray-100 text-gray-600 border-gray-200',
  'Needs Marketing Review':   'bg-orange-100 text-orange-700 border-orange-200',
  'Needs Compliance Review':  'bg-amber-100 text-amber-700 border-amber-200',
  'Approved':                 'bg-green-100 text-green-700 border-green-200',
  'Rejected':                 'bg-red-100 text-red-700 border-red-200',
}

function Card({ title, icon, accent, children }: { title: string; icon: string; accent?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${accent ?? 'border-gray-100'}`}>
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-50 bg-gray-50">
        <span>{icon}</span>
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

interface Props {
  draft: ContentDraft
  onStatusChange: (s: DraftStatus) => void
  onClose: () => void
  onProcessFinal?: () => void
}

export function DraftPanel({ draft, onStatusChange, onClose, onProcessFinal }: Props) {
  function download() {
    const md = draftToMarkdown(draft)
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ohra_draft_${draft.opportunityId}_${draft.generatedAt.slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copy() {
    try { await navigator.clipboard.writeText(draftToMarkdown(draft)) } catch { /* ignore */ }
  }

  const proofSections = draft.sections.filter(s => s.requiresProof).length
  const ss = statusStyles[draft.status]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-[#1d4ed8] rounded-xl p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-1">First Draft — Agent 3</div>
            <h2 className="text-xl font-bold leading-snug">{draft.h1}</h2>
            <div className="text-white/50 text-xs mt-1">
              Generated {new Date(draft.generatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
              {proofSections > 0 && (
                <span className="ml-3 bg-amber-400 text-amber-900 rounded-full px-2 py-0.5 text-xs font-semibold">
                  ⚠️ {proofSections} section{proofSections > 1 ? 's' : ''} need proof
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-sm transition-colors flex-shrink-0">← Back</button>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/10">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${ss}`}>{draft.status}</span>
          <select
            value={draft.status}
            onChange={e => onStatusChange(e.target.value as DraftStatus)}
            className="text-xs border border-white/20 rounded-lg px-2 py-1.5 text-white bg-white/10 focus:outline-none cursor-pointer"
          >
            {ALL_STATUSES.map(s => <option key={s} value={s} className="text-gray-900 bg-white">{s}</option>)}
          </select>
          <div className="ml-auto flex gap-2">
            <button onClick={copy} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 transition-colors">Copy MD</button>
            <button onClick={download} className="px-3 py-1.5 bg-white text-[#1d4ed8] text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors">↓ Download</button>
          </div>
        </div>
      </div>

      {/* Human review gate */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">👤</span>
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Editor review required.</strong> This is a first draft generated from an approved brief. A human editor must review, fact-check, and approve this content before it moves to compliance. Sections marked <span className="bg-amber-200 px-1 rounded font-mono">⚠️ PROOF REQUIRED</span> must not be published until verified by the OHRA product and legal teams.
        </p>
      </div>

      {/* Auto-process banner — only shown when approved */}
      {draft.status === 'Approved' && onProcessFinal && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="text-sm font-bold text-green-800 mb-0.5">Draft approved — ready for automatic processing</div>
            <div className="text-xs text-green-600">
              Runs compliance auto-fix (Agent 4) + technical GEO improvements (Agent 5) and generates the final publish-ready preview.
            </div>
          </div>
          <button
            onClick={onProcessFinal}
            className="flex-shrink-0 px-5 py-2.5 bg-green-700 text-white text-sm font-bold rounded-xl hover:bg-green-800 transition-colors shadow-sm"
          >
            ⚡ Process Final Draft →
          </button>
        </div>
      )}

      {/* Intro */}
      <Card title="Introduction" icon="📖">
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-line">{draft.intro}</div>
      </Card>

      {/* Answer block */}
      <Card title="AI-Optimized Answer Block (60–90 words)" icon="🤖">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-sm text-gray-700 leading-relaxed italic">&ldquo;{draft.answerBlock}&rdquo;</p>
          <div className="mt-2 text-xs text-blue-600">
            {draft.answerBlock.split(/\s+/).length} words · Place within the first 2 paragraphs for maximum AI extraction
          </div>
        </div>
      </Card>

      {/* Draft sections */}
      {draft.sections.map((section, i) => (
        <Card
          key={i}
          title={`Section ${i + 1} — ${section.heading}`}
          icon={section.requiresProof ? '⚠️' : '✍️'}
          accent={section.requiresProof ? 'border-amber-200' : 'border-gray-100'}
        >
          {section.requiresProof && (
            <div className="mb-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs text-amber-700 font-medium">
              ⚠️ PROOF REQUIRED — This section contains [PLACEHOLDER] content that must be verified with OHRA product and compliance teams before publishing.
            </div>
          )}
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{section.body}</div>
        </Card>
      ))}

      {/* Comparison table */}
      {draft.comparisonTable && (
        <Card title={draft.comparisonTable.caption} icon="📊">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {draft.comparisonTable.headers.map((h, i) => (
                    <th key={i} className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border border-gray-100">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {draft.comparisonTable.rows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 text-xs text-gray-700 border border-gray-100 leading-snug">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* FAQ */}
      <Card title="FAQ Section (AI-Extraction Optimized)" icon="❓">
        <div className="space-y-3">
          {draft.faq.map((f, i) => (
            <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 flex items-start gap-2">
                <span className="text-xs font-bold text-gray-400 flex-shrink-0 mt-0.5">Q{i + 1}</span>
                <span className="text-sm font-semibold text-gray-800">{f.question}</span>
              </div>
              <div className="px-4 py-2.5">
                <p className="text-sm text-gray-600 leading-relaxed">{f.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* CTA */}
      <Card title="Call to Action" icon="🎯">
        <p className="text-sm text-gray-700 leading-relaxed">{draft.cta}</p>
        <p className="mt-2 text-xs text-orange-600">↑ All links marked [PLACEHOLDER] must be replaced with correct OHRA URLs before publishing.</p>
      </Card>

      {/* GEO checklist + compliance side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="GEO / AEO Optimization — Why This Draft Works" icon="📡">
          <div className="space-y-2">
            {draft.geoItems.map((item, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-xs font-bold flex-shrink-0">✓</span>
                  <span className="text-xs font-semibold text-gray-700">{item.item}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 ml-4 leading-snug">{item.reason}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Compliance Risk Notes — Must Be Checked Before Publishing" icon="⚠️" accent="border-red-100">
          <div className="space-y-2">
            {draft.complianceNotes.map((note, i) => (
              <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <span className="text-red-400 text-xs flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                <p className="text-xs text-red-700 leading-snug">{note}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-400">
            These items are non-negotiable. Publishing without resolving compliance notes creates legal and reputational risk for OHRA.
          </div>
        </Card>
      </div>
    </div>
  )
}
