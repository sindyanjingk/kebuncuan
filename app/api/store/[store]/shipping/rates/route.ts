import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BiteshipAPI } from '@/lib/biteship'

export async function POST(
  request: Request,
  { params }: { params: { store: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { destination_area_id, items, weight } = body

    if (!destination_area_id || !weight) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Get store's shipping provider
    const store = await prisma.store.findFirst({
      where: {
        slug: params.store,
        deletedAt: null,
        owner: { email: session.user.email }
      },
      include: {
        shippingProvider: true
      }
    })

    if (!store || !store.shippingProvider || !store.shippingProvider.origin_area_id) {
      return NextResponse.json({ error: 'Shipping not configured. Please set origin area first.' }, { status: 400 })
    }

    // Use centralized API key
    const apiKey = process.env.BITESHIP_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Platform shipping not configured' }, { status: 500 })
    }

    const biteshipAPI = new BiteshipAPI(apiKey)
    
    // Default items if not provided
    const shippingItems = items || [
      {
        name: 'Product',
        description: 'Store product',
        value: 100000, // Default value in cents
        weight: weight,
        quantity: 1
      }
    ]

    const rates = await biteshipAPI.getRates(
      store.shippingProvider.origin_area_id,
      destination_area_id,
      shippingItems
    )

    return NextResponse.json(rates)
  } catch (error) {
    console.error('[RATES_POST]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
