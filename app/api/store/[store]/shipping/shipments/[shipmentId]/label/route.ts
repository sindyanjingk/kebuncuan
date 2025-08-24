import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BiteshipAPI } from '@/lib/biteship'

export async function POST(
  request: Request,
  { params }: { params: { store: string, shipmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify store ownership and get shipment
    const shipment = await prisma.shipment.findFirst({
      where: {
        id: params.shipmentId,
        order: {
          product: {
            store: {
              slug: params.store,
              deletedAt: null,
              owner: { email: session.user.email }
            }
          }
        }
      },
      include: {
        order: {
          include: {
            product: {
              include: {
                store: true
              }
            },
            user: true
          }
        },
        provider: true
      }
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    if (!shipment.biteship_order_id) {
      return NextResponse.json({ error: 'Shipment not created in Biteship' }, { status: 400 })
    }

    // Use centralized API key
    const apiKey = process.env.BITESHIP_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Platform shipping not configured' }, { status: 500 })
    }

    const biteshipAPI = new BiteshipAPI(apiKey)

    // Get Biteship order details first
    const biteshipOrder = await biteshipAPI.getOrder(shipment.biteship_order_id)

    // Generate shipping label URL
    const labelUrl = `https://api.biteship.com/v1/orders/${shipment.biteship_order_id}/receipt`
    
    return NextResponse.json({ 
      shipment_id: shipment.id,
      biteship_order_id: shipment.biteship_order_id,
      waybill: shipment.waybill,
      label_url: labelUrl,
      courier_company: shipment.courier_company,
      courier_type: shipment.courier_type,
      recipient_name: shipment.recipient_name,
      recipient_address: shipment.recipient_address,
      status: shipment.status,
      order_details: {
        order_id: shipment.order.id,
        product_name: shipment.order.product.name,
        customer_email: shipment.order.user.email
      }
    })
  } catch (error) {
    console.error('[GENERATE_LABEL]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Get existing label
export async function GET(
  request: Request,
  { params }: { params: { store: string, shipmentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify store ownership and get shipment
    const shipment = await prisma.shipment.findFirst({
      where: {
        id: params.shipmentId,
        order: {
          product: {
            store: {
              slug: params.store,
              deletedAt: null,
              owner: { email: session.user.email }
            }
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
      }
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    if (!shipment.biteship_order_id) {
      return NextResponse.json({ error: 'Shipment not created in Biteship' }, { status: 400 })
    }

    // Generate shipping label URL
    const labelUrl = `https://api.biteship.com/v1/orders/${shipment.biteship_order_id}/receipt`
    
    return NextResponse.json({ 
      shipment_id: shipment.id,
      biteship_order_id: shipment.biteship_order_id,
      waybill: shipment.waybill,
      label_url: labelUrl,
      courier_company: shipment.courier_company,
      courier_type: shipment.courier_type,
      recipient_name: shipment.recipient_name,
      recipient_address: shipment.recipient_address,
      status: shipment.status
    })
  } catch (error) {
    console.error('[GET_LABEL]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
