'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Tournament, formatDate } from '@/lib/startgg'

interface Props {
  tournaments: Tournament[]
  center: { lat: number; lng: number }
}

const POPUP_STYLES = `
  .leaflet-popup-content-wrapper {
    background: #0d1221 !important;
    border: 1px solid #1e2a45 !important;
    color: white !important;
    border-radius: 8px !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5) !important;
  }
  .leaflet-popup-tip {
    background: #0d1221 !important;
  }
  .leaflet-popup-close-button {
    color: #6b7280 !important;
    font-size: 18px !important;
    top: 8px !important;
    right: 10px !important;
  }
  .leaflet-popup-close-button:hover {
    color: #e5e7eb !important;
  }
  .leaflet-popup-content {
    margin: 14px 18px !important;
  }
  .leaflet-container {
    background: #070d1a !important;
  }
`

export default function TournamentMap({ tournaments, center }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, { zoomControl: true }).setView(
      [center.lat, center.lng],
      10,
    )
    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const styleEl = document.createElement('style')
    styleEl.textContent = POPUP_STYLES
    document.head.appendChild(styleEl)
    styleRef.current = styleEl

    return () => {
      map.remove()
      mapRef.current = null
      if (styleRef.current) {
        document.head.removeChild(styleRef.current)
        styleRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update markers and pan when data changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Remove all circle markers
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        map.removeLayer(layer)
      }
    })

    map.setView([center.lat, center.lng], 10, { animate: true })

    tournaments.forEach((t) => {
      if (t.lat == null || t.lng == null) return

      const loc = [t.city, t.addrState].filter(Boolean).join(', ')

      const marker = L.circleMarker([t.lat, t.lng], {
        radius: 7,
        fillColor: '#3b82f6',
        color: '#93c5fd',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      })

      marker.bindPopup(
        `<div style="min-width:170px;max-width:220px">
          <a
            href="https://start.gg/${t.slug}"
            target="_blank"
            rel="noopener noreferrer"
            style="font-weight:600;font-size:13px;color:#3b82f6;text-decoration:none;display:block;margin-bottom:5px;line-height:1.4"
          >${t.name}</a>
          ${loc ? `<div style="font-size:12px;color:#9ca3af;margin-bottom:3px">${loc}</div>` : ''}
          <div style="font-size:12px;color:#9ca3af;margin-bottom:3px">${formatDate(t.startAt)}</div>
          ${t.numAttendees ? `<div style="font-size:12px;color:#60a5fa">${t.numAttendees} entrants</div>` : ''}
        </div>`,
      )

      marker.addTo(map)
    })
  }, [tournaments, center])

  return <div ref={containerRef} className="w-full h-full" />
}
