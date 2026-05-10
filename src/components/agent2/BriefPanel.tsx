'use client'
import type { ContentBrief, BriefStatus } from '@/types/agent2'
import { briefToMarkdown } from '@/lib/agent2Generator'

const ALL_STATUSES: BriefStatus[] = [
  'Draft', 'Needs Marketing Review', 'Needs Compliance Review', 'Approved', 'Rejected',
]

const statusStyles: Record<BriefStatus, string> = {
  'Draft':                    'bg-gray-100 text-gray-600 border-gray-200',
  'Needs Marketing Review':   'bg-orange-100 text-orange-700 border-orange-200',
  'Needs Compliance Review':  'bg-amber-100 text-amber-700 border-amber-200',
  'Approved':                 'bg-green-100 text-green-700 border-green-200',
  'Rejected':                 'bg-red-100 text-red-700 border-red-200',
}

const structureTypeStyle: Record<string, string> = {
  h1:    'font-bold text-[#1e3a5f] text-sm',
  h2:    'font-semibold text-gray-700 text-sm',
  block: 'text-gray-500 text-sm italic',
  cta:   'font-semibold text-green-700 text-sm',
}

const structureTypeLabel: Record<string, string> = {
  h1:    'H1',
  h2:    'H2',
  block: 'Block',
  cta:   'CTA',
}

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-50 bg-gray-50">
        <span>{icon}</span>
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{title}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

interface Props {
  brief: ContentBrief
  onStatusChange: (status: BriefStatus) => void
  onClose: () => void
}

export function BriefPanel({ brief, onStatusChange, onClose }: Props) {
  function downloadMarkdown() {
    const md = briefToMarkdown(brief)
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ohra_brief_${brief.opportunityId}_${brief.generatedAt.slice(0, 10)}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copyMarkdown() {
    try {
      await navigator.clipboard.writeText(briefToMarkdown(brief))
    } catch { /* ignore */ }
  }

  const sStyle = statusStyles[brief.status]

  return (
    <div className="space-y-4">
      {/* Brief header */}
      <div className="bg-[#1e3a5f] rounded-xl p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-white/50 text-xs font-semibold uppercase tracking-wide mb-1">
              Content Brief — Agent 2
            </div>
            <h2 className="text-xl font-bold">{brief.opportunityLabel}</h2>
            <div className="text-white/60 text-xs mt-1">
              Generated {new Date(brief.generatedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-sm transition-colors flex-shrink-0">
            ← Back
          </button>
        </div>

        {/* Review status + export row */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/10">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${sStyle}`}>
            {brief.status}
          </span>
          <select
            value={brief.status}
            onChange={e => onStatusChange(e.target.value as BriefStatus)}
            className="text-xs border border-white/20 rounded-lg px-2 py-1.5 text-white bg-white/10 focus:outline-none cursor-pointer"
          >
            {ALL_STATUSES.map(s => <option key={s} value={s} className="text-gray-900 bg-white">{s}</option>)}
          </select>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={copyMarkdown}  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20">
              Copy MD
            </button>
            <button onClick={downloadMarkdown} className="px-3 py-1.5 bg-white text-[#1e3a5f] text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors">
              ↓ Download
            </button>
          </div>
        </div>
      </div>

      {/* Human review notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5">👤</span>
        <p className="text-xs text-amber-700 leading-relaxed">
          <strong>Human approval required.</strong> This brief must be reviewed by the marketing team and approved by compliance before any content is written. No content is published automatically.
        </p>
      </div>

      {/* Section 1 — Objective */}
      <SectionCard title="1 · Content Objective" icon="🎯">
        <p className="text-sm text-gray-700 leading-relaxed">{brief.objective}</p>
      </SectionCard>

      {/* Section 2 — Target Queries */}
      <SectionCard title="2 · Target AI Search Queries" icon="🔍">
        <ul className="space-y-1.5">
          {brief.targetQueries.map((q, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-[#1e3a5f] text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
              <span className="text-sm text-gray-700 italic">{q}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Section 3 + 4 — Insight + CEP side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="3 · Customer Insight" icon="💡">
          <p className="text-sm text-gray-700 leading-relaxed">{brief.customerInsight}</p>
        </SectionCard>
        <SectionCard title="4 · Category Entry Point" icon="🚪">
          <div className="font-bold text-[#1e3a5f] text-sm mb-2">{brief.cep.label}</div>
          <p className="text-sm text-gray-600 leading-relaxed">{brief.cep.explanation}</p>
        </SectionCard>
      </div>

      {/* Section 5 — Page Structure */}
      <SectionCard title="5 · Recommended Page Structure" icon="📋">
        <div className="space-y-2">
          {brief.pageStructure.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded border ${
                item.type === 'h1'  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' :
                item.type === 'cta' ? 'bg-green-600 text-white border-green-600' :
                'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {structureTypeLabel[item.type]}
              </span>
              <span className={structureTypeStyle[item.type]}>{item.text}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 6 — Answer Block */}
      <SectionCard title="6 · AI-Optimized Answer Block (60–90 words)" icon="🤖">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-sm text-gray-700 leading-relaxed italic">&ldquo;{brief.answerBlock}&rdquo;</p>
          <div className="mt-2 text-xs text-blue-600">
            {brief.answerBlock.split(/\s+/).length} words · Place this block within the first 2 paragraphs of the page
          </div>
        </div>
      </SectionCard>

      {/* Section 7 — FAQ */}
      <SectionCard title="7 · FAQ Section (AI-Extraction Optimized)" icon="❓">
        <div className="space-y-3">
          {brief.faq.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 flex items-start gap-2">
                <span className="text-xs font-bold text-gray-400 flex-shrink-0 mt-0.5">Q{i + 1}</span>
                <span className="text-sm font-semibold text-gray-800">{item.question}</span>
              </div>
              <div className="px-4 py-2.5">
                <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 8 + 9 side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="8 · Justification Attributes" icon="✅">
          <ul className="space-y-1.5">
            {brief.justificationAttributes.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                {a}
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="9 · Required Evidence" icon="📎">
          <ul className="space-y-1.5">
            {brief.requiredEvidence.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-orange-400 flex-shrink-0 mt-0.5">→</span>
                {e}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Section 10 — Competitor Angle */}
      <SectionCard title="10 · Competitor Angle" icon="🏁">
        <p className="text-sm text-gray-700 leading-relaxed">{brief.competitorAngle}</p>
      </SectionCard>

      {/* Section 11 — GEO Checklist */}
      <SectionCard title="11 · GEO / AEO Optimization Checklist" icon="📊">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {brief.geoChecklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
              <span className="w-4 h-4 rounded border-2 border-gray-300 flex-shrink-0" />
              <span className="text-xs text-gray-600">{item}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Complete each checklist item before publishing. The writing team and compliance team must both sign off.
        </p>
      </SectionCard>

      {/* Section 12 — Schema */}
      <SectionCard title="12 · Schema Markup Recommendations" icon="🏷️">
        <div className="flex flex-wrap gap-2">
          {brief.schemaRecommendations.map(s => (
            <span key={s} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-semibold">
              {s}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Implement these schema types on the published page to maximize AI engine citability.
        </p>
      </SectionCard>
    </div>
  )
}
