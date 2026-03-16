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
    border-radius: 10px !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
  }
  .leaflet-popup-content {
    margin: 14px 18px !important;
  }
`

export default function TournamentMap({ tournaments, center }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, { zoomControl: true }).setView(
      [center.lat, center.lng],
      10,
    )
    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
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

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) map.removeLayer(layer)
    })

    map.setView([center.lat, center.lng], 10, { animate: true })

    tournaments.forEach((t) => {
      if (t.lat == null || t.lng == null) return

      const loc = [t.city, t.addrState].filter(Boolean).join(', ')

      L.circleMarker([t.lat, t.lng], {
        radius: 7,
        fillColor: '#208e2c',
        color: '#27a835',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      })
        .bindPopup(
          `<div style="min-width:170px;max-width:220px">
            <a
              href="https://start.gg/${t.slug}"
              target="_blank"
              rel="noopener noreferrer"
              style="font-weight:600;font-size:13px;color:#208e2c;text-decoration:none;display:block;margin-bottom:5px;line-height:1.4"
            >${t.name}</a>
            ${loc ? `<div style="font-size:12px;color:#6b7280;margin-bottom:3px">${loc}</div>` : ''}
            <div style="font-size:12px;color:#6b7280;margin-bottom:3px">${formatDate(t.startAt)}</div>
            ${t.numAttendees ? `<div style="font-size:12px;color:#208e2c">${t.numAttendees} entrants</div>` : ''}
          </div>`,
        )
        .addTo(map)
    })
  }, [tournaments, center])

  return <div ref={containerRef} className="w-full h-full" />
}
