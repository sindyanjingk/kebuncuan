import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/orders?store=slug
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const storeSlug = searchParams.get("store");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  if (!storeSlug) return NextResponse.json({ error: "store param required" }, { status: 400 });

  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const total = await prisma.order.count({ where: { product: { storeId: store.id } } });
  const orders = await prisma.order.findMany({
    where: { product: { storeId: store.id } },
    include: {
      product: true,
      user: true,
      payment: true,
      shipment: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: orders, total });
}

// POST /api/orders
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const body = await req.json();
  const { 
    storeSlug,
    customerInfo,
    shipping,
    items,
    totals,
    usesMidtrans = true
  } = body;

  if (!storeSlug || !customerInfo || !items || !totals) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  try {
    // Create orders for each item (since current schema supports single product per order)
    const orders = [];
    
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.product.id } });
      if (!product) {
        continue;
      }

      const order = await prisma.order.create({
        data: {
          userId: user.id,
          productId: product.id,
          status: "PENDING",
          target: customerInfo.email,
          shipping_required: true,
          shipping_address: customerInfo.address,
          shipping_city: customerInfo.city,
          shipping_province: customerInfo.province,
          shipping_postal_code: customerInfo.postalCode,
          shipping_phone: customerInfo.phone,
          shipping_name: customerInfo.name,
          shipping_cost: shipping ? Math.round(shipping.price * 100) : 0, // Convert to cents
          shipping_courier: shipping?.courier_company || null,
          shipping_service: shipping?.courier_type || null,
        },
        include: {
          product: true,
          user: true,
        },
      });

      orders.push(order);
    }

    if (usesMidtrans && orders.length > 0) {
      // Check if Midtrans credentials are properly configured
      const hasValidMidtransConfig = 
        process.env.MIDTRANS_SERVER_KEY && 
        process.env.MIDTRANS_CLIENT_KEY && 
        process.env.MIDTRANS_SERVER_KEY !== 'your-midtrans-server-key' &&
        process.env.MIDTRANS_CLIENT_KEY !== 'your-midtrans-client-key';

      if (!hasValidMidtransConfig) {
        console.log('Midtrans credentials not configured, returning orders without payment token');
        return NextResponse.json({ 
          success: true, 
          orders,
          message: 'Order created successfully. Please complete payment manually.',
          payment: null
        });
      }

      // Create payment with Midtrans
      const orderId = `ORDER-${Date.now()}-${orders[0].id}`;
      
      // Create item details for Midtrans
      const itemDetails = items.map((item: any) => ({
        id: item.product.id,
        price: Math.round(item.product.price),
        quantity: item.quantity,
        name: item.product.name,
      }));

      // Add shipping cost as item if exists
      if (shipping && shipping.price > 0) {
        itemDetails.push({
          id: 'shipping',
          price: Math.round(shipping.price),
          quantity: 1,
          name: `Shipping - ${shipping.courier_company} ${shipping.courier_type}`,
        });
      }

      // Add tax as item
      if (totals.tax > 0) {
        itemDetails.push({
          id: 'tax',
          price: Math.round(totals.tax),
          quantity: 1,
          name: 'Tax (10%)',
        });
      }

      const customerDetails = {
        first_name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        billing_address: {
          first_name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          postal_code: customerInfo.postalCode,
          country_code: 'IDN'
        },
        shipping_address: {
          first_name: customerInfo.name,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          postal_code: customerInfo.postalCode,
          country_code: 'IDN'
        }
      };

      const shippingDetails = {
        first_name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        postal_code: customerInfo.postalCode,
        country_code: 'IDN'
      };

      // Call Midtrans API
      const midtransResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/payment/midtrans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          grossAmount: Math.round(totals.total),
          customerDetails,
          itemDetails,
          shippingDetails
        }),
      });

      if (midtransResponse.ok) {
        const paymentData = await midtransResponse.json();
        
        // Update first order with payment token
        await prisma.order.update({
          where: { id: orders[0].id },
          data: { 
            id: orderId // Update to use the combined order ID
          }
        });

        // Clear cart after successful order creation
        const cart = await prisma.cart.findUnique({
          where: {
            userId_storeId: {
              userId: user.id,
              storeId: store.id
            }
          }
        });

        if (cart) {
          await prisma.cartItem.deleteMany({
            where: {
              cartId: cart.id
            }
          });
        }

        return NextResponse.json({
          success: true,
          orders,
          payment: {
            token: paymentData.token,
            redirect_url: paymentData.redirect_url
          }
        });
      } else {
        throw new Error('Failed to create payment');
      }
    }

    // Clear cart after successful order creation (for non-Midtrans orders)
    const cart = await prisma.cart.findUnique({
      where: {
        userId_storeId: {
          userId: user.id,
          storeId: store.id
        }
      }
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id
        }
      });
    }

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
