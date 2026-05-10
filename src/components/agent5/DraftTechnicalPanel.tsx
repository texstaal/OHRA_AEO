'use client'
import { useState } from 'react'
import type { FinalDraft } from '@/types/finalDraft'

const actionBadge: Record<string, string> = {
  Generated: 'bg-green-100 text-green-700',
  Fixed:     'bg-blue-100 text-blue-700',
  Noted:     'bg-orange-100 text-orange-700',
}

const TABS = ['Technical Report', 'Schema & Metadata'] as const

interface Props {
  finalDraft: FinalDraft
  alreadyApproved: boolean
  onApprove: () => void
  onClose: () => void
}

export function DraftTechnicalPanel({ finalDraft: fd, alreadyApproved, onApprove, onClose }: Props) {
  const [tab, setTab] = useState<typeof TABS[number]>('Technical Report')

  function copyJSON(obj: object) {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2)).catch(() => {})
  }

  const generated = fd.technicalImprovements.filter(i => i.action === 'Generated').length
  const noted     = fd.technicalImprovements.filter(i => i.action === 'Noted').length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-violet-700 rounded-xl p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-1">Agent 5 — Technical GEO Review</div>
            <h2 className="text-xl font-bold leading-snug">{fd.processedDraft.h1}</h2>
            <div className="text-white/60 text-xs mt-1">
              {generated} schema{generated !== 1 ? 's' : ''} generated · {noted} item{noted !== 1 ? 's' : ''} to address before publishing
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-sm transition-colors flex-shrink-0">← Back</button>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-2xl font-bold">{fd.techScore}</div>
            <div className="text-xs text-white/60">GEO score /100</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{generated}</div>
            <div className="text-xs text-white/60">schemas generated</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{fd.placeholderCount}</div>
            <div className="text-xs text-white/60">placeholders left</div>
          </div>
        </div>
      </div>

      {/* Approve / status banner */}
      {alreadyApproved ? (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-green-600 text-lg">✅</span>
          <div className="text-sm text-green-700 font-semibold">Approved for publishing — visible in Ready to Publish</div>
          <a href="/ready-to-publish" className="ml-auto text-xs font-bold text-green-700 hover:underline">View →</a>
        </div>
      ) : (
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="text-sm font-bold text-violet-900 mb-0.5">Review the technical checks, then approve for publishing</div>
            <div className="text-xs text-violet-600">
              Approving moves this article to <strong>Ready to Publish</strong> with full schema and metadata attached.
            </div>
          </div>
          <button
            onClick={onApprove}
            className="flex-shrink-0 px-5 py-2.5 bg-violet-700 text-white text-sm font-bold rounded-xl hover:bg-violet-800 transition-colors shadow-sm whitespace-nowrap"
          >
            Approve for Publishing →
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Technical Report ─────────────────────────────────────────────── */}
      {tab === 'Technical Report' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Technical GEO improvements applied by Agent 5
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

          {/* GEO score bar */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">GEO Score Breakdown</div>
              <span className={`text-sm font-bold ${fd.techScore >= 75 ? 'text-green-600' : fd.techScore >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                {fd.techScore}/100
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all ${fd.techScore >= 75 ? 'bg-green-500' : fd.techScore >= 50 ? 'bg-orange-400' : 'bg-red-400'}`}
                style={{ width: `${fd.techScore}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Schema & Metadata ────────────────────────────────────────────── */}
      {tab === 'Schema & Metadata' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Generated Metadata</div>
            <div className="space-y-3">
              {[
                { label: 'SEO Title',        value: fd.seoTitle },
                { label: 'Meta Description', value: fd.metaDescription },
                { label: 'URL Slug',         value: `https://www.ohra.nl/${fd.slug}` },
                { label: 'GEO Score',        value: `${fd.techScore}/100` },
              ].map(m => (
                <div key={m.label} className="flex items-start gap-3 text-xs">
                  <span className="text-gray-400 font-semibold w-36 flex-shrink-0">{m.label}</span>
                  <span className="text-gray-700 font-mono bg-gray-50 rounded px-2 py-1 flex-1">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Article JSON-LD</div>
              <button onClick={() => copyJSON(fd.jsonLdArticle)} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Copy</button>
            </div>
            <pre className="bg-gray-950 text-green-300 text-xs rounded-lg p-4 overflow-x-auto">
              {JSON.stringify(fd.jsonLdArticle, null, 2)}
            </pre>
          </div>

          {fd.jsonLdFAQ && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">FAQPage JSON-LD</div>
                <button onClick={() => copyJSON(fd.jsonLdFAQ!)} className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Copy</button>
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
