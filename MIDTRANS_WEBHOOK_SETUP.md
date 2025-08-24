# Midtrans Webhook Configuration

## Setting up Midtrans Webhooks

Untuk memastikan status order diupdate setelah payment, Anda perlu mengkonfigurasi webhook URL di dashboard Midtrans.

### 1. Login ke Midtrans Dashboard
- Sandbox: https://dashboard.sandbox.midtrans.com/
- Production: https://dashboard.midtrans.com/

### 2. Configure Webhook URL
Di menu **Settings > Configuration**, set **Payment Notification URL** ke:

**Development:**
```
http://localhost:3000/api/payment/midtrans/webhook
```

**Production:**
```
https://yourdomain.com/api/payment/midtrans/webhook
```

### 3. Webhook Events
Webhook akan otomatis mengupdate status order berdasarkan payment status:
- `settlement` → Order status: SUCCESS, Payment status: PAID
- `capture` + `accept` → Order status: SUCCESS, Payment status: PAID
- `cancel`/`deny`/`expire` → Order status: FAILED, Payment status: FAILED
- `pending` → Order status: PENDING, Payment status: UNPAID

### 4. Environment Variables
Pastikan .env file memiliki konfigurasi:
```
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION="false"
```

### 5. Features yang Sudah Implemented
✅ Cart clearing setelah order berhasil dibuat
✅ Webhook untuk update status order dan payment
✅ Dynamic callback URLs untuk subdomain support
✅ Order history display dengan status terbaru
✅ Payment status tracking di profile customer

### 6. Testing
1. Buat order dengan payment Midtrans
2. Cart akan otomatis kosong setelah order dibuat
3. Lakukan payment di Midtrans
4. Status order akan terupdate via webhook
5. Check order history di profile customer
