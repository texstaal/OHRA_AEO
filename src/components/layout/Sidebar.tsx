'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const layer1 = [
  { href: '/agents/trend-discovery', label: 'Trend Discovery', num: '01', dot: 'bg-[#1e3a5f]' },
  { href: '/agents/content-briefs',  label: 'Content Briefs',  num: '02', dot: 'bg-blue-700' },
  { href: '/agents/draft-writing',   label: 'Draft Writing',   num: '03', dot: 'bg-blue-600' },
  { href: '/agents/compliance',      label: 'Compliance',      num: '04', dot: 'bg-orange-500' },
  { href: '/agents/technical-geo',   label: 'Technical GEO',   num: '05', dot: 'bg-violet-600' },
]

const layer2 = [
  { href: '/agents/earned-media', label: 'Earned Media',  num: '06', dot: 'bg-green-600' },
  { href: '/agents/freshness',    label: 'Freshness',     num: '07', dot: 'bg-purple-700' },
  { href: '/agents/aeo-tracking', label: 'GEO Tracking',  num: '08', dot: 'bg-sky-700' },
]

function NavLink({ href, label, num, dot, pathname }: { href: string; label: string; num: string; dot: string; pathname: string }) {
  const active = pathname === href
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
        active ? 'bg-white/10 text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
      <span className="text-white/30 text-xs w-5 flex-shrink-0">{num}</span>
      {label}
    </Link>
  )
}

function LayerLabel({ children }: { children: string }) {
  return (
    <div className="px-3 mb-1.5 flex items-center gap-2">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-white/25 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{children}</span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-[#0f1e33] flex flex-col fixed left-0 top-0 z-40">
      {/* OHRA Logo */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1.5">
          {/* Concentric-ring O */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
            <circle cx="16" cy="16" r="14" stroke="white" strokeWidth="4.5"/>
            <circle cx="16" cy="16" r="7.5" stroke="white" strokeWidth="3.5"/>
            <circle cx="16" cy="16" r="3" fill="white"/>
          </svg>
          {/* HRA text */}
          <span
            className="text-white leading-none tracking-wide"
            style={{ fontSize: 26, fontWeight: 900, fontFamily: "'Arial Black', 'Arial Bold', Arial, sans-serif" }}
          >
            HRA
          </span>
        </div>
        {/* Red underline */}
        <div className="h-[4px] bg-[#E8363A] rounded-sm mb-2" />
        <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest">GEO Operating System</div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {/* Overview */}
        <Link
          href="/"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname === '/' ? 'bg-white/10 text-white font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="text-base">🏠</span>
          Overview Dashboard
        </Link>

        {/* Layer 1 — Content Factory */}
        <div>
          <LayerLabel>Layer 1 — Content Factory</LayerLabel>
          <div className="space-y-0.5">
            {layer1.map(link => <NavLink key={link.href} {...link} pathname={pathname} />)}
          </div>
        </div>

        {/* Ready to Publish — standalone */}
        <div className="px-1">
          <Link
            href="/ready-to-publish"
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
              pathname === '/ready-to-publish'
                ? 'bg-green-600 text-white border-green-500 shadow-sm'
                : 'text-green-400 border-green-500/30 bg-green-500/10 hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/50'
            }`}
          >
            <span>✅</span>
            Ready to Publish
          </Link>
        </div>

        {/* Layer 2 — Intelligence */}
        <div>
          <LayerLabel>Layer 2 — Intelligence</LayerLabel>
          <div className="space-y-0.5">
            {layer2.map(link => <NavLink key={link.href} {...link} pathname={pathname} />)}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="text-white/30 text-xs">Dutch Car Insurance GEO</div>
        <div className="text-white/20 text-xs mt-0.5">v0.1 · Foundation</div>
      </div>
    </aside>
  )
}
