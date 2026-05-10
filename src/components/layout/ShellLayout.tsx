'use client'
import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function ShellLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true)
  const toggle = () => setOpen(o => !o)

  return (
    <>
      <Sidebar open={open} onToggle={toggle} />
      <div className={`transition-all duration-300 ease-in-out ${open ? 'ml-60' : 'ml-0'}`}>
        <Header open={open} onToggle={toggle} />
        <main className="pt-16 min-h-screen">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </>
  )
}
