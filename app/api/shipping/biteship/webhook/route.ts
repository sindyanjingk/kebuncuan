import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, ShipmentStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const notification = await request.json();
    
    console.log('Biteship webhook received:', notification);

    const { 
      order_id,
      status,
      waybill_id,
      courier_company,
      courier_type,
      tracking_id
    } = notification;

    if (!order_id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find shipment by biteship order_id
    const shipment = await prisma.shipment.findFirst({
      where: {
        biteship_order_id: order_id
      },
      include: {
        order: true
      }
    });

    if (!shipment) {
      console.log(`Shipment not found for Biteship order_id: ${order_id}`);
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      );
    }

    // Map Biteship status to ShipmentStatus and OrderStatus
    let shipmentStatus: ShipmentStatus;
    let orderStatus: OrderStatus | null = null;

    switch (status.toLowerCase()) {
      case 'confirmed':
        shipmentStatus = ShipmentStatus.CONFIRMED;
        orderStatus = OrderStatus.SHIPPED;
        break;
      case 'allocated':
        shipmentStatus = ShipmentStatus.ALLOCATED;
        orderStatus = OrderStatus.SHIPPED;
        break;
      case 'picking_up':
        shipmentStatus = ShipmentStatus.PICKING_UP;
        orderStatus = OrderStatus.SHIPPED;
        break;
      case 'picked':
      case 'picked_up':
        shipmentStatus = ShipmentStatus.PICKED_UP;
        orderStatus = OrderStatus.SHIPPED;
        break;
      case 'dropping_off':
        shipmentStatus = ShipmentStatus.DROPPING_OFF;
        orderStatus = OrderStatus.SHIPPED;
        break;
      case 'delivered':
        shipmentStatus = ShipmentStatus.DELIVERED;
        orderStatus = OrderStatus.SUCCESS;
        break;
      case 'cancelled':
        shipmentStatus = ShipmentStatus.CANCELLED;
        orderStatus = OrderStatus.FAILED;
        break;
      case 'returned':
        shipmentStatus = ShipmentStatus.RETURNED;
        orderStatus = OrderStatus.FAILED;
        break;
      case 'on_hold':
        shipmentStatus = ShipmentStatus.ON_HOLD;
        // Don't change order status for on_hold
        break;
      default:
        shipmentStatus = ShipmentStatus.PENDING;
        break;
    }

    // Update shipment status
    await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        status: shipmentStatus,
        waybill: waybill_id || shipment.waybill
      }
    });

    // Update order status if mapping exists
    if (orderStatus !== null) {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: {
          status: orderStatus
        }
      });

      console.log(`Order ${shipment.orderId} status updated to ${orderStatus} based on shipping status: ${status}`);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Webhook processed successfully',
      shipment_id: shipment.id,
      order_status: orderStatus
    });

  } catch (error) {
    console.error('Biteship webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
