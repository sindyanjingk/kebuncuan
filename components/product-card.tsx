"use client";

import { BuyButton } from "@/components/buy-button";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
  category?: { name: string } | null;
}

interface ProductCardProps {
  product: Product;
  session: any;
}

export function ProductCard({ product, session }: ProductCardProps) {
  return (
    <div className="flex flex-col">
      <div className="rounded-2xl border bg-white/80 shadow-lg hover:shadow-2xl transition p-6 flex flex-col h-full group">
        <div className="font-bold text-lg mb-1 group-hover:text-green-700 transition">{product.name}</div>
        <div className="text-xs text-muted-foreground mb-2">{product.category?.name || '-'}</div>
        <div className="font-extrabold text-green-700 text-xl mb-2">Rp {product.price.toLocaleString('id-ID')}</div>
        <div className="flex-1 text-sm mb-3 text-gray-700">{product.description}</div>
        <div className="mt-auto flex gap-2 items-center">
          <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {product.active ? 'Aktif' : 'Nonaktif'}
          </span>
          <BuyButton 
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
            }} 
            disabled={!product.active} 
            session={session} 
          />
        </div>
      </div>
    </div>
  );
}
