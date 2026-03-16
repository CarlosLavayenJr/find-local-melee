export default function Rankings() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Central Florida Power Rankings</h1>
        <p className="text-gray-500 text-sm">Orlando area SSBM player rankings via Braacket</p>
      </div>
      <div className="rounded-lg overflow-hidden border border-[#1e2a45]">
        <iframe
          src="https://braacket.com/league/7680C6CE-DBD3-4C13-AF3F-9903EA6B1AA9/ranking"
          width="100%"
          height="700"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  )
}
