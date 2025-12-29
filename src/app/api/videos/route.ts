import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const videos = await db.video.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, youtubeId, category, thumbnail } = body

    if (!title || !youtubeId || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, youtubeId, category' },
        { status: 400 }
      )
    }

    if (category !== 'long' && category !== 'short') {
      return NextResponse.json(
        { error: 'Invalid category. Must be "long" or "short"' },
        { status: 400 }
      )
    }

    const video = await db.video.create({
      data: {
        title,
        description,
        youtubeId,
        category,
        thumbnail
      }
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, youtubeId, category, thumbnail } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      )
    }

    if (!title || !youtubeId || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, youtubeId, category' },
        { status: 400 }
      )
    }

    if (category !== 'long' && category !== 'short') {
      return NextResponse.json(
        { error: 'Invalid category. Must be "long" or "short"' },
        { status: 400 }
      )
    }

    const video = await db.video.update({
      where: { id },
      data: {
        title,
        description,
        youtubeId,
        category,
        thumbnail
      }
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 })
  }
}
