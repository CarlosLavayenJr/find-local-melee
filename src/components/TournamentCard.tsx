import { Tournament, formatDate, getBannerImage } from '@/lib/startgg'

interface Props {
  tournament: Tournament
}

export default function TournamentCard({ tournament }: Props) {
  const banner = getBannerImage(tournament.images)
  const location = [tournament.city, tournament.addrState].filter(Boolean).join(', ')

  return (
    <a
      href={`https://start.gg/${tournament.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col rounded-xl overflow-hidden transition-colors duration-150 group"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#00E56A')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {banner ? (
        <div className="w-full h-28 overflow-hidden shrink-0" style={{ background: '#0F0F0F' }}>
          <img src={banner} alt={tournament.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full h-28 shrink-0 flex items-center justify-center" style={{ background: '#0F0F0F' }}>
          <span className="text-3xl select-none">🎮</span>
        </div>
      )}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
          {tournament.name}
        </h3>
        {location && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{location}</p>
        )}
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(tournament.startAt)}</p>
        {tournament.numAttendees != null && tournament.numAttendees > 0 && (
          <p className="text-xs font-semibold mt-auto pt-1" style={{ color: 'var(--accent)' }}>
            {tournament.numAttendees} entrant{tournament.numAttendees !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </a>
  )
}
