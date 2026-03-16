'use client'

import { useEffect, useState } from 'react'

const CHANNELS = ['spiralmedia', 'hungrybox']

export default function StreamsSection() {
  const [hostname, setHostname] = useState('')

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="mb-6 pt-2">
        <h2 className="text-2xl font-bold tracking-tight mb-1">Streams</h2>
        <p className="text-gray-500 text-sm">Live and recent broadcasts</p>
      </div>

      {hostname && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CHANNELS.map((channel) => (
            <div key={channel} className="rounded-lg overflow-hidden border border-gray-200">
              <div className="aspect-video">
                <iframe
                  src={`https://player.twitch.tv/?channel=${channel}&parent=${hostname}&autoplay=false`}
                  width="100%"
                  height="100%"
                  allowFullScreen
                />
              </div>
              <div className="px-4 py-3 bg-white border-t border-gray-200">
                <a
                  href={`https://twitch.tv/${channel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors"
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
