'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

function PaymentFinishContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('order_id');
  const statusCode = searchParams.get('status_code');
  const transactionStatus = searchParams.get('transaction_status');

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Auto redirect to order history after 5 seconds for successful payments
    if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
      const timer = setTimeout(() => {
        router.push('/profile');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [orderId, transactionStatus, router]);

  if (!orderId) {
    return null;
  }

  const getStatusIcon = () => {
    switch (transactionStatus) {
      case 'settlement':
      case 'capture':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'pending':
        return <Clock className="h-16 w-16 text-yellow-500" />;
      case 'deny':
      case 'cancel':
      case 'expire':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Clock className="h-16 w-16 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (transactionStatus) {
      case 'settlement':
      case 'capture':
        return {
          title: 'Pembayaran Berhasil! 🎉',
          message: 'Terima kasih! Pembayaran Anda telah berhasil diproses. Anda akan dialihkan ke riwayat pesanan dalam 5 detik.',
          color: 'text-green-600'
        };
      case 'pending':
        return {
          title: 'Pembayaran Pending ⏳',
          message: 'Pembayaran Anda sedang dalam proses. Kami akan mengirim notifikasi setelah pembayaran dikonfirmasi.',
          color: 'text-yellow-600'
        };
      case 'deny':
        return {
          title: 'Pembayaran Ditolak ❌',
          message: 'Pembayaran Anda ditolak. Silakan coba metode pembayaran lain.',
          color: 'text-red-600'
        };
      case 'cancel':
        return {
          title: 'Pembayaran Dibatalkan ❌',
          message: 'Pembayaran telah dibatalkan.',
          color: 'text-red-600'
        };
      case 'expire':
        return {
          title: 'Pembayaran Kedaluwarsa ⏰',
          message: 'Pembayaran telah kedaluwarsa. Silakan buat pesanan baru.',
          color: 'text-red-600'
        };
      default:
        return {
          title: 'Status Pembayaran',
          message: 'Sedang memeriksa status pembayaran...',
          color: 'text-gray-600'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-2xl font-bold ${statusInfo.color}`}>
            {statusInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 leading-relaxed">
            {statusInfo.message}
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-sm text-gray-500 mb-1">ID Pesanan:</p>
            <p className="font-mono text-sm text-gray-900 break-all">{orderId}</p>
          </div>

          {(transactionStatus === 'settlement' || transactionStatus === 'capture') && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                ✅ Pesanan Anda sedang diproses dan akan segera dikirim!
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => router.push('/profile')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
            >
              Lihat Riwayat Pesanan
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Kembali ke Toko
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentFinishPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentFinishContent />
    </Suspense>
  );
}
