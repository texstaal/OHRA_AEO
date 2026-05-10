'use client'
import { useRef } from 'react'
import { sampleDataToCSV } from '@/data/agent1SampleData'

interface Props {
  totalEntries: number
  dataSource: 'sample' | 'uploaded'
  onUpload: (csvText: string) => void
  onUseSampleData: () => void
}

export function CSVUploader({ totalEntries, dataSource, onUpload, onUseSampleData }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      if (text) onUpload(text)
    }
    reader.readAsText(file, 'UTF-8')
    e.target.value = ''
  }

  function downloadSampleCSV() {
    const csv = sampleDataToCSV()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ohra_sample_data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
            <span className="text-white text-lg">📥</span>
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">Data Source</div>
            <div className="text-xs text-gray-500">
              {dataSource === 'sample'
                ? `Analyzing ${totalEntries} entries from sample dataset`
                : `Analyzing ${totalEntries} entries from uploaded CSV`}
            </div>
          </div>
          <span className={`ml-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            dataSource === 'sample'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            {dataSource === 'sample' ? 'Sample Data' : 'Uploaded CSV'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onUseSampleData}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              dataSource === 'sample'
                ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f]'
            }`}
          >
            Use Sample Data
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="px-3 py-2 rounded-lg text-xs font-semibold border bg-white text-gray-600 border-gray-200 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors"
          >
            Upload CSV
          </button>
          <button
            onClick={downloadSampleCSV}
            className="px-3 py-2 rounded-lg text-xs font-semibold border bg-white text-gray-500 border-gray-200 hover:bg-gray-50 transition-colors"
          >
            ↓ Download Sample CSV
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5 flex items-center gap-2">
        <span className="text-amber-500">⚠️</span>
        <p className="text-xs text-amber-700">
          <strong>School project demo:</strong> This agent uses keyword-based clustering on fake Dutch data. No real AI, scraping, or APIs are used. All results are illustrative.
        </p>
      </div>
    </div>
  )
}
