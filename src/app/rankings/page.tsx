export default function Rankings() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
        >
          Central Florida Power Rankings
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Orlando area SSBM player rankings via Braacket
        </p>
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{
          border: '1px solid var(--border)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        <iframe
          src="https://braacket.com/league/7680C6CE-DBD3-4C13-AF3F-9903EA6B1AA9/ranking"
          width="100%"
          height="1000"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  )
}
