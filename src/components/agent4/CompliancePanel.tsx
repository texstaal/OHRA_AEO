'use client'
import type { ComplianceReport, ComplianceStatus, ComplianceSeverity } from '@/types/agent4'

const severityBadge: Record<ComplianceSeverity, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border-orange-200',
  Low:    'bg-yellow-100 text-yellow-700 border-yellow-200',
}

const riskBar: Record<string, string> = {
  Low:    'bg-green-500',
  Medium: 'bg-orange-500',
  High:   'bg-red-500',
}

const statusOptions: ComplianceStatus[] = [
  'Not Reviewed',
  'Needs Marketing Review',
  'Needs Compliance Review',
  'Approved for Next Step',
  'Rejected',
]

interface Props {
  report: ComplianceReport
  onStatusChange: (s: ComplianceStatus) => void
  onClose: () => void
}

export function CompliancePanel({ report, onStatusChange, onClose }: Props) {
  const highCount   = report.issues.filter(i => i.rule.severity === 'High').length
  const mediumCount = report.issues.filter(i => i.rule.severity === 'Medium').length
  const lowCount    = report.issues.filter(i => i.rule.severity === 'Low').length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 text-sm font-medium flex items-center gap-1"
        >
          ← Back
        </button>
        <span className="text-gray-300">|</span>
        <h2 className="text-base font-bold text-gray-900">{report.draftLabel}</h2>
        <span className="text-xs text-gray-400 ml-auto">
          Checked {new Date(report.checkedAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Risk score card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Compliance Risk Score</div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">{report.riskScore}</span>
              <span className="text-gray-400 text-sm">/ 100</span>
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold border ${severityBadge[report.riskLevel]}`}>
                {report.riskLevel} Risk
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 mb-1">Issues found</div>
            <div className="flex items-center gap-2 justify-end">
              {highCount > 0 && <span className="text-xs font-bold text-red-600">{highCount} High</span>}
              {mediumCount > 0 && <span className="text-xs font-bold text-orange-600">{mediumCount} Med</span>}
              {lowCount > 0 && <span className="text-xs font-bold text-yellow-600">{lowCount} Low</span>}
              {report.issues.length === 0 && <span className="text-xs font-bold text-green-600">None</span>}
            </div>
          </div>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${riskBar[report.riskLevel]}`}
            style={{ width: `${report.riskScore}%` }}
          />
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
                  ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Flagged issues */}
      {report.issues.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Flagged Issues ({report.issues.length})
          </div>
          <div className="space-y-3">
            {report.issues.map((issue, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold border rounded-full px-2 py-0.5 ${severityBadge[issue.rule.severity]}`}>
                      {issue.rule.severity}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">{issue.rule.category}</span>
                  </div>
                  <span className="text-xs text-gray-300 font-mono flex-shrink-0">{issue.rule.id}</span>
                </div>
                <blockquote className="text-xs text-gray-600 bg-gray-50 rounded px-3 py-2 mb-2 italic border-l-2 border-gray-300">
                  "{issue.snippet}"
                </blockquote>
                <p className="text-xs text-gray-500 mb-1.5">
                  <span className="font-semibold text-red-600">Risk: </span>{issue.rule.why}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-green-700">Suggestion: </span>{issue.rule.suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing evidence */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Missing Evidence ({report.missingEvidence.length})
        </div>
        <ul className="space-y-2">
          {report.missingEvidence.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="text-orange-400 mt-0.5 flex-shrink-0">○</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Brand tone */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Brand Tone Notes
        </div>
        <ul className="space-y-2">
          {report.brandToneNotes.map((note, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
