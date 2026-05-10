'use client'
import { useState, useEffect } from 'react'
import { sampleOpportunities } from '@/data/agent2Data'
import { generateBrief } from '@/lib/agent2Generator'
import { BriefPanel } from '@/components/agent2/BriefPanel'
import type { ContentBrief, BriefStatus, SampleOpportunity } from '@/types/agent2'

const LS_STATUSES = 'agent2_brief_statuses'
const LS_A1       = 'agent1_review_statuses'

const gapBadge: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-green-100 text-green-700 border-green-200',
}

const intentColor: Record<string, string> = {
  'Awareness':             'text-sky-600',
  'Consideration':         'text-blue-600',
  'Comparison':            'text-indigo-600',
  'Purchase':              'text-green-600',
  'Post-purchase / Claim': 'text-purple-600',
}

export function ContentBriefsDashboard() {
  const [agent1Approved, setAgent1Approved]   = useState<Set<string>>(new Set())
  const [briefStatuses, setBriefStatuses]     = useState<Record<string, BriefStatus>>({})
  const [activeBrief, setActiveBrief]         = useState<ContentBrief | null>(null)
  const [selectedOpp, setSelectedOpp]         = useState<SampleOpportunity | null>(null)

  useEffect(() => {
    try {
      const a1 = localStorage.getItem(LS_A1)
      if (a1) {
        const parsed: Record<string, string> = JSON.parse(a1)
        setAgent1Approved(new Set(Object.entries(parsed).filter(([, v]) => v === 'Approved').map(([k]) => k)))
      }
    } catch { /* ignore */ }

    try {
      const s = localStorage.getItem(LS_STATUSES)
      if (s) setBriefStatuses(JSON.parse(s))
    } catch { /* ignore */ }
  }, [])

  function handleGenerate(opp: SampleOpportunity) {
    const existingStatus = briefStatuses[opp.id] ?? 'Draft'
    const brief = generateBrief(opp.id, existingStatus)
    if (brief) {
      setActiveBrief(brief)
      setSelectedOpp(opp)
    }
  }

  function handleStatusChange(status: BriefStatus) {
    if (!activeBrief) return
    const next = { ...briefStatuses, [activeBrief.opportunityId]: status }
    setBriefStatuses(next)
    setActiveBrief({ ...activeBrief, status })
    try { localStorage.setItem(LS_STATUSES, JSON.stringify(next)) } catch { /* ignore */ }
  }

  // Sort: Agent-1-approved first, then by priority score
  const sortedOpportunities = [...sampleOpportunities].sort((a, b) => {
    const aA = agent1Approved.has(a.themeId) ? 1 : 0
    const bA = agent1Approved.has(b.themeId) ? 1 : 0
    if (bA !== aA) return bA - aA
    return b.priorityScore - a.priorityScore
  })

  return (
    <div className="max-w-[1100px]">
      {/* Page identity */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-blue-700 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">📄</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent 2 — Content Briefs</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Turns approved opportunities into structured AI-optimized content briefs.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold">
            Layer 1 — The Factory
          </span>
        </div>
      </div>

      {activeBrief ? (
        /* ── Brief view ── */
        <BriefPanel
          brief={activeBrief}
          onStatusChange={handleStatusChange}
          onClose={() => { setActiveBrief(null); setSelectedOpp(null) }}
        />
      ) : (
        /* ── Opportunity selector ── */
        <div className="space-y-6">
          {agent1Approved.size > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <p className="text-sm text-green-700">
                <strong>{agent1Approved.size} opportunit{agent1Approved.size === 1 ? 'y' : 'ies'} approved</strong> in Agent 1.
                Approved opportunities are highlighted below.
              </p>
            </div>
          )}

          {agent1Approved.size === 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">ℹ️</span>
              <p className="text-sm text-blue-700">
                No opportunities approved in Agent 1 yet. You can still generate briefs from the sample opportunities below.
                To approve opportunities, go to <strong>Agent 1 → Content Opportunities</strong> and set a status of &ldquo;Approved&rdquo;.
              </p>
            </div>
          )}

          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Select an opportunity to generate a brief
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedOpportunities.map(opp => {
                const isA1Approved   = agent1Approved.has(opp.themeId)
                const briefStatus    = briefStatuses[opp.id]
                const hasBrief       = !!briefStatus

                return (
                  <div
                    key={opp.id}
                    className={`bg-white rounded-xl border-2 shadow-sm p-5 flex flex-col gap-4 transition-all ${
                      isA1Approved ? 'border-green-300' : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {isA1Approved && (
                          <div className="text-xs font-semibold text-green-600 flex items-center gap-1 mb-1">
                            <span>✓</span> Agent 1 Approved
                          </div>
                        )}
                        <div className="font-bold text-gray-900 text-sm leading-tight">{opp.label}</div>
                        <div className={`text-xs mt-0.5 font-medium ${intentColor[opp.intentStage] ?? 'text-gray-500'}`}>
                          {opp.intentStage}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`text-xs font-semibold border rounded-full px-2 py-0.5 ${gapBadge[opp.gapLevel]}`}>
                          {opp.gapLevel} Gap
                        </span>
                        <span className="text-xs text-gray-400 font-bold">{opp.priorityScore} pts</span>
                      </div>
                    </div>

                    {/* CEP */}
                    <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      <span className="text-xs text-gray-400">CEP: </span>
                      <span className="text-xs font-medium text-gray-600">{opp.cep}</span>
                    </div>

                    {/* Brief status */}
                    {hasBrief && (
                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        Brief status: <strong>{briefStatus}</strong>
                      </div>
                    )}

                    {/* Action */}
                    <button
                      onClick={() => handleGenerate(opp)}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                        isA1Approved
                          ? 'bg-[#1e3a5f] text-white hover:bg-[#162d4a]'
                          : 'bg-gray-50 text-[#1e3a5f] border border-[#1e3a5f]/30 hover:bg-[#1e3a5f] hover:text-white'
                      }`}
                    >
                      {hasBrief ? 'View Brief →' : 'Generate Brief →'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* How it connects to Agent 1 */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              How Agent 2 connects to Agent 1
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <div className="flex items-center gap-2 bg-[#1e3a5f] text-white rounded-lg px-3 py-2">
                <span>🔍</span> <span className="font-medium">Agent 1</span>
                <span className="text-white/50 text-xs">discovers opportunity</span>
              </div>
              <span className="text-gray-300 text-lg">→</span>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2">
                <span>👤</span> <span className="text-xs font-medium">Marketing review</span>
              </div>
              <span className="text-gray-300 text-lg">→</span>
              <div className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-3 py-2">
                <span>📄</span> <span className="font-medium">Agent 2</span>
                <span className="text-white/50 text-xs">generates brief</span>
              </div>
              <span className="text-gray-300 text-lg">→</span>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2">
                <span>👤</span> <span className="text-xs font-medium">Content strategy review</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
