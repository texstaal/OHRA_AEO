'use client'
import { useState } from 'react'
import type { TechnicalReport, TechnicalStatus, IssueSeverity } from '@/types/agent5'
import { reportToMarkdown, reportToCSV } from '@/lib/agent5Checker'
import type { TechnicalPage } from '@/types/agent5'

const severityBadge: Record<IssueSeverity, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-yellow-100 text-yellow-700 border-yellow-200',
}

const statusBadge: Record<string, string> = {
  pass: 'bg-green-100 text-green-700 border-green-200',
  warn: 'bg-orange-100 text-orange-700 border-orange-200',
  fail: 'bg-red-100 text-red-700 border-red-200',
}

const scoreBar = (score: number) =>
  score >= 75 ? 'bg-green-500' : score >= 50 ? 'bg-orange-500' : 'bg-red-500'

const statusOptions: TechnicalStatus[] = [
  'Not Checked',
  'Needs Technical Review',
  'Needs Content Update',
  'Approved for Publishing Queue',
  'Rejected',
]

interface Props {
  report: TechnicalReport
  page: TechnicalPage
  onStatusChange: (s: TechnicalStatus) => void
  onClose: () => void
}

export function TechnicalPanel({ report, page, onStatusChange, onClose }: Props) {
  const [schemaTab, setSchemaTab] = useState(0)

  function download(content: string, filename: string) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
    a.download = filename
    a.click()
  }

  const highCount = report.issues.filter(i => i.severity === 'High').length
  const schema    = report.schemaRecommendations[schemaTab]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-sm font-medium flex items-center gap-1">
          ← Back
        </button>
        <span className="text-gray-300">|</span>
        <h2 className="text-base font-bold text-gray-900">{report.pageLabel}</h2>
        <span className="text-xs text-gray-400 ml-auto">
          Checked {new Date(report.checkedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Score card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Technical GEO Score</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">{report.totalScore}</span>
              <span className="text-gray-400 text-sm">/ 100</span>
              {highCount > 0 && (
                <span className="ml-2 text-xs font-bold text-red-600">{highCount} High issue{highCount !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => download(reportToMarkdown(report, page), `geo-report-${page.id}.md`)}
              className="px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
            >
              ↓ Markdown
            </button>
            <button
              onClick={() => download(reportToCSV(report), `geo-report-${page.id}.csv`)}
              className="px-3 py-1.5 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100"
            >
              ↓ CSV
            </button>
          </div>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div className={`h-full rounded-full ${scoreBar(report.totalScore)}`} style={{ width: `${report.totalScore}%` }} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {report.subScores.map(ss => (
            <div key={ss.label} className={`rounded-lg px-3 py-2 border text-xs ${statusBadge[ss.status]}`}>
              <div className="font-semibold">{ss.label}</div>
              <div className="mt-0.5 opacity-80">{ss.score}/{ss.max} — {ss.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Review status */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Review Status</div>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => onStatusChange(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                report.status === s
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 italic">
          This agent does not publish anything. It only prepares technical recommendations for human review.
        </p>
      </div>

      {/* Issues */}
      {report.issues.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Issues ({report.issues.length})
          </div>
          <div className="space-y-3">
            {report.issues.map((issue, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold border rounded-full px-2 py-0.5 ${severityBadge[issue.severity]}`}>
                    {issue.severity}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{issue.issue}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">
                  <span className="font-semibold text-gray-700">Why it matters: </span>{issue.why}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-green-700">Fix: </span>{issue.fix}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schema recommendations */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Schema Markup Recommendations
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {report.schemaRecommendations.map((s, i) => (
            <button
              key={s.type}
              onClick={() => setSchemaTab(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                schemaTab === i
                  ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {s.type}
            </button>
          ))}
        </div>
        {schema && (
          <>
            <p className="text-xs text-gray-500 mb-3">{schema.reason}</p>
            <div className="relative">
              <pre className="bg-gray-950 text-green-300 text-xs rounded-lg p-4 overflow-x-auto">
                {JSON.stringify(schema.jsonLd, null, 2)}
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(schema.jsonLd, null, 2))}
                className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
              >
                Copy
              </button>
            </div>
          </>
        )}
      </div>

      {/* Metadata checklist */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Metadata Checklist</div>
        <div className="space-y-2">
          {report.metadataItems.map(item => (
            <div key={item.label} className="flex items-start gap-3 text-xs">
              <span className={`mt-0.5 flex-shrink-0 font-bold ${item.ok ? 'text-green-600' : 'text-red-500'}`}>
                {item.ok ? '✓' : '✗'}
              </span>
              <span className="font-semibold text-gray-700 w-36 flex-shrink-0">{item.label}</span>
              <span className="text-gray-500 truncate">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Internal link suggestions */}
      {report.internalLinkSuggestions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Internal Link Suggestions
          </div>
          <ul className="space-y-1.5">
            {report.internalLinkSuggestions.map(link => (
              <li key={link} className="flex items-center gap-2 text-xs text-gray-600">
                <span className="text-blue-400">→</span>
                <span className="font-mono text-gray-500">{link}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
