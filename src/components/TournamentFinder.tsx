'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import TournamentCard from './TournamentCard'
import { geocode, fetchTournaments, Tournament } from '@/lib/startgg'

const TournamentMap = dynamic(() => import('./TournamentMap'), { ssr: false })

const RADII = [25, 50, 100, 200] as const

function LocateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  )
}

function Spinner() {
  return (
    <div className="inline-block w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  )
}

export default function TournamentFinder() {
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState<number>(50)
  const [apiKey, setApiKey] = useState('')
  const [view, setView] = useState<'list' | 'map'>('list')
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)
  const [searchCoords, setSearchCoords] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('melee_startgg_key')
    if (stored) setApiKey(stored)
  }, [])

  const saveApiKey = (val: string) => {
    setApiKey(val)
    localStorage.setItem('melee_startgg_key', val)
  }

  const runSearch = async (lat: number, lng: number) => {
    if (!apiKey.trim()) {
      setError('Enter your start.gg API key above before searching')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const results = await fetchTournaments(lat, lng, radius, apiKey.trim())
      setTournaments(results)
      setSearchCoords({ lat, lng })
      setSearched(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!location.trim()) {
      setError('Enter a city, state, or zip code')
      return
    }
    if (!apiKey.trim()) {
      setError('Enter your start.gg API key above before searching')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const coords = await geocode(location.trim())
      await runSearch(coords.lat, coords.lng)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Search failed')
      setLoading(false)
    }
  }

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }
    setError(null)
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        await runSearch(latitude, longitude)
      },
      (err) => {
        setError(`Geolocation failed: ${err.message}`)
        setLoading(false)
      },
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="min-h-screen bg-[#070d1a] text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Find Local Melee</h1>
          <p className="text-gray-500 text-sm">Upcoming SSBM tournaments near you, powered by start.gg</p>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-8">
          {/* API Key */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
              start.gg API Key
              <span className="text-gray-600 font-normal ml-1">
                — get one at{' '}
                <a
                  href="https://start.gg/admin/profile/developer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  start.gg/admin/profile/developer
                </a>
              </span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => saveApiKey(e.target.value)}
              placeholder="Paste your token here"
              className="w-full max-w-sm bg-[#0d1221] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Location + radius + search */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Location input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="City, state, or zip"
                className="w-full bg-[#0d1221] border border-[#1e2a45] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors pr-9"
              />
              <button
                onClick={handleGeolocate}
                title="Use my location"
                disabled={loading}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400 disabled:opacity-40 transition-colors"
              >
                <LocateIcon />
              </button>
            </div>

            {/* Radius pills */}
            <div className="flex gap-1.5">
              {RADII.map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-colors ${
                    radius === r
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-[#1e2a45] text-gray-400 hover:border-blue-500 hover:text-white'
                  }`}
                >
                  {r}mi
                </button>
              ))}
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-900 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shrink-0"
            >
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>
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
            <p className="text-sm">Searching tournaments…</p>
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <>
            {/* Results header */}
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
                      view === 'list'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setView('map')}
                    className={`px-3 py-1.5 transition-colors ${
                      view === 'map'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Map
                  </button>
                </div>
              )}
            </div>

            {/* Empty state */}
            {tournaments.length === 0 && (
              <div className="text-center py-20 text-gray-600">
                <p className="text-4xl mb-4 select-none">🎮</p>
                <p className="text-sm font-medium text-gray-500">No upcoming Melee tournaments in this area</p>
                <p className="text-xs mt-1">Try a wider radius or a different location</p>
              </div>
            )}

            {/* List view */}
            {tournaments.length > 0 && view === 'list' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tournaments.map((t) => (
                  <TournamentCard key={t.id} tournament={t} />
                ))}
              </div>
            )}

            {/* Map view */}
            {tournaments.length > 0 && view === 'map' && searchCoords && (
              <div className="h-[560px] rounded-lg overflow-hidden border border-[#1e2a45]">
                <TournamentMap tournaments={tournaments} center={searchCoords} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
