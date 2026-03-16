'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import TournamentCard from './TournamentCard'
import { Tournament } from '@/lib/startgg'

const TournamentMap = dynamic(() => import('./TournamentMap'), { ssr: false })

const ORLANDO = { lat: 28.5384, lng: -81.3789 }
const RADIUS = 50

function Spinner() {
  return (
    <div className="inline-block w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
  )
}

async function searchTournaments(): Promise<Tournament[]> {
  const res = await fetch('/api/tournaments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat: ORLANDO.lat, lng: ORLANDO.lng, radius: RADIUS }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Search failed')
  return data.tournaments
}

export default function TournamentFinder() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    searchTournaments()
      .then(setTournaments)
      .catch((e) => setError(e instanceof Error ? e.message : 'Search failed'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Upcoming Tournaments</h1>
        <p className="text-gray-500 text-sm">SSBM events within 50 miles of Orlando, FL</p>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center py-20 gap-3 text-gray-400">
          <Spinner />
          <p className="text-sm">Loading tournaments…</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-400 mb-5">
            {tournaments.length === 0
              ? 'No tournaments found'
              : `${tournaments.length} tournament${tournaments.length !== 1 ? 's' : ''} found`}
          </p>

          {tournaments.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-4 select-none">🎮</p>
              <p className="text-sm">No upcoming Melee tournaments in the Orlando area</p>
            </div>
          )}

          {tournaments.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="w-full lg:w-1/2 lg:sticky lg:top-6 h-[400px] lg:h-[600px] rounded-lg overflow-hidden border border-gray-200 shrink-0">
                <TournamentMap tournaments={tournaments} center={ORLANDO} />
              </div>
              <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tournaments.map((t) => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
