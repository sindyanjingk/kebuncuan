import { NextRequest, NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

// Create Core API instance for notification handling
const core = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const notification = await request.json();
    
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const orderId = notification.order_id;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    let orderStatus: OrderStatus = OrderStatus.PENDING;
    let paymentStatus: PaymentStatus = PaymentStatus.UNPAID;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        orderStatus = OrderStatus.PENDING;
        paymentStatus = PaymentStatus.UNPAID;
      } else if (fraudStatus === 'accept') {
        orderStatus = OrderStatus.SUCCESS;
        paymentStatus = PaymentStatus.PAID;
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = OrderStatus.SUCCESS;
      paymentStatus = PaymentStatus.PAID;
    } else if (transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire') {
      orderStatus = OrderStatus.FAILED;
      paymentStatus = PaymentStatus.FAILED;
    } else if (transactionStatus === 'pending') {
      orderStatus = OrderStatus.PENDING;
      paymentStatus = PaymentStatus.UNPAID;
    }

    // Update order status in database
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: orderStatus,
      }
    });

    // Update or create payment record
    await prisma.payment.upsert({
      where: { orderId: orderId },
      update: {
        status: paymentStatus,
        method: notification.payment_type || 'MIDTRANS',
        paidAt: paymentStatus === PaymentStatus.PAID ? new Date() : null,
      },
      create: {
        orderId: orderId,
        method: notification.payment_type || 'MIDTRANS',
        amount: parseFloat(notification.gross_amount) || 0,
        status: paymentStatus,
        paidAt: paymentStatus === PaymentStatus.PAID ? new Date() : null,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
