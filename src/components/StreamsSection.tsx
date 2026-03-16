'use client'

import { useEffect, useState } from 'react'

const CHANNELS = ['spiralmedia', 'polaritygg']

export default function StreamsSection() {
  const [hostname, setHostname] = useState('')

  useEffect(() => {
    setHostname(window.location.hostname)
  }, [])

  return (
    <div className="max-w-[1200px] mx-auto px-6 pb-16">
      <div className="mb-6">
        <h2
          className="text-2xl font-bold mb-1"
          style={{ letterSpacing: '-0.02em', color: 'var(--text-primary)' }}
        >
          Streams
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Live and recent broadcasts
        </p>
      </div>

      {hostname && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CHANNELS.map((channel) => (
            <div
              key={channel}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
              }}
            >
              <div className="aspect-video">
                <iframe
                  src={`https://player.twitch.tv/?channel=${channel}&parent=${hostname}&autoplay=false`}
                  width="100%"
                  height="100%"
                  allowFullScreen
                />
              </div>
              <div className="px-4 py-3" style={{ borderTop: '1px solid var(--border)' }}>
                <a
                  href={`https://twitch.tv/${channel}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
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
