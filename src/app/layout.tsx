import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import Nav from '@/components/Nav'
import './globals.css'

const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'] })

export const metadata: Metadata = {
  title: 'CFL Melee',
  description: 'Central Florida Super Smash Bros. Melee — tournaments, rankings, streams',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} min-h-screen antialiased`}
        style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }}
      >
        <Nav />
        {children}
      </body>
    </html>
  )
}
