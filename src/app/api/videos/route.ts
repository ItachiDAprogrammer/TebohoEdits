import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'

export async function GET() {
  try {
    const videos = await client.fetch(`
      *[_type == "video"] | order(_createdAt desc) {
        "id": _id,
        title,
        description,
        youtubeId,
        category,
        "thumbnail": thumbnail.asset->url
      }
    `)

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Sanity video fetch failed:', error)
    return NextResponse.json([], { status: 500 })
  }
}
