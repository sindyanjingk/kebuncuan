import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BiteshipAPI } from '@/lib/biteship'
import { OrderStatus } from '@prisma/client'

export async function POST(
  request: Request,
  { params }: { params: { store: string, orderId: string } }
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
      },
      include: {
        shippingProvider: true
      }
    })

    if (!store || !store.shippingProvider || !store.shippingProvider.is_active) {
      return NextResponse.json({ error: 'Shipping not configured' }, { status: 400 })
    }

    // Get order with product info
    const order = await prisma.order.findFirst({
      where: {
        id: params.orderId,
        product: {
          storeId: store.id
        }
      },
      include: {
        product: true,
        user: true,
        payment: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.payment?.status !== 'PAID') {
      return NextResponse.json({ error: 'Order must be paid first' }, { status: 400 })
    }

    if (!order.shipping_required) {
      return NextResponse.json({ error: 'Order does not require shipping' }, { status: 400 })
    }

    // Check if shipment already exists
    const existingShipment = await prisma.shipment.findUnique({
      where: { orderId: order.id }
    })

    if (existingShipment) {
      return NextResponse.json({ error: 'Shipment already created' }, { status: 400 })
    }

    // Use centralized API key
    const apiKey = process.env.BITESHIP_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Platform shipping not configured' }, { status: 500 })
    }

    const biteshipAPI = new BiteshipAPI(apiKey)

    // Prepare order data for Biteship
    const orderData = {
      shipper_contact_name: store.name,
      shipper_contact_phone: store.phone || '08123456789',
      shipper_contact_email: session.user.email,
      shipper_organization: store.name,
      shipper_address: store.address || 'Store Address',
      shipper_postal_code: store.postalCode || '12345',
      shipper_area_id: store.shippingProvider.origin_area_id || '',

      receiver_contact_name: order.shipping_name || order.user.username || 'Customer',
      receiver_contact_phone: order.shipping_phone || '08123456789',
      receiver_contact_email: order.user.email,
      receiver_address: order.shipping_address || 'Customer Address',
      receiver_postal_code: order.shipping_postal_code || '12345',
      receiver_area_id: '', // Need to be set based on address

      courier_company: order.shipping_courier || 'jne',
      courier_type: order.shipping_service || 'reg',
      delivery_type: 'pickup',
      order_note: `Order ${order.id} - ${order.product.name}`,

      items: [
        {
          name: order.product.name,
          description: order.product.description || 'Product',
          value: order.product.price,
          weight: 1000, // Default 1kg, should be from product
          quantity: 1
        }
      ]
    }

    // Create Biteship order
    const biteshipOrder = await biteshipAPI.createOrder(orderData)

    // Create local shipment record
    const shipment = await prisma.shipment.create({
      data: {
        orderId: order.id,
        providerId: store.shippingProvider.id,
        biteship_order_id: biteshipOrder.id,
        waybill: biteshipOrder.waybill_id,
        status: 'CONFIRMED',
        courier_company: order.shipping_courier,
        courier_type: order.shipping_service,
        recipient_name: order.shipping_name || 'Customer',
        recipient_phone: order.shipping_phone || '08123456789',
        recipient_address: order.shipping_address || 'Customer Address',
        recipient_postal_code: order.shipping_postal_code || '12345',
        weight: 1000,
        price: order.shipping_cost || 0
      }
    })

    // Update order status to SHIPPED
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.SHIPPED // Order is now shipped
      }
    })

    return NextResponse.json({ 
      shipment,
      biteship_order: biteshipOrder 
    })
  } catch (error) {
    console.error('[CREATE_SHIPMENT]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
