import type { Metadata } from 'next'
import './globals.css'
import { ShellLayout } from '@/components/layout/ShellLayout'

export const metadata: Metadata = {
  title: 'OHRA GEO OS',
  description: 'OHRA GEO Operating System — Dutch Car Insurance AI Visibility',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <ShellLayout>{children}</ShellLayout>
      </body>
    </html>
  )
}
