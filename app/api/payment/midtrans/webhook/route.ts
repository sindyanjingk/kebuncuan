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

// GET method for testing webhook endpoint
export async function GET() {
  return NextResponse.json({ 
    success: true,
    message: 'Midtrans webhook endpoint is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    let notification;
    
    // Handle empty body or malformed JSON (for installation/testing)
    try {
      notification = await request.json();
    } catch (error) {
      console.log('Midtrans webhook: Invalid or empty JSON body, responding OK for installation');
      return NextResponse.json({ 
        success: true,
        message: 'Webhook endpoint is working - received invalid/empty JSON' 
      });
    }
    
    // Handle installation/test request (empty body or test data)
    if (!notification || Object.keys(notification).length === 0) {
      console.log('Midtrans webhook installation/test request received');
      return NextResponse.json({ 
        success: true,
        message: 'Webhook endpoint is working' 
      });
    }
    
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;
    const orderId = notification.order_id;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    // For installation phase, accept requests without required fields
    if (!transactionStatus || !orderId) {
      console.log('Midtrans webhook: Missing required fields, but responding OK for installation');
      return NextResponse.json({ 
        success: true,
        message: 'Webhook endpoint received request but missing required fields' 
      });
    }

    let orderStatus: OrderStatus = OrderStatus.PENDING;
    let paymentStatus: PaymentStatus = PaymentStatus.UNPAID;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        orderStatus = OrderStatus.PENDING;
        paymentStatus = PaymentStatus.UNPAID;
      } else if (fraudStatus === 'accept') {
        orderStatus = OrderStatus.PENDING; // Changed: Keep PENDING after payment, will be PROCESSING when user confirms
        paymentStatus = PaymentStatus.PAID;
      }
    } else if (transactionStatus === 'settlement') {
      orderStatus = OrderStatus.PENDING; // Changed: Keep PENDING after payment, will be PROCESSING when user confirms
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
