import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Nav from '@/components/Nav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CFL Melee',
  description: 'Central Florida Super Smash Bros. Melee — tournaments, rankings, streams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen antialiased`}
        style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}
      >
        <Nav />
        {children}
      </body>
    </html>
  )
}
