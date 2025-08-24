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

### 4. Webhook Installation & Testing
Webhook endpoints telah diupdate untuk mendukung installation:

**GET Method (Testing):**
```
GET https://yourdomain.com/api/payment/midtrans/webhook
GET https://yourdomain.com/api/shipping/biteship/webhook
```

**POST Method (Live Webhooks):**
- ✅ Menerima empty request body untuk installation
- ✅ Menerima malformed JSON untuk testing
- ✅ Merespons OK bahkan tanpa required fields
- ✅ Validasi hanya dilakukan setelah installation sukses

### 5. Environment Variables
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
✅ Installation-friendly webhooks (accept empty/invalid requests)

### 6. Testing
1. **Test Webhook Endpoints:**
   ```bash
   # Test dengan GET request
   curl https://yourdomain.com/api/payment/midtrans/webhook
   curl https://yourdomain.com/api/shipping/biteship/webhook
   
   # Test dengan POST request kosong
   curl -X POST https://yourdomain.com/api/payment/midtrans/webhook \
        -H "Content-Type: application/json" \
        -d '{}'
   ```

2. **Install di Dashboard:**
   - Daftarkan URL webhook di dashboard
   - Sistem akan otomatis respond OK untuk installation
   - Setelah installation sukses, webhook akan process data real

3. **Production Testing:**
   - Buat order dengan payment Midtrans
   - Cart akan otomatis kosong setelah order dibuat  
   - Lakukan payment di Midtrans
   - Status order akan terupdate via webhook
   - Check order history di profile customer
