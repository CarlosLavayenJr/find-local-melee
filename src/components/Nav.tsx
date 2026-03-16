import Link from 'next/link'

export default function Nav() {
  return (
    <nav style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center gap-8">
        <Link
          href="/"
          className="font-bold text-sm tracking-tight"
          style={{ color: 'var(--accent)' }}
        >
          CFL Melee
        </Link>
        <div className="flex gap-6 text-sm">
          <Link
            href="/"
            className="transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Tournaments
          </Link>
          <Link
            href="/rankings"
            className="transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Power Rankings
          </Link>
        </div>
      </div>
    </nav>
  )
}
