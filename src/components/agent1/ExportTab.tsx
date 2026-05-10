'use client'
import type { AnalysisResult, ReviewStatus } from '@/types/agent1'
import { exportToCSV } from '@/lib/agent1Analyzer'

interface Props {
  analysis: AnalysisResult
  reviewStatuses: Record<string, ReviewStatus>
}

export function ExportTab({ analysis, reviewStatuses }: Props) {
  function downloadCSV() {
    const csv = exportToCSV(analysis.themes, reviewStatuses)
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ohra_geo_opportunities_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const approved = analysis.themes.filter(t => (reviewStatuses[t.theme.id] ?? 'New') === 'Approved')
  const pending  = analysis.themes.filter(t => (reviewStatuses[t.theme.id] ?? 'New') === 'New')
  const rejected = analysis.themes.filter(t => (reviewStatuses[t.theme.id] ?? 'New') === 'Rejected')

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{approved.length}</div>
          <div className="text-xs text-green-600 mt-1 font-medium">Approved</div>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-center">
          <div className="text-3xl font-bold text-blue-700">{pending.length}</div>
          <div className="text-xs text-blue-600 mt-1 font-medium">Pending Review</div>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <div className="text-3xl font-bold text-red-700">{rejected.length}</div>
          <div className="text-xs text-red-600 mt-1 font-medium">Rejected</div>
        </div>
      </div>

      {/* What gets exported */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="font-semibold text-gray-800 mb-3">Export includes ({analysis.themes.length} opportunities)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 rounded-lg">
                <th className="text-left px-3 py-2 text-gray-500 font-semibold">Column</th>
                <th className="text-left px-3 py-2 text-gray-500 font-semibold">Example value</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {[
                ['Rank', '1'],
                ['Priority Score', '87'],
                ['Theme', 'Electric Vehicle Insurance'],
                ['CEP', 'Switching to electric driving'],
                ['Intent Stage', 'Awareness'],
                ['Entries', '8'],
                ['Top Competitor', 'Centraal Beheer'],
                ['OHRA Mentions', '0'],
                ['Gap Level', 'High'],
                ['Recommended Format', 'Informatieve pagina + FAQ'],
                ['Recommended Title', 'Autoverzekering elektrische auto: wat is anders dan bij benzine?'],
                ['Schema', 'FAQPage + Article'],
                ['Review Status', 'Approved'],
              ].map(([col, ex]) => (
                <tr key={col} className="border-b border-gray-50">
                  <td className="px-3 py-2 font-semibold">{col}</td>
                  <td className="px-3 py-2 text-gray-400 italic truncate max-w-xs">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download */}
      <div className="bg-[#1e3a5f] rounded-xl p-6 text-center">
        <div className="text-white text-lg mb-1">📊 Export Recommendations</div>
        <p className="text-white/60 text-xs mb-4">
          Downloads a CSV with all {analysis.themes.length} opportunities, priority scores, and current review statuses.
        </p>
        <button
          onClick={downloadCSV}
          className="px-6 py-3 bg-white text-[#1e3a5f] font-bold rounded-xl text-sm hover:bg-blue-50 transition-colors"
        >
          ↓ Download as CSV
        </button>
      </div>

      {/* Approved list */}
      {approved.length > 0 && (
        <div className="bg-white rounded-xl border border-green-100 shadow-sm p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            ✅ Approved Opportunities ({approved.length})
          </div>
          <div className="space-y-2">
            {approved.map((t, i) => (
              <div key={t.theme.id} className="flex items-center gap-3 bg-green-50 rounded-lg px-3 py-2.5 border border-green-100">
                <span className="text-green-600 font-bold text-sm w-5">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-xs truncate">{t.theme.recommendation.title}</div>
                  <div className="text-xs text-gray-500">{t.theme.recommendation.format}</div>
                </div>
                <span className="text-xs font-bold text-green-700">{t.priorityScore.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 text-center">
        Note: This is a school project demo. In production, this export would feed directly into OHRA&apos;s content management system via API.
      </div>
    </div>
  )
}
