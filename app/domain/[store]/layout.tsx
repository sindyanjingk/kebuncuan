import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "@/components/ui/sonner";
import { ClientStoreHeader } from "@/components/client-store-header";
import StoreFooter from "@/components/store/store-footer";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { store: string } }): Promise<Metadata> {
  const storeData = await prisma.store.findUnique({
    where: { 
      slug: params.store,
      deletedAt: null // Only show metadata for non-deleted stores
    },
    select: {
      name: true,
      logoUrl: true,
      faviconUrl: true,
    }
  });

  if (!storeData) {
    return {
      title: 'Store Not Found',
      description: 'The requested store could not be found.',
    };
  }

  const description = `Welcome to ${storeData.name} - Your trusted online store`;

  return {
    title: storeData.name,
    description: description,
    icons: {
      icon: storeData.faviconUrl || storeData.logoUrl || '/favicon.ico',
    },
    openGraph: {
      title: storeData.name,
      description: description,
      images: storeData.logoUrl ? [storeData.logoUrl] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: storeData.name,
      description: description,
      images: storeData.logoUrl ? [storeData.logoUrl] : [],
    },
  };
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { store: string };
}) {
  // Fetch store data on server
  const storeData = await prisma.store.findUnique({
    where: { 
      slug: params.store,
      deletedAt: null // Only allow access to non-deleted stores
    },
    include: {
      settings: true,
      template: {
        include: {
          heroConfig: true,
          featuresConfig: true,
          socialProofConfig: true
        }
      }
    }
  });

  if (!storeData) {
    notFound();
  }

  // Get session on server
  const session = await getServerSession(authOptions);

  return (
      <CartProvider session={session}>
        <div className="min-h-screen flex flex-col">
          {/* Header - Always show if store exists */}
          {storeData && (
            <ClientStoreHeader storeData={storeData} storeSlug={params.store} />
          )}
          
          <main className="flex-1">
            {children}
          </main>
          
          {/* Footer */}
          {storeData && (
            <StoreFooter 
              storeSlug={params.store} 
              storeName={storeData.name}
              storeSettings={storeData.settings}
            />
          )}
          
          <Toaster />
        </div>
      </CartProvider>
  );
}
