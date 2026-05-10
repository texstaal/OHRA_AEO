'use client'
import { useState, useEffect } from 'react'
import { draftOpportunities } from '@/data/agent3Data'
import { generateDraft } from '@/lib/agent3Generator'
import { DraftPanel } from '@/components/agent3/DraftPanel'
import { FinalDraftPanel } from '@/components/agent3/FinalDraftPanel'
import { processDraft } from '@/lib/finalDraftProcessor'
import type { ContentDraft, DraftStatus } from '@/types/agent3'
import type { FinalDraft } from '@/types/finalDraft'

const LS_FINALS = 'agent3_final_drafts'

const LS_STATUSES = 'agent3_draft_statuses'
const LS_A2       = 'agent2_brief_statuses'

const gapBadge: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-green-100 text-green-700 border-green-200',
}

export function DraftWritingDashboard() {
  const [a2Approved, setA2Approved]       = useState<Set<string>>(new Set())
  const [draftStatuses, setDraftStatuses] = useState<Record<string, DraftStatus>>({})
  const [activeDraft, setActiveDraft]     = useState<ContentDraft | null>(null)
  const [activeFinal, setActiveFinal]     = useState<FinalDraft | null>(null)

  useEffect(() => {
    try {
      const a2 = localStorage.getItem(LS_A2)
      if (a2) {
        const parsed: Record<string, string> = JSON.parse(a2)
        setA2Approved(new Set(Object.entries(parsed).filter(([, v]) => v === 'Approved').map(([k]) => k)))
      }
    } catch { /* ignore */ }

    try {
      const s = localStorage.getItem(LS_STATUSES)
      if (s) setDraftStatuses(JSON.parse(s))
    } catch { /* ignore */ }
  }, [])

  function handleGenerate(oppId: string) {
    const status = draftStatuses[oppId] ?? 'Draft Generated'
    const draft = generateDraft(oppId, status)
    if (draft) setActiveDraft(draft)
  }

  function handleStatusChange(status: DraftStatus) {
    if (!activeDraft) return
    const next = { ...draftStatuses, [activeDraft.opportunityId]: status }
    setDraftStatuses(next)
    setActiveDraft({ ...activeDraft, status })
    try { localStorage.setItem(LS_STATUSES, JSON.stringify(next)) } catch { /* ignore */ }
  }

  function handleProcessFinal() {
    if (!activeDraft) return
    const fd = processDraft(activeDraft)
    // Persist so the result survives navigation
    try {
      const existing = JSON.parse(localStorage.getItem(LS_FINALS) ?? '{}')
      localStorage.setItem(LS_FINALS, JSON.stringify({ ...existing, [fd.opportunityId]: fd }))
    } catch { /* ignore */ }
    setActiveFinal(fd)
  }

  const sorted = [...draftOpportunities].sort((a, b) => {
    const aA = a2Approved.has(a.id) ? 1 : 0
    const bA = a2Approved.has(b.id) ? 1 : 0
    if (bA !== aA) return bA - aA
    return b.priorityScore - a.priorityScore
  })

  return (
    <div className="max-w-[1100px]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#1d4ed8] flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">✍️</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent 3 — Draft Writing</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Turns approved content briefs into first-draft articles using answer-first formatting.
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold">
            Layer 1 — The Factory
          </span>
        </div>
      </div>

      {activeFinal ? (
        <FinalDraftPanel finalDraft={activeFinal} onClose={() => setActiveFinal(null)} />
      ) : activeDraft ? (
        <DraftPanel
          draft={activeDraft}
          onStatusChange={handleStatusChange}
          onClose={() => { setActiveDraft(null); setActiveFinal(null) }}
          onProcessFinal={handleProcessFinal}
        />
      ) : (
        <div className="space-y-6">
          {a2Approved.size > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <p className="text-sm text-green-700">
                <strong>{a2Approved.size} brief{a2Approved.size !== 1 ? 's' : ''} approved</strong> in Agent 2. Approved briefs are highlighted below.
              </p>
            </div>
          )}

          {a2Approved.size === 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">ℹ️</span>
              <p className="text-sm text-blue-700">
                No briefs approved in Agent 2 yet. You can still generate drafts from the sample briefs below. To approve a brief, go to <strong>Agent 2 → Content Briefs</strong> and set the status to &ldquo;Approved&rdquo;.
              </p>
            </div>
          )}

          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Select a content brief to generate a first draft
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sorted.map(opp => {
                const isA2Approved = a2Approved.has(opp.id)
                const draftStatus  = draftStatuses[opp.id]
                const hasDraft     = !!draftStatus

                return (
                  <div
                    key={opp.id}
                    className={`bg-white rounded-xl border-2 shadow-sm p-5 flex flex-col gap-4 ${
                      isA2Approved ? 'border-green-300' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {isA2Approved && (
                          <div className="text-xs font-semibold text-green-600 flex items-center gap-1 mb-1">
                            <span>✓</span> Agent 2 Brief Approved
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

                    {hasDraft && (
                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        Draft status: <strong>{draftStatus}</strong>
                      </div>
                    )}

                    <button
                      onClick={() => handleGenerate(opp.id)}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isA2Approved
                          ? 'bg-[#1d4ed8] text-white hover:bg-blue-800'
                          : 'bg-gray-50 text-[#1d4ed8] border border-[#1d4ed8]/30 hover:bg-[#1d4ed8] hover:text-white'
                      }`}
                    >
                      {hasDraft ? 'View Draft →' : 'Generate Draft →'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pipeline position */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Agent 3 in the content pipeline
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {[
                { icon: '🔍', label: 'Agent 1', note: 'discovers', bg: 'bg-[#1e3a5f]' },
                { icon: '📄', label: 'Agent 2', note: 'briefs', bg: 'bg-blue-600' },
                { icon: '✍️', label: 'Agent 3', note: 'drafts', bg: 'bg-[#1d4ed8]', active: true },
                { icon: '⚖️', label: 'Agent 4', note: 'compliance', bg: 'bg-gray-400' },
                { icon: '⚙️', label: 'Agent 5', note: 'technical', bg: 'bg-gray-400' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-medium ${step.bg} ${step.active ? 'ring-2 ring-blue-300' : ''}`}>
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
