import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BiteshipAPI, convertBiteshipStatus } from '@/lib/biteship'

export async function GET(
  request: Request,
  { params }: { params: { store: string, waybill: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courier = searchParams.get('courier')

    if (!courier) {
      return NextResponse.json({ error: 'Courier parameter is required' }, { status: 400 })
    }

    // Get store's shipping provider
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
    const tracking = await biteshipAPI.trackShipment(params.waybill, courier)

    // Update local shipment record if exists
    const shipment = await prisma.shipment.findFirst({
      where: { waybill: params.waybill }
    })

    if (shipment) {
      await prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          status: convertBiteshipStatus(tracking.status) as any,
          tracking_events: tracking.history as any,
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json(tracking)
  } catch (error) {
    console.error('[TRACKING_GET]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Public tracking endpoint (no auth required)
export async function POST(
  request: Request,
  { params }: { params: { store: string, waybill: string } }
) {
  try {
    const body = await request.json()
    const { courier } = body

    if (!courier) {
      return NextResponse.json({ error: 'Courier is required' }, { status: 400 })
    }

    // Get store and shipment
    const store = await prisma.store.findFirst({
      where: {
        slug: params.store,
        deletedAt: null
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
    const tracking = await biteshipAPI.trackShipment(params.waybill, courier)

    return NextResponse.json({
      waybill: params.waybill,
      courier: courier,
      status: tracking.status,
      history: tracking.history,
      link: tracking.link
    })
  } catch (error) {
    console.error('[PUBLIC_TRACKING_POST]', error)
    return NextResponse.json({ error: 'Tracking not found' }, { status: 404 })
  }
}
