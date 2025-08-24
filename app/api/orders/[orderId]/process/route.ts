import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = params;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get order and verify it belongs to user and payment is completed
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true,
        user: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to user
    if (order.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify payment is completed
    if (!order.payment || order.payment.status !== PaymentStatus.PAID) {
      return NextResponse.json({ 
        error: 'Payment must be completed before processing order' 
      }, { status: 400 });
    }

    // Verify current status allows processing
    if (order.status !== OrderStatus.PENDING) {
      return NextResponse.json({ 
        error: `Cannot process order with status: ${order.status}` 
      }, { status: 400 });
    }

    // Update order status to PROCESSING
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PROCESSING
      },
      include: {
        payment: true,
        product: true,
        shipment: true
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Order status updated to processing',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
