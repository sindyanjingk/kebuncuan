"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function formatRupiah(num: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);
}

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  modalPrice?: number;
  productType?: string;
  categoryId: string;
  active: boolean;
  category?: { name: string };
  images: any[];
};

export default function ProductsPage() {
  const params = useParams();
  const storeSlug = params.store as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?store=${storeSlug}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [storeSlug]);

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produk</h1>
        <Button>Tambah Produk</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Daftar Produk</h2>
        </div>
        <div className="p-4">
          {products.length === 0 ? (
            <p>Belum ada produk</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-gray-600 text-sm">{product.description}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Harga Jual:</span> {formatRupiah(product.price)}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Harga Modal:</span> {formatRupiah(product.modalPrice || 0)}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          <span className="font-medium">Keuntungan:</span> {formatRupiah((product.price || 0) - (product.modalPrice || 0))}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Tipe:</span> {
                            product.productType === "PHYSICAL" ? "Produk Fisik" :
                            product.productType === "DIGITAL" ? "Produk Digital" :
                            product.productType
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Hapus</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
