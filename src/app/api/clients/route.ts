import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const clients = await db.client.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)

    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('database')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 } // Service Unavailable
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch clients. Please try again.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, logo } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      )
    }

    const client = await db.client.create({
      data: {
        name,
        description,
        logo
      }
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)

    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('database')) {
      return NextResponse.json(
        { error: 'Database connection failed. Could not create client.' },
        { status: 503 } // Service Unavailable
      )
    }

    return NextResponse.json(
      { error: 'Failed to create client. Please try again.' },
      { status: 502 } // Bad Gateway
    )
  }
}
