import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'OHRA GEO OS',
  description: 'OHRA GEO Operating System — Dutch Car Insurance AI Visibility',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <Sidebar />
        <div className="ml-60">
          <Header />
          <main className="pt-16 min-h-screen">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
