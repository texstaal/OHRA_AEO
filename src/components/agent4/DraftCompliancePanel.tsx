'use client'
import { useState } from 'react'
import type { ContentDraft } from '@/types/agent3'
import type { FinalDraft } from '@/types/finalDraft'

const severityBadge: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-yellow-100 text-yellow-700 border-yellow-200',
}

interface EditableFields {
  intro: string
  answerBlock: string
  sections: { heading: string; body: string }[]
  cta: string
}

interface Props {
  oppLabel: string
  processed: FinalDraft
  alreadyApproved: boolean
  onApprove: (edited: ContentDraft) => void
  onClose: () => void
}

export function DraftCompliancePanel({ oppLabel, processed, alreadyApproved, onApprove, onClose }: Props) {
  const pd = processed.processedDraft
  const [tab, setTab] = useState<'fixes' | 'edit'>('fixes')
  const [fields, setFields] = useState<EditableFields>({
    intro: pd.intro,
    answerBlock: pd.answerBlock,
    sections: pd.sections.map(s => ({ heading: s.heading, body: s.body })),
    cta: pd.cta,
  })

  function handleApprove() {
    const edited: ContentDraft = {
      ...pd,
      intro: fields.intro,
      answerBlock: fields.answerBlock,
      sections: pd.sections.map((s, i) => ({
        ...s,
        heading: fields.sections[i]?.heading ?? s.heading,
        body:    fields.sections[i]?.body    ?? s.body,
      })),
      cta: fields.cta,
    }
    onApprove(edited)
  }

  function updateSection(idx: number, key: 'heading' | 'body', val: string) {
    setFields(f => ({
      ...f,
      sections: f.sections.map((s, i) => i === idx ? { ...s, [key]: val } : s),
    }))
  }

  const wordCount = fields.answerBlock.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-orange-500 rounded-xl p-5 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-1">Agent 4 — Compliance Review</div>
            <h2 className="text-xl font-bold leading-snug">{oppLabel}</h2>
            <div className="text-white/60 text-xs mt-1">
              {processed.complianceFixes.length} fix{processed.complianceFixes.length !== 1 ? 'es' : ''} auto-applied · {processed.placeholderCount} placeholders remaining
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-sm transition-colors flex-shrink-0">← Back</button>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-2xl font-bold">{processed.preFixIssueCount}</div>
            <div className="text-xs text-white/60">issues found</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{processed.complianceFixes.length}</div>
            <div className="text-xs text-white/60">auto-fixed</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{processed.placeholderCount}</div>
            <div className="text-xs text-white/60">need human input</div>
          </div>
        </div>
      </div>

      {/* Approve / already-approved banner */}
      {alreadyApproved ? (
        <div className="bg-violet-50 border border-violet-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-violet-600 text-lg">✓</span>
          <div className="text-sm text-violet-700 font-semibold">Approved — this draft has been sent to Agent 5</div>
          <a href="/agents/technical-geo" className="ml-auto text-xs font-bold text-violet-700 hover:underline">Go to Agent 5 →</a>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="text-sm font-bold text-green-800 mb-0.5">Review the fixes below, edit if needed, then approve</div>
            <div className="text-xs text-green-600">Approving sends this draft to <strong>Agent 5 — Technical GEO</strong> for schema generation.</div>
          </div>
          <button
            onClick={handleApprove}
            className="flex-shrink-0 px-5 py-2.5 bg-green-700 text-white text-sm font-bold rounded-xl hover:bg-green-800 transition-colors shadow-sm whitespace-nowrap"
          >
            Approve &amp; Send to Agent 5 →
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {([['fixes', 'Compliance Fixes'], ['edit', 'Edit Draft']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === key ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Compliance Fixes tab ─────────────────────────────────────────── */}
      {tab === 'fixes' && (
        <div className="space-y-4">
          {processed.complianceFixes.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-green-700 font-medium">
              ✓ No compliance issues found in this draft — it is already clean.
            </div>
          ) : (
            processed.complianceFixes.map((fix, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold border rounded-full px-2 py-0.5 ${severityBadge[fix.severity]}`}>
                    {fix.severity}
                  </span>
                  <span className="text-xs text-gray-400">{fix.field}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Original phrase</div>
                    <div className="bg-red-50 border border-red-100 rounded px-3 py-2 text-red-700 italic">
                      &ldquo;{fix.original}&rdquo;
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Auto-replaced with</div>
                    <div className="bg-green-50 border border-green-100 rounded px-3 py-2 text-green-700">
                      &ldquo;{fix.replacement}&rdquo;
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {processed.placeholderCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="text-xs font-bold text-amber-700 mb-1">⚠ {processed.placeholderCount} [PLACEHOLDER] items require manual input</div>
              <p className="text-xs text-amber-600">
                Prices, specific URLs, and policy details cannot be auto-generated. Edit them in the &ldquo;Edit Draft&rdquo; tab before approving.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Edit Draft tab ───────────────────────────────────────────────── */}
      {tab === 'edit' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
            All text below already has compliance fixes applied. Make any further edits, then click Approve.
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Introduction</div>
            <textarea
              value={fields.intro}
              onChange={e => setFields(f => ({ ...f, intro: e.target.value }))}
              rows={5}
              className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 resize-y focus:outline-none focus:border-orange-400"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Answer Block</div>
              <span className={`text-xs font-semibold ${wordCount >= 60 && wordCount <= 90 ? 'text-green-600' : 'text-orange-500'}`}>
                {wordCount} words {wordCount >= 60 && wordCount <= 90 ? '✓' : '(target: 60–90)'}
              </span>
            </div>
            <textarea
              value={fields.answerBlock}
              onChange={e => setFields(f => ({ ...f, answerBlock: e.target.value }))}
              rows={4}
              className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 resize-y focus:outline-none focus:border-orange-400"
            />
          </div>

          {fields.sections.map((section, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Section {i + 1}</div>
              <input
                value={section.heading}
                onChange={e => updateSection(i, 'heading', e.target.value)}
                placeholder="Section heading"
                className="w-full text-sm font-semibold text-gray-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-400"
              />
              <textarea
                value={section.body}
                onChange={e => updateSection(i, 'body', e.target.value)}
                rows={5}
                className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 resize-y focus:outline-none focus:border-orange-400"
              />
            </div>
          ))}

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Call to Action</div>
            <textarea
              value={fields.cta}
              onChange={e => setFields(f => ({ ...f, cta: e.target.value }))}
              rows={3}
              className="w-full text-sm text-gray-700 border border-gray-200 rounded-lg px-3 py-2 resize-y focus:outline-none focus:border-orange-400"
            />
          </div>

          {!alreadyApproved && (
            <button
              onClick={handleApprove}
              className="w-full py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-colors shadow-sm"
            >
              Approve &amp; Send to Agent 5 →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
