'use client'
import { useState, useEffect } from 'react'
import { draftOpportunities } from '@/data/agent3Data'
import { processDraft } from '@/lib/finalDraftProcessor'
import { DraftTechnicalPanel } from '@/components/agent5/DraftTechnicalPanel'
import type { ContentDraft } from '@/types/agent3'
import type { FinalDraft } from '@/types/finalDraft'

const LS_A4      = 'agent4_approved_drafts'
const LS_PUBLISH = 'agent5_ready_to_publish'

const gapBadge: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-green-100 text-green-700 border-green-200',
}

export function TechnicalGeoDashboard() {
  const [a4Drafts, setA4Drafts]   = useState<Record<string, ContentDraft>>({})
  const [readyIds, setReadyIds]   = useState<Set<string>>(new Set())
  const [activeFinal, setActiveFinal] = useState<FinalDraft | null>(null)
  const [activeOppId, setActiveOppId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const a4 = localStorage.getItem(LS_A4)
      if (a4) setA4Drafts(JSON.parse(a4))
    } catch { /* ignore */ }

    try {
      const pub = localStorage.getItem(LS_PUBLISH)
      if (pub) setReadyIds(new Set(Object.keys(JSON.parse(pub))))
    } catch { /* ignore */ }
  }, [])

  function handleOpen(oppId: string) {
    const draft = a4Drafts[oppId]
    if (!draft) return
    setActiveFinal(processDraft(draft))
    setActiveOppId(oppId)
  }

  function handleApprove() {
    if (!activeFinal) return
    try {
      const existing = JSON.parse(localStorage.getItem(LS_PUBLISH) ?? '{}')
      localStorage.setItem(LS_PUBLISH, JSON.stringify({ ...existing, [activeFinal.opportunityId]: activeFinal }))
    } catch { /* ignore */ }
    setReadyIds(prev => new Set(Array.from(prev).concat(activeFinal.opportunityId)))
  }

  function handleClose() {
    setActiveFinal(null)
    setActiveOppId(null)
  }

  const a4Ids = new Set(Object.keys(a4Drafts))

  const sorted = [...draftOpportunities].sort((a, b) => {
    const aA = a4Ids.has(a.id) ? 1 : 0
    const bA = a4Ids.has(b.id) ? 1 : 0
    if (bA !== aA) return bA - aA
    return b.priorityScore - a.priorityScore
  })

  return (
    <div className="max-w-[1100px]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-violet-700 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">⚙️</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent 5 — Technical GEO</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Generates JSON-LD schemas, SEO metadata, and GEO scores for compliance-approved drafts before publishing.
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-2.5 py-1 bg-violet-50 border border-violet-200 text-violet-700 rounded-full text-xs font-semibold">
            Layer 1 — Content Factory
          </span>
        </div>
      </div>

      {activeFinal && activeOppId ? (
        <DraftTechnicalPanel
          finalDraft={activeFinal}
          alreadyApproved={readyIds.has(activeOppId)}
          onApprove={handleApprove}
          onClose={handleClose}
        />
      ) : (
        <div className="space-y-6">
          {a4Ids.size > 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <p className="text-sm text-green-700">
                <strong>{a4Ids.size} draft{a4Ids.size !== 1 ? 's' : ''} approved</strong> in Agent 4.
                {readyIds.size > 0 && ` ${readyIds.size} already approved for publishing.`}
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">ℹ️</span>
              <p className="text-sm text-blue-700">
                No drafts from Agent 4 yet. Once a compliance review is approved in <strong>Agent 4 → Compliance</strong>, the draft will appear here for technical GEO processing.
              </p>
            </div>
          )}

          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Drafts awaiting technical GEO review
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sorted.map(opp => {
                const isA4    = a4Ids.has(opp.id)
                const isReady = readyIds.has(opp.id)

                return (
                  <div
                    key={opp.id}
                    className={`bg-white rounded-xl border-2 shadow-sm p-5 flex flex-col gap-4 ${
                      isReady ? 'border-green-300' : isA4 ? 'border-violet-300' : 'border-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {isReady && (
                          <div className="text-xs font-semibold text-green-600 flex items-center gap-1 mb-1">
                            <span>✅</span> Ready to Publish
                          </div>
                        )}
                        {!isReady && isA4 && (
                          <div className="text-xs font-semibold text-violet-600 flex items-center gap-1 mb-1">
                            <span>✓</span> Agent 4 Approved
                          </div>
                        )}
                        {!isA4 && (
                          <div className="text-xs text-gray-300 mb-1">Awaiting Agent 4</div>
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
                      onClick={() => isA4 && handleOpen(opp.id)}
                      disabled={!isA4}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isReady
                          ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                          : isA4
                          ? 'bg-violet-700 text-white hover:bg-violet-800'
                          : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                      }`}
                    >
                      {isReady ? 'View Technical Report →' : isA4 ? 'Run Technical GEO →' : 'Awaiting Agent 4'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pipeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Agent 5 in the content pipeline</div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {[
                { icon: '🔍', label: 'Agent 1', note: 'discovers', bg: 'bg-[#1e3a5f]' },
                { icon: '📄', label: 'Agent 2', note: 'briefs',    bg: 'bg-blue-600' },
                { icon: '✍️', label: 'Agent 3', note: 'drafts',    bg: 'bg-[#1d4ed8]' },
                { icon: '⚖️', label: 'Agent 4', note: 'compliance', bg: 'bg-orange-500' },
                { icon: '⚙️', label: 'Agent 5', note: 'technical', bg: 'bg-violet-700', active: true },
                { icon: '✅', label: 'Publish',  note: 'ready',    bg: 'bg-green-600' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-white text-xs font-medium ${step.bg} ${(step as { active?: boolean }).active ? 'ring-2 ring-violet-300' : ''}`}>
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
