import { NextRequest, NextResponse } from 'next/server'
import { fetchTournaments } from '@/lib/startgg'

export async function POST(req: NextRequest) {
  const apiKey = process.env.STARTGG_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'STARTGG_API_KEY is not configured' }, { status: 500 })
  }

  const { lat, lng, radius } = await req.json()

  if (lat == null || lng == null || !radius) {
    return NextResponse.json({ error: 'Missing lat, lng, or radius' }, { status: 400 })
  }

  try {
    const tournaments = await fetchTournaments(lat, lng, radius, apiKey)
    return NextResponse.json({ tournaments })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Search failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
