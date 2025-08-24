# Integrasi Midtrans Payment Gateway

## Overview
Aplikasi ini telah diintegrasikan dengan Midtrans payment gateway untuk memproses pembayaran secara aman dan mudah.

## Fitur yang Tersedia

### 1. **Checkout dengan Midtrans**
- Pembayaran otomatis terintegrasi saat checkout
- Support multiple payment methods (Credit Card, Bank Transfer, E-Wallet, dll)
- Real-time payment status notification

### 2. **Payment Status Pages**
- `/payment/finish` - Halaman sukses pembayaran
- `/payment/pending` - Halaman pending pembayaran
- `/payment/error` - Halaman error pembayaran

### 3. **Webhook Integration**
- Automatic payment status update via webhook
- Real-time order status synchronization

## Setup Midtrans

### 1. **Buat Akun Midtrans**
1. Daftar di [Midtrans Dashboard](https://dashboard.midtrans.com/)
2. Verifikasi akun Anda
3. Dapatkan Server Key dan Client Key

### 2. **Konfigurasi Environment Variables**
Tambahkan ke file `.env`:

```env
# Midtrans Configuration
MIDTRANS_IS_PRODUCTION="false"  # Set ke "true" untuk production
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
```

### 3. **Konfigurasi Webhook di Midtrans Dashboard**
1. Login ke Midtrans Dashboard
2. Pergi ke Settings → Configuration
3. Set Payment Notification URL ke: `https://yourdomain.com/api/payment/midtrans/webhook`
4. Set Finish/Unfinish/Error Redirect URL:
   - Finish: `https://yourdomain.com/payment/finish`
   - Unfinish/Pending: `https://yourdomain.com/payment/pending`
   - Error: `https://yourdomain.com/payment/error`

## Cara Kerja

### 1. **Proses Checkout**
1. Customer mengisi form checkout dengan informasi pengiriman
2. Sistem menghitung total dengan shipping cost dan tax
3. Sistem membuat order di database
4. Sistem memanggil Midtrans API untuk membuat payment token
5. Pop-up Midtrans muncul untuk customer melakukan pembayaran

### 2. **Proses Pembayaran**
1. Customer memilih metode pembayaran di Midtrans
2. Customer menyelesaikan pembayaran
3. Midtrans mengirim notifikasi ke webhook
4. Sistem update status order berdasarkan notifikasi
5. Customer diarahkan ke halaman status pembayaran

### 3. **Status Pembayaran**
- **PENDING**: Pembayaran belum selesai
- **SUCCESS**: Pembayaran berhasil
- **FAILED**: Pembayaran gagal

## API Endpoints

### 1. **POST /api/payment/midtrans**
Membuat payment token untuk Midtrans Snap

**Request Body:**
```json
{
  "orderId": "ORDER-123456",
  "grossAmount": 100000,
  "customerDetails": {
    "first_name": "John Doe",
    "email": "john@example.com",
    "phone": "08123456789"
  },
  "itemDetails": [
    {
      "id": "item1",
      "price": 100000,
      "quantity": 1,
      "name": "Product Name"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "token": "payment-token",
  "redirect_url": "https://app.midtrans.com/snap/v2/vtweb/payment-token"
}
```

### 2. **POST /api/payment/midtrans/webhook**
Webhook untuk menerima notifikasi status pembayaran dari Midtrans

## Testing

### 1. **Sandbox Mode**
- Gunakan `MIDTRANS_IS_PRODUCTION="false"` untuk testing
- Gunakan test credit card numbers dari [Midtrans Testing Guide](https://docs.midtrans.com/reference/sandbox-testing)

### 2. **Test Credit Cards**
- **Success**: 4811 1111 1111 1114
- **Failure**: 4911 1111 1111 1113
- **Challenge**: 4411 1111 1111 1118

## Monitoring

### 1. **Midtrans Dashboard**
- Monitor semua transaksi di Midtrans Dashboard
- Lihat detail pembayaran dan status

### 2. **Application Logs**
- Check logs untuk webhook notifications
- Monitor order status updates

## Troubleshooting

### 1. **Payment Tidak Muncul**
- Pastikan NEXT_PUBLIC_MIDTRANS_CLIENT_KEY sudah benar
- Check browser console untuk error

### 2. **Webhook Tidak Berfungsi**
- Pastikan webhook URL accessible dari internet
- Check webhook configuration di Midtrans Dashboard

### 3. **Order Status Tidak Update**
- Check webhook logs
- Pastikan database connection berfungsi
- Verify order ID mapping

## Production Checklist

- [ ] Set `MIDTRANS_IS_PRODUCTION="true"`
- [ ] Gunakan production Server Key dan Client Key
- [ ] Konfigurasi webhook URL production
- [ ] Test semua payment methods
- [ ] Setup monitoring dan alerting
- [ ] Backup dan recovery plan

## Security

1. **Server Key**: Jangan expose di frontend
2. **Client Key**: Aman untuk digunakan di frontend
3. **Webhook**: Validate notification signature (recommended)
4. **HTTPS**: Wajib untuk production

## Support

Untuk bantuan lebih lanjut:
- [Midtrans Documentation](https://docs.midtrans.com/)
- [Midtrans Support](https://support.midtrans.com/)
