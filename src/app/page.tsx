import TournamentFinder from '@/components/TournamentFinder'

export default function Home() {
  return (
    <>
      <TournamentFinder />
      <div className="bg-[#070d1a] max-w-7xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold tracking-tight mb-4">Central Florida Power Rankings</h2>
        <div className="rounded-lg overflow-hidden border border-[#1e2a45]">
          <iframe
            src="https://braacket.com/league/7680C6CE-DBD3-4C13-AF3F-9903EA6B1AA9/ranking"
            width="100%"
            height="600"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>
    </>
  )
}
