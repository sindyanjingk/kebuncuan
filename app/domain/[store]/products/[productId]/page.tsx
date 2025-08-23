import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { ArrowLeft, Star, Truck, Shield, RotateCcw, ShoppingCart, Heart, Share2 } from "lucide-react";
import { PurchaseActions } from "@/components/product/purchase-actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

export default async function ProductDetailPage({ 
  params 
}: { 
  params: { store: string; productId: string } 
}) {
  const session = await getServerSession(authOptions);
  
  const store = await prisma.store.findUnique({
    where: { slug: params.store },
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

  const product = await prisma.product.findFirst({
    where: {
      id: params.productId,
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
    }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/products`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Produk
            </Button>
          </Link>
          
          {store.logoUrl && (
            <div className="relative w-8 h-8">
              <Image
                src={store.logoUrl}
                alt={`${store.name} logo`}
                fill
                className="object-contain"
              />
            </div>
          )}
          <span className="text-sm text-gray-600">{store.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Product Image */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-square relative bg-white">
                  <Image
                    src={product.images[0]?.url || "/images/product-placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square relative rounded-lg overflow-hidden border-2 border-gray-200"
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Mostly Static */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {product.category.name}
              </Badge>
            )}
            
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.9) • 128 ulasan</span>
              </div>
            </div>
            
            {/* Price */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {formatRupiah(product.price)}
              </div>
              <div className="text-sm text-gray-600">
                Harga sudah termasuk PPN
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-3">Deskripsi Produk</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            
            {/* Features */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Gratis Ongkir</div>
                    <div className="text-sm text-gray-600">Untuk pembelian minimal 50k</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Garansi Kualitas</div>
                    <div className="text-sm text-gray-600">Produk original & berkualitas</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Mudah Dikembalikan</div>
                    <div className="text-sm text-gray-600">Kebijakan return 7 hari</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Section */}
            <PurchaseActions 
              product={{
                id: product.id,
                name: product.name,
                price: product.price
              }}
              storeSlug={params.store}
              session={session}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
