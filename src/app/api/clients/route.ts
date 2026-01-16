import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'

export async function GET() {
  try {
    const clients = await client.fetch(`
      *[_type == "client"] | order(_createdAt desc) {
        "id": _id,
        name,
        description,
        "logo": logo.asset->url
      }
    `)

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Sanity client fetch failed:', error)
    return NextResponse.json([], { status: 500 })
  }
}
