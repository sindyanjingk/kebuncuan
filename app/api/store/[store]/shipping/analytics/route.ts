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

    // Get shipments with order data
    const shipments = await prisma.shipment.findMany({
      where: {
        order: {
          product: {
            storeId: store.id
          }
        }
      },
      include: {
        order: {
          include: {
            product: true,
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate statistics
    const totalShipments = shipments.length
    const pendingShipments = shipments.filter(s => 
      ['PENDING', 'CONFIRMED', 'ALLOCATED'].includes(s.status)
    ).length
    const inTransitShipments = shipments.filter(s => 
      ['PICKING_UP', 'PICKED_UP', 'DROPPING_OFF'].includes(s.status)
    ).length
    const deliveredShipments = shipments.filter(s => s.status === 'DELIVERED').length

    // Calculate revenue
    const totalRevenue = shipments.reduce((sum, shipment) => sum + (shipment.price || 0), 0)
    const averageShippingCost = totalShipments > 0 ? totalRevenue / totalShipments : 0

    // Get popular couriers
    const courierCounts = shipments.reduce((acc, shipment) => {
      const courier = shipment.courier_company || 'unknown'
      acc[courier] = (acc[courier] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const popularCouriers = Object.entries(courierCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Get recent shipments
    const recentShipments = shipments.slice(0, 10).map(shipment => ({
      id: shipment.id,
      waybill: shipment.waybill || 'N/A',
      courier_company: shipment.courier_company || 'unknown',
      status: shipment.status,
      recipient_name: shipment.recipient_name || 'Customer',
      createdAt: shipment.createdAt.toISOString(),
      price: shipment.price || 0
    }))

    const analytics = {
      totalShipments,
      pendingShipments,
      inTransitShipments,
      deliveredShipments,
      totalRevenue,
      averageShippingCost: Math.round(averageShippingCost),
      popularCouriers,
      recentShipments
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('[SHIPPING_ANALYTICS]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
