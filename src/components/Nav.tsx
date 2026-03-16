'use client'

import Link from 'next/link'

export default function Nav() {
  return (
    <nav style={{ background: 'var(--accent)' }}>
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center gap-8">
        <Link href="/" className="font-bold text-sm tracking-tight text-black">
          CFL Melee
        </Link>
        <div className="flex gap-6 text-sm">
          <Link
            href="/"
            className="font-medium transition-opacity text-black opacity-70 hover:opacity-100"
          >
            Tournaments
          </Link>
          <Link
            href="/rankings"
            className="font-medium transition-opacity text-black opacity-70 hover:opacity-100"
          >
            Power Rankings
          </Link>
        </div>
      </div>
    </nav>
  )
}
