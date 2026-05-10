'use client'
import { useState, useEffect } from 'react'
import { technicalPages } from '@/data/agent5Data'
import { checkPage } from '@/lib/agent5Checker'
import { TechnicalPanel } from '@/components/agent5/TechnicalPanel'
import type { TechnicalReport, TechnicalStatus } from '@/types/agent5'

const LS_STATUSES = 'agent5_technical_statuses'
const LS_A4       = 'agent4_compliance_statuses'

const gapBadge: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-green-100 text-green-700 border-green-200',
}

const scoreColor = (s: number) =>
  s >= 75 ? 'text-green-600' : s >= 50 ? 'text-orange-600' : 'text-red-600'

export function TechnicalGeoDashboard() {
  const [a4Approved, setA4Approved]     = useState<Set<string>>(new Set())
  const [statuses, setStatuses]         = useState<Record<string, TechnicalStatus>>({})
  const [activeReport, setActiveReport] = useState<TechnicalReport | null>(null)
  const [activePage, setActivePage]     = useState<(typeof technicalPages)[0] | null>(null)

  useEffect(() => {
    try {
      const a4 = localStorage.getItem(LS_A4)
      if (a4) {
        const parsed: Record<string, string> = JSON.parse(a4)
        setA4Approved(new Set(
          Object.entries(parsed)
            .filter(([, v]) => v === 'Approved for Next Step')
            .map(([k]) => k)
        ))
      }
    } catch { /* ignore */ }

    try {
      const s = localStorage.getItem(LS_STATUSES)
      if (s) setStatuses(JSON.parse(s))
    } catch { /* ignore */ }
  }, [])

  function handleCheck(id: string) {
    const page = technicalPages.find(p => p.id === id)
    if (!page) return
    const report = checkPage(page)
    const savedStatus = statuses[id]
    setActiveReport({ ...report, status: savedStatus ?? 'Not Checked' })
    setActivePage(page)
  }

  function handleStatusChange(status: TechnicalStatus) {
    if (!activeReport) return
    const next = { ...statuses, [activeReport.pageId]: status }
    setStatuses(next)
    setActiveReport({ ...activeReport, status })
    try { localStorage.setItem(LS_STATUSES, JSON.stringify(next)) } catch { /* ignore */ }
  }

  const sorted = [...technicalPages].sort((a, b) => {
    const aA = a4Approved.has(a.id) ? 1 : 0
    const bA = a4Approved.has(b.id) ? 1 : 0
    if (bA !== aA) return bA - aA
    return b.priorityScore - a.priorityScore
  })

  return (
    <div className="max-w-[1100px]">
      {/* Agent header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-teal-700 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">⚙️</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent 5 — Schema & Technical GEO</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Checks whether approved content is technically structured so AI systems can easily read, understand, and cite it.
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-700 rounded-full text-xs font-semibold">
            Layer 1 — The Factory
          </span>
        </div>
      </div>

      {activeReport && activePage ? (
        <TechnicalPanel
          report={activeReport}
          page={activePage}
          onStatusChange={handleStatusChange}
          onClose={() => { setActiveReport(null); setActivePage(null) }}
        />
      ) : (
        <div className="space-y-6">
          {/* A4 connection banner */}
          {a4Approved.size > 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <p className="text-sm text-green-700">
                <strong>{a4Approved.size} page{a4Approved.size !== 1 ? 's' : ''} approved</strong> in Agent 4 Compliance. Approved pages are highlighted below.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">ℹ️</span>
              <p className="text-sm text-blue-700">
                No pages approved in Agent 4 yet. You can still run technical GEO checks on the sample pages below.
              </p>
            </div>
          )}

          {/* Page cards */}
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Select a page to run a technical GEO check
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sorted.map(page => {
                const isA4Approved = a4Approved.has(page.id)
                const savedStatus  = statuses[page.id]
                const hasBeenChecked = !!savedStatus

                // Quick score preview
                const preview = checkPage(page)

                return (
                  <div
                    key={page.id}
                    className={`bg-white rounded-xl border-2 shadow-sm p-5 flex flex-col gap-4 ${
                      isA4Approved ? 'border-green-300' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {isA4Approved && (
                          <div className="text-xs font-semibold text-green-600 flex items-center gap-1 mb-1">
                            <span>✓</span> Agent 4 Approved
                          </div>
                        )}
                        <div className="font-bold text-gray-900 text-sm leading-tight">{page.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{page.intentStage}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${gapBadge[page.gapLevel]}`}>
                          {page.gapLevel} Gap
                        </span>
                        <span className="text-xs text-gray-400 font-bold">{page.priorityScore} pts</span>
                      </div>
                    </div>

                    {/* Score preview */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-400">GEO score:</span>
                      <span className={`font-bold ${scoreColor(preview.totalScore)}`}>
                        {preview.totalScore}/100
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-500">{preview.issues.length} issue{preview.issues.length !== 1 ? 's' : ''}</span>
                    </div>

                    {hasBeenChecked && (
                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-teal-500" />
                        Status: <strong>{savedStatus}</strong>
                      </div>
                    )}

                    <button
                      onClick={() => handleCheck(page.id)}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isA4Approved
                          ? 'bg-teal-700 text-white hover:bg-teal-800'
                          : 'bg-gray-50 text-teal-700 border border-teal-300/50 hover:bg-teal-700 hover:text-white'
                      }`}
                    >
                      {hasBeenChecked ? 'View Report →' : 'Run Technical GEO Check →'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* What this agent checks */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">What Agent 5 checks</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: '🏗️', label: 'Heading Structure', desc: 'H1/H2/H3 clarity' },
                { icon: '💬', label: 'Answer Block', desc: '60–90 word direct answer' },
                { icon: '❓', label: 'FAQ Readiness', desc: 'Min. 5 Q&A pairs' },
                { icon: '🏷️', label: 'Schema Markup', desc: 'JSON-LD recommendations' },
                { icon: '📋', label: 'Metadata', desc: 'Title, description, slug' },
                { icon: '🔗', label: 'Internal Links', desc: 'Site structure signals' },
                { icon: '📊', label: 'Comparison Table', desc: 'Structured data extraction' },
                { icon: '📤', label: 'Export', desc: 'Markdown, CSV, JSON-LD' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-2 text-xs">
                  <span className="text-base flex-shrink-0">{c.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-700">{c.label}</div>
                    <div className="text-gray-400">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Agent 5 in the content pipeline
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {[
                { icon: '🔍', label: 'Agent 1', note: 'discovers', bg: 'bg-[#1e3a5f]' },
                { icon: '📄', label: 'Agent 2', note: 'briefs', bg: 'bg-blue-600' },
                { icon: '✍️', label: 'Agent 3', note: 'drafts', bg: 'bg-[#1d4ed8]' },
                { icon: '⚖️', label: 'Agent 4', note: 'compliance', bg: 'bg-purple-700' },
                { icon: '⚙️', label: 'Agent 5', note: 'technical', bg: 'bg-teal-700', active: true },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-medium ${step.bg} ${(step as { active?: boolean }).active ? 'ring-2 ring-teal-300' : ''}`}>
                    <span>{step.icon}</span> {step.label}
                    <span className="text-white/50">{step.note}</span>
                  </div>
                  {i < arr.length - 1 && <span className="text-gray-300">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
