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
    <div className="inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
  const [view, setView] = useState<'list' | 'map'>('list')
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
    <div className="min-h-screen bg-[#070d1a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Find Local Melee</h1>
          <p className="text-gray-500 text-sm">
            Upcoming SSBM tournaments within 50 miles of Orlando, FL
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-950 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-3 text-gray-500">
            <Spinner />
            <p className="text-sm">Loading tournaments…</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-400">
                {tournaments.length === 0
                  ? 'No tournaments found'
                  : `${tournaments.length} tournament${tournaments.length !== 1 ? 's' : ''} found`}
              </p>

              {tournaments.length > 0 && (
                <div className="flex border border-[#1e2a45] rounded-lg overflow-hidden text-xs">
                  <button
                    onClick={() => setView('list')}
                    className={`px-3 py-1.5 transition-colors ${
                      view === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setView('map')}
                    className={`px-3 py-1.5 transition-colors ${
                      view === 'map' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Map
                  </button>
                </div>
              )}
            </div>

            {tournaments.length === 0 && (
              <div className="text-center py-20 text-gray-600">
                <p className="text-4xl mb-4 select-none">🎮</p>
                <p className="text-sm font-medium text-gray-500">
                  No upcoming Melee tournaments in the Orlando area
                </p>
              </div>
            )}

            {tournaments.length > 0 && view === 'list' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tournaments.map((t) => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            )}

            {tournaments.length > 0 && view === 'map' && (
              <div className="h-[560px] rounded-lg overflow-hidden border border-[#1e2a45]">
                <TournamentMap tournaments={tournaments} center={ORLANDO} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
