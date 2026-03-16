import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="border-b border-[#1e2a45] bg-[#070d1a]">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-6">
        <Link href="/" className="font-bold font-display text-lg text-white tracking-tight">
          CFL Melee
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Tournaments
          </Link>
          <Link href="/rankings" className="text-gray-400 hover:text-white transition-colors">
            Power Rankings
          </Link>
        </div>
      </div>
    </nav>
  )
}
