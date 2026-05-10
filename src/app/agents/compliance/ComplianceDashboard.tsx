'use client'
import { useState, useEffect } from 'react'
import { draftInputs } from '@/data/agent4Data'
import { complianceRules, scanDraft } from '@/lib/agent4Checker'
import { CompliancePanel } from '@/components/agent4/CompliancePanel'
import type { ComplianceReport, ComplianceStatus } from '@/types/agent4'

const LS_STATUSES = 'agent4_compliance_statuses'
const LS_A3       = 'agent3_draft_statuses'

const gapBadge: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-green-100 text-green-700 border-green-200',
}

const riskColor: Record<string, string> = {
  High:   'text-red-600',
  Medium: 'text-orange-600',
  Low:    'text-green-600',
}

export function ComplianceDashboard() {
  const [a3Approved, setA3Approved]       = useState<Set<string>>(new Set())
  const [statuses, setStatuses]           = useState<Record<string, ComplianceStatus>>({})
  const [activeReport, setActiveReport]   = useState<ComplianceReport | null>(null)

  useEffect(() => {
    try {
      const a3 = localStorage.getItem(LS_A3)
      if (a3) {
        const parsed: Record<string, string> = JSON.parse(a3)
        setA3Approved(new Set(
          Object.entries(parsed).filter(([, v]) => v === 'Approved').map(([k]) => k)
        ))
      }
    } catch { /* ignore */ }

    try {
      const s = localStorage.getItem(LS_STATUSES)
      if (s) setStatuses(JSON.parse(s))
    } catch { /* ignore */ }
  }, [])

  function handleScan(id: string) {
    const draft = draftInputs.find(d => d.id === id)
    if (!draft) return
    const report = scanDraft(draft, complianceRules)
    const savedStatus = statuses[id]
    setActiveReport({ ...report, status: savedStatus ?? 'Not Reviewed' })
  }

  function handleStatusChange(status: ComplianceStatus) {
    if (!activeReport) return
    const next = { ...statuses, [activeReport.opportunityId]: status }
    setStatuses(next)
    setActiveReport({ ...activeReport, status })
    try { localStorage.setItem(LS_STATUSES, JSON.stringify(next)) } catch { /* ignore */ }
  }

  const sorted = [...draftInputs].sort((a, b) => {
    const aA = a3Approved.has(a.id) ? 1 : 0
    const bA = a3Approved.has(b.id) ? 1 : 0
    if (bA !== aA) return bA - aA
    return b.priorityScore - a.priorityScore
  })

  return (
    <div className="max-w-[1100px]">
      {/* Agent header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-purple-700 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">⚖️</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent 4 — Compliance & Brand Safety</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Scans draft content for unsupported claims, insurance compliance risks, and brand tone issues.
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded-full text-xs font-semibold">
            Layer 1 — The Factory
          </span>
        </div>
      </div>

      {activeReport ? (
        <CompliancePanel
          report={activeReport}
          onStatusChange={handleStatusChange}
          onClose={() => setActiveReport(null)}
        />
      ) : (
        <div className="space-y-6">
          {/* A3 connection banner */}
          {a3Approved.size > 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <p className="text-sm text-green-700">
                <strong>{a3Approved.size} draft{a3Approved.size !== 1 ? 's' : ''} approved</strong> in Agent 3. Approved drafts are highlighted below.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">ℹ️</span>
              <p className="text-sm text-blue-700">
                No drafts approved in Agent 3 yet. You can still run compliance scans on the sample drafts below.
              </p>
            </div>
          )}

          {/* Draft cards */}
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Select a draft to run a compliance scan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sorted.map(draft => {
                const isA3Approved  = a3Approved.has(draft.id)
                const savedStatus   = statuses[draft.id]
                const hasBeenScanned = !!savedStatus

                // Quick preview scan for risk score display
                const preview = scanDraft(draft, complianceRules)

                return (
                  <div
                    key={draft.id}
                    className={`bg-white rounded-xl border-2 shadow-sm p-5 flex flex-col gap-4 ${
                      isA3Approved ? 'border-green-300' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {isA3Approved && (
                          <div className="text-xs font-semibold text-green-600 flex items-center gap-1 mb-1">
                            <span>✓</span> Agent 3 Draft Approved
                          </div>
                        )}
                        <div className="font-bold text-gray-900 text-sm leading-tight">{draft.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{draft.intentStage}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${gapBadge[draft.gapLevel]}`}>
                          {draft.gapLevel} Gap
                        </span>
                        <span className="text-xs text-gray-400 font-bold">{draft.priorityScore} pts</span>
                      </div>
                    </div>

                    {/* Risk preview */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-400">Risk preview:</span>
                      <span className={`font-bold ${riskColor[preview.riskLevel]}`}>
                        {preview.riskScore}/100 — {preview.riskLevel}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-500">{preview.issues.length} issues</span>
                    </div>

                    {hasBeenScanned && (
                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-400" />
                        Status: <strong>{savedStatus}</strong>
                      </div>
                    )}

                    <button
                      onClick={() => handleScan(draft.id)}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isA3Approved
                          ? 'bg-purple-700 text-white hover:bg-purple-800'
                          : 'bg-gray-50 text-purple-700 border border-purple-300/50 hover:bg-purple-700 hover:text-white'
                      }`}
                    >
                      {hasBeenScanned ? 'View Scan →' : 'Run Compliance Scan →'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Rules summary */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Active compliance rules ({complianceRules.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {(['High', 'Medium', 'Low'] as const).map(sev => {
                const count = complianceRules.filter(r => r.severity === sev).length
                return (
                  <span key={sev} className={`text-xs font-semibold border rounded-full px-3 py-1 ${gapBadge[sev]}`}>
                    {count} {sev}
                  </span>
                )
              })}
              {(['Unsupported Claim', 'Insurance Compliance', 'Missing Evidence', 'Brand Tone', 'GEO Safety'] as const).map(cat => (
                <span key={cat} className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Pipeline position */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Agent 4 in the content pipeline
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {[
                { icon: '🔍', label: 'Agent 1', note: 'discovers', bg: 'bg-[#1e3a5f]' },
                { icon: '📄', label: 'Agent 2', note: 'briefs', bg: 'bg-blue-600' },
                { icon: '✍️', label: 'Agent 3', note: 'drafts', bg: 'bg-[#1d4ed8]' },
                { icon: '⚖️', label: 'Agent 4', note: 'compliance', bg: 'bg-purple-700', active: true },
                { icon: '⚙️', label: 'Agent 5', note: 'technical', bg: 'bg-gray-400' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-medium ${step.bg} ${(step as { active?: boolean }).active ? 'ring-2 ring-purple-300' : ''}`}>
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
