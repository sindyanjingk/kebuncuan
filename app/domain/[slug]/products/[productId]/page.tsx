"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const storeSlug = params.slug as string;
  const productId = params.productId as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    fetch(`/api/products/${productId}?store=${storeSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        if (data.product?.images?.[0]) {
          setSelectedImage(data.product.images[0].url);
        }
        setLoading(false);
      });
  }, [productId, storeSlug]);

  const addToCart = async () => {
    try {
      const res = await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          storeSlug,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      toast.success("Product added to cart");
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  if (loading || !product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative">
            <Image
              src={selectedImage || "/images/product-placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image) => (
              <button
                key={image.url}
                onClick={() => setSelectedImage(image.url)}
                className={`aspect-square relative rounded-lg overflow-hidden ${
                  selectedImage === image.url ? "ring-2 ring-primary" : ""
                }`}
              >
                <Image
                  src={image.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold">{formatRupiah(product.price)}</p>
          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>
          <div className="space-x-4">
            <Button size="lg" onClick={addToCart}>
              Add to Cart
            </Button>
            <Button size="lg" variant="secondary">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
