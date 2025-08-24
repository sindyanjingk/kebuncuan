'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, AlertTriangle } from 'lucide-react';

function PaymentErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get('order_id');
  const statusCode = searchParams.get('status_code');
  const transactionStatus = searchParams.get('transaction_status');

  const getErrorMessage = () => {
    switch (transactionStatus) {
      case 'deny':
        return 'Pembayaran ditolak oleh bank atau penyedia kartu. Silakan periksa saldo atau hubungi bank Anda.';
      case 'cancel':
        return 'Pembayaran dibatalkan. Anda dapat mencoba lagi dengan metode pembayaran yang sama atau berbeda.';
      case 'expire':
        return 'Sesi pembayaran telah kedaluwarsa. Silakan buat pesanan baru.';
      case 'failure':
        return 'Pembayaran gagal diproses. Silakan coba lagi atau gunakan metode pembayaran lain.';
      default:
        return 'Terjadi kesalahan dalam proses pembayaran. Silakan coba lagi.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Pembayaran Gagal
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 leading-relaxed">
            {getErrorMessage()}
          </p>
          
          {orderId && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-sm text-gray-500 mb-1">ID Pesanan:</p>
              <p className="font-mono text-sm text-gray-900 break-all">{orderId}</p>
            </div>
          )}

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm font-medium text-yellow-800">Bantuan</p>
            </div>
            <p className="text-sm text-yellow-700">
              Jika masalah berlanjut, silakan hubungi customer service kami.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button 
              onClick={() => router.push('/checkout')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              Coba Pembayaran Lagi
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

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </CardContent>
        </Card>
      </div>
    }>
      <PaymentErrorContent />
    </Suspense>
  );
}
