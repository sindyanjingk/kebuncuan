import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface PaymentFinishPageProps {
  searchParams: {
    order_id?: string;
    status_code?: string;
    transaction_status?: string;
  };
}

export default function PaymentFinishPage({ searchParams }: PaymentFinishPageProps) {
  const { order_id, status_code, transaction_status } = searchParams;

  if (!order_id) {
    redirect('/');
  }

  const getStatusIcon = () => {
    switch (transaction_status) {
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
    switch (transaction_status) {
      case 'settlement':
      case 'capture':
        return {
          title: 'Pembayaran Berhasil!',
          message: 'Terima kasih! Pembayaran Anda telah berhasil diproses.',
          color: 'text-green-600'
        };
      case 'pending':
        return {
          title: 'Pembayaran Pending',
          message: 'Pembayaran Anda sedang dalam proses. Kami akan mengirim notifikasi setelah pembayaran dikonfirmasi.',
          color: 'text-yellow-600'
        };
      case 'deny':
        return {
          title: 'Pembayaran Ditolak',
          message: 'Pembayaran Anda ditolak. Silakan coba metode pembayaran lain.',
          color: 'text-red-600'
        };
      case 'cancel':
        return {
          title: 'Pembayaran Dibatalkan',
          message: 'Pembayaran telah dibatalkan.',
          color: 'text-red-600'
        };
      case 'expire':
        return {
          title: 'Pembayaran Kedaluwarsa',
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
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-2xl font-bold ${statusInfo.color}`}>
            {statusInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {statusInfo.message}
          </p>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Order ID:</p>
            <p className="font-medium text-gray-900">{order_id}</p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Kembali ke Beranda
              </Button>
            </Link>
            
            <Link href="/profile">
              <Button variant="outline" className="w-full">
                Lihat Riwayat Pesanan
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
