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
      className="flex flex-col bg-[#0d1221] border border-[#1e2a45] rounded-lg overflow-hidden hover:border-blue-500 transition-colors duration-150"
    >
      {banner ? (
        <div className="w-full h-28 overflow-hidden bg-[#0d1221] shrink-0">
          <img
            src={banner}
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-28 bg-[#111827] shrink-0 flex items-center justify-center">
          <span className="text-3xl select-none">🎮</span>
        </div>
      )}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">
          {tournament.name}
        </h3>
        {location && (
          <p className="text-gray-400 text-xs">{location}</p>
        )}
        <p className="text-gray-400 text-xs">{formatDate(tournament.startAt)}</p>
        {tournament.numAttendees != null && tournament.numAttendees > 0 && (
          <p className="text-blue-400 text-xs mt-auto pt-1">
            {tournament.numAttendees} entrant{tournament.numAttendees !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </a>
  )
}
