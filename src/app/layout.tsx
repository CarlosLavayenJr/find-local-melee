import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import Nav from '@/components/Nav'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: 'Find Local Melee',
  description: 'Find upcoming Super Smash Bros. Melee tournaments near you',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body className="bg-[#070d1a] text-white min-h-screen antialiased">
        <Nav />
        {children}
      </body>
    </html>
  )
}
