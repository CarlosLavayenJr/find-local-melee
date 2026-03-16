'use client'

import { useEffect, useState } from 'react'

const CHANNELS = ['spiralmedia', 'hungrybox']

export default function Streams() {
  const [hostname, setHostname] = useState('')

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display tracking-tight mb-1">Streams</h1>
        <p className="text-gray-500 text-sm">Live and recent broadcasts from Central Florida Melee</p>
      </div>

      {hostname && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CHANNELS.map((channel) => (
            <div key={channel} className="rounded-lg overflow-hidden border border-[#1e2a45]">
              <div className="aspect-video">
                <iframe
                  src={`https://player.twitch.tv/?channel=${channel}&parent=${hostname}&autoplay=false`}
                  width="100%"
                  height="100%"
                  allowFullScreen
                />
              </div>
              <div className="px-4 py-3 bg-[#0d1221]">
                <a
                  href={`https://twitch.tv/${channel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
                >
                  {channel}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
