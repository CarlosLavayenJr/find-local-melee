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
    <div
      className="inline-block w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
      style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
    />
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
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h1
          className="text-2xl font-bold mb-1"
          style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
        >
          Upcoming Tournaments
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          SSBM events within 50 miles of Orlando, FL
        </p>
      </div>

      {error && (
        <div
          className="mb-6 px-4 py-3 rounded-lg text-sm"
          style={{ background: '#1a0a0a', border: '1px solid #3a1a1a', color: '#f87171' }}
        >
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center py-20 gap-3">
          <Spinner />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading tournaments…</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            {tournaments.length === 0
              ? 'No tournaments found'
              : `${tournaments.length} tournament${tournaments.length !== 1 ? 's' : ''} found`}
          </p>

          {tournaments.length === 0 && (
            <div className="text-center py-20">
              <p className="text-4xl mb-4 select-none">🎮</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                No upcoming Melee tournaments in the Orlando area
              </p>
            </div>
          )}

          {tournaments.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div
                className="w-full lg:w-1/2 lg:sticky lg:top-6 h-[400px] lg:h-[600px] rounded-xl overflow-hidden shrink-0"
                style={{ border: '1px solid var(--border)' }}
              >
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
