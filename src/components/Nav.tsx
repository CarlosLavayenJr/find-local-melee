import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-6">
        <Link href="/" className="font-bold text-sm text-gray-900 tracking-tight">
          CFL Melee
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
            Tournaments
          </Link>
          <Link href="/rankings" className="text-gray-500 hover:text-gray-900 transition-colors">
            Power Rankings
          </Link>
        </div>
      </div>
    </nav>
  )
}
