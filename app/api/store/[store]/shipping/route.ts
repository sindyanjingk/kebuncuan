import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { store: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    return NextResponse.json({
      shippingProvider: store.shippingProvider
    })
  } catch (error) {
    console.error('[SHIPPING_GET]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

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
    const { origin_area_id } = body

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

    // Check if platform API key is configured
    if (!process.env.BITESHIP_API_KEY) {
      return NextResponse.json({ error: 'Platform shipping not configured' }, { status: 500 })
    }

    // Create or update shipping provider
    const shippingProvider = await prisma.shippingProvider.upsert({
      where: { storeId: store.id },
      update: {
        origin_area_id,
        is_active: true
      },
      create: {
        storeId: store.id,
        origin_area_id,
        is_active: true
      }
    })

    return NextResponse.json({ shippingProvider })
  } catch (error) {
    console.error('[SHIPPING_POST]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { store: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { is_active, origin_area_id } = body

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

    // Update shipping provider
    const shippingProvider = await prisma.shippingProvider.update({
      where: { storeId: store.id },
      data: {
        is_active: is_active !== undefined ? is_active : undefined,
        origin_area_id: origin_area_id || undefined
      }
    })

    return NextResponse.json({ shippingProvider })
  } catch (error) {
    console.error('[SHIPPING_PUT]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
