export interface Tournament {
  id: string
  name: string
  slug: string
  city: string | null
  addrState: string | null
  lat: number | null
  lng: number | null
  startAt: number
  numAttendees: number | null
  images: Array<{ url: string; type: string; ratio: number }>
}

const TOURNAMENTS_QUERY = `
  query TournamentsByLocation(
    $coordinates: String!
    $radius: String!
    $afterDate: Timestamp!
    $videogameIds: [ID]
  ) {
    tournaments(query: {
      perPage: 50
      filter: {
        location: { distanceFrom: $coordinates, distance: $radius }
        afterDate: $afterDate
        videogameIds: $videogameIds
      }
    }) {
      nodes {
        id
        name
        slug
        city
        addrState
        lat
        lng
        startAt
        numAttendees
        images { url type ratio }
      }
    }
  }
`

export async function fetchTournaments(
  lat: number,
  lng: number,
  radiusMiles: number,
  apiKey: string,
): Promise<Tournament[]> {
  const afterDate = Math.floor(Date.now() / 1000)

  const res = await fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: TOURNAMENTS_QUERY,
      variables: {
        coordinates: `${lat},${lng}`,
        radius: `${radiusMiles}mi`,
        afterDate,
        videogameIds: [1],
      },
    }),
  })

  if (!res.ok) {
    throw new Error(`start.gg API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()

  if (data.errors?.length) {
    const msg = data.errors[0]?.message ?? 'start.gg API error'
    if (msg.toLowerCase().includes('unauthorized') || msg.toLowerCase().includes('invalid token')) {
      throw new Error('Invalid API key — check your start.gg token')
    }
    throw new Error(msg)
  }

  return data.data?.tournaments?.nodes ?? []
}

export async function geocode(location: string): Promise<{ lat: number; lng: number }> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'FindLocalMelee/1.0 (tournament-finder)' },
  })

  if (!res.ok) {
    throw new Error('Geocoding request failed')
  }

  const data = await res.json()

  if (!data.length) {
    throw new Error(`Location not found: "${location}"`)
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  }
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getBannerImage(images: Tournament['images']): string | null {
  if (!images?.length) return null
  const banner = images.find((img) => img.type === 'banner')
  if (banner) return banner.url
  const wide = images.find((img) => img.ratio && img.ratio >= 1.5)
  if (wide) return wide.url
  return images[0]?.url ?? null
}
