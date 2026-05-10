'use client'
import { useState } from 'react'
import type { FinalDraft } from '@/types/finalDraft'

const severityBadge: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-yellow-100 text-yellow-700 border-yellow-200',
}

const actionBadge: Record<string, string> = {
  Generated: 'bg-green-100 text-green-700',
  Fixed:     'bg-blue-100 text-blue-700',
  Noted:     'bg-orange-100 text-orange-700',
}

const TABS = ['Preview', 'Change Report', 'Schema & Metadata'] as const

function wc(text: string) { return text.trim().split(/\s+/).filter(Boolean).length }

// ── Article preview ────────────────────────────────────────────────────────────
function ArticlePreview({ fd }: { fd: FinalDraft }) {
  const d   = fd.processedDraft
  const today = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
  const readTime = Math.max(1, Math.ceil(wc([d.intro, ...d.sections.map(s => s.body), ...d.faq.map(f => f.answer)].join(' ')) / 200))

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
      {/* Fake browser chrome */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-1 text-xs text-gray-500 font-mono">
          https://www.ohra.nl/{fd.slug}
        </div>
        <span className="text-xs text-green-600 font-semibold">✓ Final Draft Preview</span>
      </div>

      {/* OHRA nav */}
      <div className="bg-[#1e3a5f] px-8 py-3 flex items-center justify-between">
        <div className="text-white font-bold text-xl tracking-tight">OHRA</div>
        <div className="flex gap-6 text-xs text-white/60">
          {['Autoverzekering', 'Inboedel', 'Schade', 'Mijn OHRA'].map(l => (
            <span key={l} className="hover:text-white cursor-default">{l}</span>
          ))}
        </div>
      </div>

      {/* Article body */}
      <div className="bg-white">
        <div className="max-w-2xl mx-auto px-10 py-10">
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1.5">
            <span className="hover:text-[#1e3a5f] cursor-default">Home</span>
            <span>›</span>
            <span className="hover:text-[#1e3a5f] cursor-default">Autoverzekering</span>
            <span>›</span>
            <span className="text-gray-600 font-medium">{d.opportunityLabel}</span>
          </nav>

          {/* H1 */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">{d.h1}</h1>

          {/* Meta bar */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mb-8 pb-5 border-b border-gray-100">
            <span>📅 Bijgewerkt: {today}</span>
            <span>⏱ {readTime} min lezen</span>
            <span className="ml-auto bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-0.5 font-semibold">
              Compliance-checked
            </span>
          </div>

          {/* Answer block */}
          <div className="bg-blue-50 border-l-4 border-[#1d4ed8] rounded-r-xl p-5 mb-8">
            <div className="text-xs font-bold text-[#1d4ed8] uppercase tracking-wider mb-2">Direct antwoord</div>
            <p className="text-sm text-gray-800 leading-relaxed">{d.answerBlock}</p>
            <div className="text-xs text-blue-400 mt-2">{wc(d.answerBlock)} woorden</div>
          </div>

          {/* Intro */}
          <p className="text-sm text-gray-700 leading-relaxed mb-8 whitespace-pre-line">{d.intro}</p>

          {/* Sections */}
          {d.sections.map((s, i) => (
            <div key={i} className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">{s.heading}</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}

          {/* Comparison table */}
          {d.comparisonTable && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{d.comparisonTable.caption}</h2>
              <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#1e3a5f] text-white">
                      {d.comparisonTable.headers.map((h, i) => (
                        <th key={i} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.comparisonTable.rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2.5 text-xs text-gray-700 border-b border-gray-100">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FAQ */}
          {d.faq.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-5">Veelgestelde vragen</h2>
              <div className="space-y-0 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                {d.faq.map((f, i) => (
                  <div key={i} className={`border-b border-gray-100 last:border-b-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <div className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900 mb-1.5">{f.question}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{f.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#1d4ed8] rounded-2xl p-7 text-white text-center mb-8">
            <p className="text-sm leading-relaxed mb-5 text-white/90 max-w-md mx-auto">{d.cta}</p>
            <button className="bg-white text-[#1e3a5f] px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm">
              Bereken uw premie →
            </button>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-gray-500">Disclaimer:</strong> This preview shows the compliance-processed draft. All{' '}
              <span className="font-mono bg-amber-50 text-amber-700 px-1 rounded">[PLACEHOLDER]</span>{' '}
              items ({fd.placeholderCount} remaining) must be replaced with verified OHRA data before publishing. This content has not yet been reviewed by OHRA legal or published.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main panel ─────────────────────────────────────────────────────────────────
interface Props {
  finalDraft: FinalDraft
  onClose: () => void
}

export function FinalDraftPanel({ finalDraft: fd, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Preview')

  function copyJSON(obj: object) {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2)).catch(() => {})
  }

  function downloadMd() {
    const d = fd.processedDraft
    const lines = [
      `# ${d.h1}`,
      '',
      `**SEO Title:** ${fd.seoTitle}`,
      `**Meta Description:** ${fd.metaDescription}`,
      `**Slug:** /${fd.slug}`,
      `**Processed:** ${new Date(fd.processedAt).toLocaleString('en-GB')}`,
      '',
      '## Answer Block',
      d.answerBlock,
      '',
      '## Introduction',
      d.intro,
      '',
      ...d.sections.flatMap(s => [`## ${s.heading}`, s.body, '']),
      '## FAQ',
      ...d.faq.flatMap(f => [`**${f.question}**`, f.answer, '']),
      '## CTA',
      d.cta,
    ]
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/markdown' }))
    a.download = `ohra_final_${fd.opportunityId}.md`
    a.click()
  }

  const fixCount   = fd.complianceFixes.length
  const highFixes  = fd.complianceFixes.filter(f => f.severity === 'High').length
  const scoreColor = (s: number) => s >= 75 ? 'text-green-600' : s >= 50 ? 'text-orange-500' : 'text-red-600'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-teal-700 rounded-xl p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-1">Final Draft — Pipeline Complete</div>
            <h2 className="text-xl font-bold leading-snug">{fd.processedDraft.h1}</h2>
            <div className="text-white/60 text-xs mt-1">
              Processed {new Date(fd.processedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-sm transition-colors flex-shrink-0">← Back to draft</button>
        </div>

        {/* Agent pipeline strip */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-white/50 text-xs mb-2 font-semibold uppercase tracking-wider">Agents that ran on this draft</div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { icon: '✍️', label: 'Agent 3', note: 'drafted', bg: 'bg-white/10' },
              { icon: '⚖️', label: 'Agent 4', note: 'compliance fixed', bg: 'bg-white/20', highlight: true },
              { icon: '⚙️', label: 'Agent 5', note: 'technical GEO', bg: 'bg-white/20', highlight: true },
              { icon: '✅', label: 'Final',   note: 'publish-ready', bg: 'bg-white/10' },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold ${step.bg} ${step.highlight ? 'ring-1 ring-white/40' : ''}`}>
                  <span>{step.icon}</span> {step.label}
                  <span className="text-white/60 font-normal">{step.note}</span>
                </div>
                {i < arr.length - 1 && <span className="text-white/30 text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Score summary */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-2xl font-bold">{fixCount}</div>
            <div className="text-xs text-white/60">Agent 4 fixes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{fd.placeholderCount}</div>
            <div className="text-xs text-white/60">placeholders left</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{fd.techScore}</div>
            <div className="text-xs text-white/60">Agent 5 GEO score</div>
          </div>
        </div>
      </div>

      {/* Issue change banner */}
      <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <span className="text-green-600 text-lg">✓</span>
        <div className="text-sm text-green-700">
          <strong>Agent 4</strong> fixed {fixCount} compliance issue{fixCount !== 1 ? 's' : ''}
          {highFixes > 0 && ` (${highFixes} High severity)`}
          {' '}· <strong>Agent 5</strong> generated schemas & metadata · Risk reduced from <strong>{fd.preFixIssueCount}</strong> to <strong>{fd.postFixIssueCount}</strong>
          {fd.placeholderCount > 0 && ` · ${fd.placeholderCount} [PLACEHOLDER] item${fd.placeholderCount !== 1 ? 's' : ''} still need human input`}
        </div>
        <div className="ml-auto">
          <button onClick={downloadMd}
            className="px-3 py-1.5 text-xs font-semibold bg-green-700 text-white rounded-lg hover:bg-green-800">
            ↓ Download Final Draft
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── PREVIEW ─────────────────────────────────────────────────────── */}
      {activeTab === 'Preview' && <ArticlePreview fd={fd} />}

      {/* ── CHANGE REPORT ───────────────────────────────────────────────── */}
      {activeTab === 'Change Report' && (
        <div className="space-y-5">
          {/* Score comparison */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Overall Impact</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-red-50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">Before pipeline</div>
                <div className="text-3xl font-bold text-red-600">{fd.preFixIssueCount}</div>
                <div className="text-xs text-gray-400">compliance issues</div>
              </div>
              <div className="text-center bg-green-50 rounded-xl p-4">
                <div className="text-xs text-gray-500 mb-1">After pipeline</div>
                <div className="text-3xl font-bold text-green-600">{fd.postFixIssueCount}</div>
                <div className="text-xs text-gray-400">issues remaining</div>
              </div>
            </div>
          </div>

          {/* Agent 4 — Compliance */}
          <div className="bg-white rounded-xl border-2 border-orange-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">⚖️</span>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Agent 4 — Compliance & Brand Safety</div>
                <div className="text-xs text-gray-400">Auto-replaced risky phrases with compliant alternatives</div>
              </div>
              <span className="ml-auto text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-0.5">
                {fd.complianceFixes.length} fix{fd.complianceFixes.length !== 1 ? 'es' : ''}
              </span>
            </div>
            {fd.complianceFixes.length === 0 ? (
              <p className="text-sm text-green-600 font-medium">✓ No risky phrases detected in this draft.</p>
            ) : (
              <div className="space-y-3">
                {fd.complianceFixes.map((fix, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold border rounded-full px-2 py-0.5 ${severityBadge[fix.severity]}`}>
                        {fix.severity}
                      </span>
                      <span className="text-xs text-gray-400">{fix.field}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-gray-400 mb-1 font-semibold">Original</div>
                        <div className="bg-red-50 border border-red-100 rounded px-3 py-2 text-red-700 italic">"{fix.original}"</div>
                      </div>
                      <div>
                        <div className="text-gray-400 mb-1 font-semibold">Replaced with</div>
                        <div className="bg-green-50 border border-green-100 rounded px-3 py-2 text-green-700">"{fix.replacement}"</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {fd.placeholderCount > 0 && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <span className="text-amber-600 font-bold text-xs">⚠ NOT AUTO-FIXED BY AGENT 4</span>
                <p className="text-xs text-amber-700 mt-1">
                  <strong>{fd.placeholderCount} [PLACEHOLDER]</strong> item{fd.placeholderCount !== 1 ? 's' : ''} require manual input — prices, URLs, and policy-specific data cannot be auto-generated and must be filled in by the OHRA product team before publishing.
                </p>
              </div>
            )}
          </div>

          {/* Agent 5 — Technical GEO */}
          <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">⚙️</span>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Agent 5 — Technical GEO</div>
                <div className="text-xs text-gray-400">Generated schemas, metadata, and structural GEO improvements</div>
              </div>
              <span className="ml-auto text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5">
                Score: {fd.techScore}/100
              </span>
            </div>
            <div className="space-y-2">
              {fd.technicalImprovements.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg text-xs">
                  <span className={`px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${actionBadge[item.action]}`}>
                    {item.action}
                  </span>
                  <div>
                    <div className="font-semibold text-gray-700 mb-0.5">{item.item}</div>
                    <div className="text-gray-500">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEMA & METADATA ───────────────────────────────────────────── */}
      {activeTab === 'Schema & Metadata' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">⚙️</span>
            </div>
            <p className="text-xs text-blue-700">
              <strong>Agent 5 — Technical GEO</strong> generated all metadata and JSON-LD schemas below. These are ready to be injected into the page &lt;head&gt; on publish.
            </p>
          </div>
          {/* Metadata */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Generated Metadata</div>
            <div className="space-y-3">
              {[
                { label: 'SEO Title',         value: fd.seoTitle },
                { label: 'Meta Description',  value: fd.metaDescription },
                { label: 'URL Slug',          value: `https://www.ohra.nl/${fd.slug}` },
                { label: 'Technical Score',   value: `${fd.techScore}/100` },
              ].map(m => (
                <div key={m.label} className="flex items-start gap-3 text-xs">
                  <span className="text-gray-400 font-semibold w-36 flex-shrink-0">{m.label}</span>
                  <span className="text-gray-700 font-mono bg-gray-50 rounded px-2 py-1 flex-1">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Article JSON-LD */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Article JSON-LD</div>
              <button onClick={() => copyJSON(fd.jsonLdArticle)}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Copy</button>
            </div>
            <pre className="bg-gray-950 text-green-300 text-xs rounded-lg p-4 overflow-x-auto">
              {JSON.stringify(fd.jsonLdArticle, null, 2)}
            </pre>
          </div>

          {/* FAQPage JSON-LD */}
          {fd.jsonLdFAQ && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">FAQPage JSON-LD</div>
                <button onClick={() => copyJSON(fd.jsonLdFAQ!)}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Copy</button>
              </div>
              <pre className="bg-gray-950 text-green-300 text-xs rounded-lg p-4 overflow-x-auto">
                {JSON.stringify(fd.jsonLdFAQ, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
