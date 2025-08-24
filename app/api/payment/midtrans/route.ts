import { NextRequest, NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

// Create Snap API instance
const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      grossAmount,
      customerDetails,
      itemDetails,
      shippingDetails
    } = body;

    // Get the current domain from request headers (for subdomain support)
    const host = request.headers.get('host') || process.env.NEXT_PUBLIC_HOST_DOMAIN;
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    // Create transaction parameter
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: customerDetails,
      item_details: itemDetails,
      shipping_address: shippingDetails,
      credit_card: {
        secure: true,
      },
      callbacks: {
        finish: `${baseUrl}/payment/finish`,
        error: `${baseUrl}/payment/error`,
        pending: `${baseUrl}/payment/pending`
      },
      custom_field1: baseUrl, // Store base URL for webhook reference
    };

    // Create transaction
    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });
  } catch (error) {
    console.error('Midtrans payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
