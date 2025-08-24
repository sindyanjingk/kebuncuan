# Order Status Flow Documentation

## Overview
Sistem order status yang mengikuti alur dari payment hingga delivery dengan integrasi Midtrans dan Biteship webhooks.

## Order Status Flow

### 1. **PENDING** → Setelah order dibuat
- Order baru dibuat dengan status PENDING
- Payment belum selesai
- **Trigger**: Order creation API

### 2. **PENDING** → Setelah payment PAID dari Midtrans
- Payment status menjadi PAID
- Order status tetap PENDING (menunggu customer confirm)
- **Trigger**: Midtrans webhook `/api/payment/midtrans/webhook`

### 3. **PROCESSING** → Setelah customer memproses pesanan
- Customer confirm pesanan yang sudah dibayar
- Order status berubah ke PROCESSING
- **Trigger**: Customer action via `/api/orders/[orderId]/process`

### 4. **SHIPPED** → Setelah store owner melakukan pengiriman
- Store owner create shipment via Biteship
- Order status berubah ke SHIPPED
- **Trigger**: Store shipping API `/api/store/[store]/orders/[orderId]/ship`

### 5. **SUCCESS** → Setelah paket delivered
- Biteship webhook mengirim status delivered
- Order status berubah ke SUCCESS
- **Trigger**: Biteship webhook `/api/shipping/biteship/webhook`

### 6. **FAILED** → Jika ada masalah
- Payment failed, shipping cancelled, atau returned
- Order status berubah ke FAILED
- **Trigger**: Midtrans/Biteship webhook

## API Endpoints

### Customer APIs
```
POST /api/orders/[orderId]/process
- Customer confirm pesanan yang sudah dibayar
- Change status: PENDING → PROCESSING
- Requires: Payment status = PAID
```

### Store Owner APIs
```
POST /api/store/[store]/orders/[orderId]/ship
- Store owner ship the order
- Change status: PROCESSING → SHIPPED
- Creates Biteship order and local shipment record
```

### Webhook APIs
```
POST /api/payment/midtrans/webhook
- Payment status updates from Midtrans
- Updates payment status but keeps order as PENDING
- Customer needs to manually process after payment

POST /api/shipping/biteship/webhook
- Shipping status updates from Biteship
- Maps shipping status to order status:
  * confirmed/allocated/picking_up/picked/dropping_off → SHIPPED
  * delivered → SUCCESS
  * cancelled/returned → FAILED
```

## Status Mappings

### Payment Status (Midtrans)
```
settlement/capture+accept → PAID (order stays PENDING)
cancel/deny/expire → FAILED
pending → UNPAID
```

### Shipping Status (Biteship)
```
confirmed → SHIPPED
allocated → SHIPPED
picking_up → SHIPPED
picked_up → SHIPPED
dropping_off → SHIPPED
delivered → SUCCESS
cancelled → FAILED
returned → FAILED
on_hold → SHIPPED (no order status change)
```

## Database Schema

### Order Model
```prisma
enum OrderStatus {
  PENDING     // Baru dibuat atau payment selesai
  PROCESSING  // Customer sudah confirm
  SHIPPED     // Sudah dikirim
  SUCCESS     // Paket sampai
  FAILED      // Payment gagal atau shipping bermasalah
}
```

### Payment Model
```prisma
enum PaymentStatus {
  UNPAID
  PAID
  FAILED
}
```

### Shipment Model
```prisma
enum ShipmentStatus {
  PENDING
  CONFIRMED
  ALLOCATED
  PICKING_UP
  PICKED_UP
  DROPPING_OFF
  DELIVERED
  RETURNED
  CANCELLED
  ON_HOLD
}
```

## Webhook Configuration

### Midtrans
- **URL**: `https://yourdomain.com/api/payment/midtrans/webhook`
- **Method**: POST
- **Purpose**: Update payment status

### Biteship
- **URL**: `https://yourdomain.com/api/shipping/biteship/webhook`
- **Method**: POST
- **Purpose**: Update shipping and order status

## User Experience Flow

1. **Customer places order** → Status: PENDING
2. **Customer pays via Midtrans** → Payment: PAID, Order: PENDING
3. **Customer confirms in profile** → Status: PROCESSING
4. **Store owner ships order** → Status: SHIPPED
5. **Package delivered** → Status: SUCCESS

## Validation Rules

### Process Order (Customer)
- Order must belong to user
- Payment status must be PAID
- Order status must be PENDING

### Ship Order (Store Owner)
- Must be store owner
- Order must belong to store
- Order status should be PROCESSING

## Environment Variables
```env
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_IS_PRODUCTION="false"
BITESHIP_API_KEY="your-biteship-key"
```
