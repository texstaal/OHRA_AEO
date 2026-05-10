'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const agentLinks = [
  { href: '/agents/trend-discovery',  label: 'Trend Discovery',  num: '01', dot: 'bg-[#1e3a5f]' },
  { href: '/agents/content-briefs',   label: 'Content Briefs',   num: '02', dot: 'bg-blue-700' },
  { href: '/agents/draft-writing',    label: 'Draft Writing',    num: '03', dot: 'bg-blue-600' },
  { href: '/agents/compliance',       label: 'Compliance',       num: '04', dot: 'bg-orange-500' },
  { href: '/agents/technical-geo',    label: 'Technical GEO',    num: '05', dot: 'bg-violet-600' },
  { href: '/agents/earned-media',     label: 'Earned Media',     num: '06', dot: 'bg-green-600' },
  { href: '/agents/freshness',        label: 'Freshness',        num: '07', dot: 'bg-purple-700' },
  { href: '/agents/aeo-tracking',     label: 'AEO Tracking',     num: '08', dot: 'bg-sky-700' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-[#0f1e33] flex flex-col fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-white text-sm font-bold">O</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">OHRA GEO OS</div>
            <div className="text-white/40 text-xs">Operating System</div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <Link
          href="/"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-4 transition-colors ${
            pathname === '/'
              ? 'bg-white/10 text-white font-semibold'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="text-base">🏠</span>
          Overview Dashboard
        </Link>

        <div className="text-white/30 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
          AI Agents
        </div>

        <div className="space-y-0.5">
          {agentLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${link.dot}`} />
                <span className="text-white/30 text-xs w-5 flex-shrink-0">{link.num}</span>
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="text-white/30 text-xs">
          Dutch Car Insurance GEO
        </div>
        <div className="text-white/20 text-xs mt-0.5">v0.1 · Foundation</div>
      </div>
    </aside>
  )
}
