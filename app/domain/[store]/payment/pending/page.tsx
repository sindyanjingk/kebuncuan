'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CreditCard } from 'lucide-react';

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('order_id');
  const statusCode = searchParams.get('status_code');
  const transactionStatus = searchParams.get('transaction_status');

  const getPendingMessage = () => {
    return 'Pembayaran Anda sedang dalam proses verifikasi. Ini mungkin membutuhkan beberapa menit hingga beberapa jam tergantung metode pembayaran yang Anda pilih.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Clock className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-600">
            Pembayaran Pending
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 leading-relaxed">
            {getPendingMessage()}
          </p>
          
          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-500 mb-1">ID Pesanan:</p>
              <p className="font-mono text-sm text-gray-900 break-all">{orderId}</p>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium text-blue-800">Informasi Penting</p>
            </div>
            <p className="text-sm text-blue-700">
              Kami akan mengirim notifikasi via email setelah pembayaran berhasil dikonfirmasi.
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-700">
              ⏰ Status pembayaran akan diperbarui secara otomatis. Silakan periksa riwayat pesanan Anda secara berkala.
            </p>
          </div>

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

export default function PaymentPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentPendingContent />
    </Suspense>
  );
}
