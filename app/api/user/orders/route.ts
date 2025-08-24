import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user orders with related data
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: {
            store: {
              select: {
                name: true,
                slug: true
              }
            },
            category: {
              select: {
                name: true
              }
            }
          }
        },
        payment: true,
        shipment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      product: {
        id: order.product.id,
        name: order.product.name,
        price: order.product.price,
        store: order.product.store,
        category: order.product.category
      },
      payment: order.payment,
      shipping: {
        required: order.shipping_required,
        address: order.shipping_address,
        city: order.shipping_city,
        province: order.shipping_province,
        postal_code: order.shipping_postal_code,
        phone: order.shipping_phone,
        name: order.shipping_name,
        cost: order.shipping_cost,
        courier: order.shipping_courier,
        service: order.shipping_service,
      },
      shipment: order.shipment,
    }));

    return NextResponse.json({
      success: true,
      orders: formattedOrders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    return NextResponse.json(
      { error: 'Failed to get orders' },
      { status: 500 }
    );
  }
}
