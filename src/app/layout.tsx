import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Find Local Melee',
  description: 'Find upcoming Super Smash Bros. Melee tournaments near you',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#070d1a] text-white min-h-screen antialiased">
        <Nav />
        {children}
      </body>
    </html>
  )
}
