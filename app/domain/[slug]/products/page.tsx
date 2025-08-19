"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
}

export default function ProductsPage() {
  const params = useParams();
  const storeSlug = params.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products?store=${storeSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      });
  }, [storeSlug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Produk Kami</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link href={`/domain/${storeSlug}/products/${product.id}`} key={product.id}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <Image
                    src={product.images[0]?.url || "/images/product-placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
              <CardFooter className="p-4">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{formatRupiah(product.price)}</p>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
