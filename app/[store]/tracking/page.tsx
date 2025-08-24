import TrackingForm from '@/components/shipping/tracking-form'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface TrackingPageProps {
  params: {
    store: string
  }
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  // Verify store exists and has shipping enabled
  const store = await prisma.store.findFirst({
    where: {
      slug: params.store,
      deletedAt: null
    },
    include: {
      shippingProvider: true
    }
  })

  if (!store) {
    notFound()
  }

  if (!store.shippingProvider || !store.shippingProvider.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Tracking Tidak Tersedia</h1>
          <p className="text-gray-600">
            Toko ini belum mengaktifkan fitur tracking pengiriman.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <TrackingForm storeSlug={params.store} />
    </div>
  )
}

export async function generateMetadata({ params }: TrackingPageProps) {
  const store = await prisma.store.findFirst({
    where: { slug: params.store, deletedAt: null }
  })

  return {
    title: `Lacak Pengiriman - ${store?.name || 'Toko'}`,
    description: 'Lacak status pengiriman paket Anda dengan mudah'
  }
}
