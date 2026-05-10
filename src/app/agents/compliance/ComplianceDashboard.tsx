'use client'
import { useState, useEffect } from 'react'
import { draftOpportunities } from '@/data/agent3Data'
import { generateDraft } from '@/lib/agent3Generator'
import { processDraft } from '@/lib/finalDraftProcessor'
import { DraftCompliancePanel } from '@/components/agent4/DraftCompliancePanel'
import type { ContentDraft, DraftStatus } from '@/types/agent3'
import type { FinalDraft } from '@/types/finalDraft'

const LS_A3 = 'agent3_draft_statuses'
const LS_A4 = 'agent4_approved_drafts'

const gapBadge: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-green-100 text-green-700 border-green-200',
}

export function ComplianceDashboard() {
  const [a3Approved, setA3Approved]   = useState<Set<string>>(new Set())
  const [a4Approved, setA4Approved]   = useState<Set<string>>(new Set())
  const [processed, setProcessed]     = useState<FinalDraft | null>(null)
  const [activeDraft, setActiveDraft] = useState<ContentDraft | null>(null)
  const [activeOppId, setActiveOppId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const a3 = localStorage.getItem(LS_A3)
      if (a3) {
        const parsed: Record<string, string> = JSON.parse(a3)
        setA3Approved(new Set(Object.entries(parsed).filter(([, v]) => v === 'Approved').map(([k]) => k)))
      }
    } catch { /* ignore */ }

    try {
      const a4 = localStorage.getItem(LS_A4)
      if (a4) setA4Approved(new Set(Object.keys(JSON.parse(a4))))
    } catch { /* ignore */ }
  }, [])

  function handleOpen(oppId: string) {
    const status: DraftStatus = a3Approved.has(oppId) ? 'Approved' : 'Draft Generated'
    const draft = generateDraft(oppId, status)
    if (!draft) return
    setActiveDraft(draft)
    setActiveOppId(oppId)
    setProcessed(processDraft(draft))
  }

  function handleApprove(edited: ContentDraft) {
    try {
      const existing = JSON.parse(localStorage.getItem(LS_A4) ?? '{}')
      localStorage.setItem(LS_A4, JSON.stringify({ ...existing, [edited.opportunityId]: edited }))
    } catch { /* ignore */ }
    setA4Approved(prev => new Set(Array.from(prev).concat(edited.opportunityId)))
    setActiveDraft(null)
    setActiveOppId(null)
    setProcessed(null)
  }

  function handleClose() {
    setActiveDraft(null)
    setActiveOppId(null)
    setProcessed(null)
  }

  const sorted = [...draftOpportunities].sort((a, b) => {
    const aA = a3Approved.has(a.id) ? 1 : 0
    const bA = a3Approved.has(b.id) ? 1 : 0
    if (bA !== aA) return bA - aA
    return b.priorityScore - a.priorityScore
  })

  return (
    <div className="max-w-[1100px]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">⚖️</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent 4 — Compliance &amp; Brand Safety</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Auto-fixes risky phrases in drafts from Agent 3. Review changes, edit if needed, then approve to pass to Agent 5.
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-full text-xs font-semibold">
            Layer 1 — Content Factory
          </span>
        </div>
      </div>

      {activeDraft && processed && activeOppId ? (
        <DraftCompliancePanel
          oppLabel={activeDraft.opportunityLabel}
          processed={processed}
          alreadyApproved={a4Approved.has(activeOppId)}
          onApprove={handleApprove}
          onClose={handleClose}
        />
      ) : (
        <div className="space-y-6">
          {a3Approved.size > 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <p className="text-sm text-green-700">
                <strong>{a3Approved.size} draft{a3Approved.size !== 1 ? 's' : ''} approved</strong> in Agent 3 — highlighted below.
                {a4Approved.size > 0 && ` ${a4Approved.size} already passed to Agent 5.`}
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">ℹ️</span>
              <p className="text-sm text-blue-700">
                No drafts approved in Agent 3 yet. You can still preview the compliance scan on any draft below.
                To start the pipeline, approve a draft in <strong>Agent 3 → Draft Writing</strong> first.
              </p>
            </div>
          )}

          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Select a draft to review and approve compliance fixes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sorted.map(opp => {
                const isA3 = a3Approved.has(opp.id)
                const isA4 = a4Approved.has(opp.id)

                return (
                  <div
                    key={opp.id}
                    className={`bg-white rounded-xl border-2 shadow-sm p-5 flex flex-col gap-4 ${
                      isA4 ? 'border-violet-300' : isA3 ? 'border-orange-300' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {isA4 && (
                          <div className="text-xs font-semibold text-violet-600 flex items-center gap-1 mb-1">
                            <span>✓</span> Sent to Agent 5
                          </div>
                        )}
                        {!isA4 && isA3 && (
                          <div className="text-xs font-semibold text-orange-600 flex items-center gap-1 mb-1">
                            <span>✓</span> Agent 3 Draft Approved
                          </div>
                        )}
                        <div className="font-bold text-gray-900 text-sm leading-tight">{opp.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{opp.intentStage}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${gapBadge[opp.gapLevel]}`}>
                          {opp.gapLevel} Gap
                        </span>
                        <span className="text-xs text-gray-400 font-bold">{opp.priorityScore} pts</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpen(opp.id)}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isA4
                          ? 'bg-violet-100 text-violet-700 border border-violet-200 hover:bg-violet-200'
                          : isA3
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-50 text-orange-600 border border-orange-300/40 hover:bg-orange-500 hover:text-white'
                      }`}
                    >
                      {isA4 ? 'View Compliance Review →' : isA3 ? 'Review & Approve →' : 'Preview Compliance Scan →'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pipeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Agent 4 in the content pipeline</div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {[
                { icon: '🔍', label: 'Agent 1', note: 'discovers', bg: 'bg-[#1e3a5f]' },
                { icon: '📄', label: 'Agent 2', note: 'briefs',    bg: 'bg-blue-600' },
                { icon: '✍️', label: 'Agent 3', note: 'drafts',    bg: 'bg-[#1d4ed8]' },
                { icon: '⚖️', label: 'Agent 4', note: 'compliance', bg: 'bg-orange-500', active: true },
                { icon: '⚙️', label: 'Agent 5', note: 'technical', bg: 'bg-violet-600' },
                { icon: '✅', label: 'Publish',  note: 'ready',    bg: 'bg-green-600' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-medium ${step.bg} ${(step as { active?: boolean }).active ? 'ring-2 ring-orange-300' : ''}`}>
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
