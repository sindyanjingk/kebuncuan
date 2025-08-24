import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProductsClient } from "./products-client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
  category: { name: string } | null;
  active: boolean;
}

interface Store {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export default async function ProductsPage({ params }: { params: { store: string } }) {
  const store = await prisma.store.findUnique({
    where: { 
      slug: params.store,
      deletedAt: null // Only show non-deleted stores
    },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
    }
  });

  if (!store) {
    notFound();
  }

  const products = await prisma.product.findMany({
    where: {
      store: { slug: params.store },
      active: true,
    },
    include: {
      category: {
        select: { name: true }
      },
      images: {
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  });

  const categories = Array.from(new Set(
    products
      .map(p => p.category?.name)
      .filter(Boolean)
  )) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href={`/`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
            </Link>
            
            {store.logoUrl && (
              <div className="relative w-12 h-12">
                <Image
                  src={store.logoUrl}
                  alt={`${store.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Produk {store.name}</h1>
              <p className="text-gray-600">Temukan produk terbaik untuk Anda</p>
            </div>
          </div>
        </div>

        {/* Client-side filtering and interactions */}
        <ProductsClient 
          initialProducts={products}
          categories={categories}
          storeSlug={params.store}
        />
      </div>
    </div>
  );
}
