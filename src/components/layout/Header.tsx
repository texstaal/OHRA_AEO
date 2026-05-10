'use client'
import { usePathname } from 'next/navigation'

const pageLabels: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Overview Dashboard', subtitle: 'OHRA GEO Operating System — Dutch Car Insurance AI Visibility' },
  '/agents/trend-discovery':  { title: 'Agent 1 — Trend Discovery',  subtitle: 'Dutch car insurance trends, CEPs, and competitor gaps' },
  '/agents/content-briefs':   { title: 'Agent 2 — Content Briefs',   subtitle: 'Structured AI-optimized content briefs from approved opportunities' },
  '/agents/draft-writing':    { title: 'Agent 3 — Draft Writing',    subtitle: 'Answer-first first-draft content from approved briefs' },
  '/agents/compliance':       { title: 'Agent 4 — Compliance',       subtitle: 'Compliance, factual risk, and brand safety checks' },
  '/agents/technical-geo':    { title: 'Agent 5 — Technical GEO',    subtitle: 'Schema, metadata, FAQ structure, and machine readability' },
  '/agents/earned-media':     { title: 'Agent 6 — Earned Media',     subtitle: 'Third-party mentions, share of voice, and visibility gaps' },
  '/agents/freshness':        { title: 'Agent 7 — Freshness',        subtitle: 'Outdated page detection and update recommendations' },
  '/agents/aeo-tracking':     { title: 'Agent 8 — GEO Tracking',     subtitle: 'Weekly GEO score tracking across AI platforms' },
  '/ready-to-publish':        { title: 'Ready to Publish',            subtitle: 'Articles approved through the full GEO pipeline' },
}

interface Props {
  open: boolean
  onToggle: () => void
}

export function Header({ open, onToggle }: Props) {
  const pathname = usePathname()
  const page = pageLabels[pathname] ?? { title: 'OHRA GEO OS', subtitle: '' }

  return (
    <header className={`h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 fixed top-0 right-0 z-30 transition-all duration-300 ease-in-out ${open ? 'left-60' : 'left-0'}`}>
      <div className="flex items-center gap-3">
        {/* Hamburger toggle */}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect y="2"  width="18" height="2" rx="1" fill="currentColor"/>
            <rect y="8"  width="18" height="2" rx="1" fill="currentColor"/>
            <rect y="14" width="18" height="2" rx="1" fill="currentColor"/>
          </svg>
        </button>

        <div>
          <h1 className="font-bold text-gray-900 text-base leading-tight">{page.title}</h1>
          {page.subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{page.subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-700">System Active</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center">
          <span className="text-white text-xs font-bold">GEO</span>
        </div>
      </div>
    </header>
  )
}
