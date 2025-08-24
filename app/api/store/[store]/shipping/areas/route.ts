import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BiteshipAPI } from '@/lib/biteship'

export async function GET(
  request: Request,
  { params }: { params: { store: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const input = searchParams.get('input')

    if (!input) {
      return NextResponse.json({ error: 'Input parameter is required' }, { status: 400 })
    }

    // Verify store ownership
    const store = await prisma.store.findFirst({
      where: {
        slug: params.store,
        deletedAt: null,
        owner: { email: session.user.email }
      }
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Use centralized API key
    const apiKey = process.env.BITESHIP_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Platform shipping not configured' }, { status: 500 })
    }

    const biteshipAPI = new BiteshipAPI(apiKey)
    const areas = await biteshipAPI.searchAreas(input, 'ID')

    return NextResponse.json(areas)
  } catch (error) {
    console.error('[AREAS_GET]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
