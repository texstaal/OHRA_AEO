'use client'
import { useState, useEffect, useMemo } from 'react'
import { sampleData } from '@/data/agent1SampleData'
import { themeConfigs } from '@/data/agent1Themes'
import { analyzeEntries, parseCSV } from '@/lib/agent1Analyzer'
import type { RawEntry, ReviewStatus } from '@/types/agent1'
import { CSVUploader } from '@/components/agent1/CSVUploader'
import { OverviewTab } from '@/components/agent1/OverviewTab'
import { TrendClustersTab } from '@/components/agent1/TrendClustersTab'
import { CompetitorGapsTab } from '@/components/agent1/CompetitorGapsTab'
import { ContentOpportunitiesTab } from '@/components/agent1/ContentOpportunitiesTab'
import { ExportTab } from '@/components/agent1/ExportTab'

const TABS = [
  { id: 'overview',      label: '📊 Overview' },
  { id: 'clusters',      label: '🏷️ Trend Clusters' },
  { id: 'gaps',          label: '🔍 Competitor Gaps' },
  { id: 'opportunities', label: '⚡ Content Opportunities' },
  { id: 'export',        label: '📁 Export' },
]

const LS_KEY = 'agent1_review_statuses'

export function TrendDiscoveryDashboard() {
  const [entries, setEntries]         = useState<RawEntry[]>(sampleData)
  const [dataSource, setDataSource]   = useState<'sample' | 'uploaded'>('sample')
  const [activeTab, setActiveTab]     = useState('overview')
  const [reviewStatuses, setReviewStatuses] = useState<Record<string, ReviewStatus>>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY)
      if (saved) setReviewStatuses(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  const analysis = useMemo(
    () => analyzeEntries(entries, themeConfigs),
    [entries]
  )

  function handleStatusChange(themeId: string, status: ReviewStatus) {
    const next = { ...reviewStatuses, [themeId]: status }
    setReviewStatuses(next)
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  function handleUpload(csvText: string) {
    const parsed = parseCSV(csvText)
    if (parsed.length > 0) {
      setEntries(parsed)
      setDataSource('uploaded')
    }
  }

  function handleUseSampleData() {
    setEntries(sampleData)
    setDataSource('sample')
  }

  return (
    <div className="max-w-[1200px]">
      {/* Page identity */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🔍</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Agent 1 — Trend & CEP Discovery</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Finds Dutch car insurance trends, customer questions, Category Entry Points, and competitor gaps.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-semibold">
            Layer 1 — The Factory
          </span>
          <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-xs font-semibold">
            Active
          </span>
        </div>
      </div>

      {/* CSV uploader */}
      <CSVUploader
        totalEntries={entries.length}
        dataSource={dataSource}
        onUpload={handleUpload}
        onUseSampleData={handleUseSampleData}
      />

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-[#1e3a5f] text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <OverviewTab analysis={analysis} dataSource={dataSource} />
      )}
      {activeTab === 'clusters' && (
        <TrendClustersTab themes={analysis.themes} />
      )}
      {activeTab === 'gaps' && (
        <CompetitorGapsTab themes={analysis.themes} />
      )}
      {activeTab === 'opportunities' && (
        <ContentOpportunitiesTab
          themes={analysis.themes}
          reviewStatuses={reviewStatuses}
          onStatusChange={handleStatusChange}
        />
      )}
      {activeTab === 'export' && (
        <ExportTab analysis={analysis} reviewStatuses={reviewStatuses} />
      )}
    </div>
  )
}
