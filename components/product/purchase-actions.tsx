"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart, Heart, Share2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

interface PurchaseActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  storeSlug: string;
  session: Session | null;
}

export function PurchaseActions({ product, storeSlug, session }: PurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!session?.user?.email) {
      toast.error("Silakan login terlebih dahulu");
      router.push(`/login`);
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.name} ditambahkan ke keranjang!`);
    } catch (error: any) {
      toast.error(error.message || "Gagal menambahkan ke keranjang");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!session?.user?.email) {
      toast.error("Silakan login terlebih dahulu");
      router.push(`/login`);
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product.id, quantity);
      router.push(`/checkout`);
    } catch (error: any) {
      toast.error(error.message || "Gagal memproses pembelian");
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Lihat produk ${product.name}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link produk disalin!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link produk disalin!");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="font-semibold text-gray-900 mb-4">Pembelian</h3>
      
      {/* Quantity Selector */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3"
            disabled={isLoading}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="px-4 py-2 font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
            className="px-3"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <span className="text-sm text-gray-600">
          Total: {formatRupiah(product.price * quantity)}
        </span>
      </div>
      
      {/* Action Buttons */}
      <div className="flex md:flex-row flex-col gap-4">
        <Button
          size="lg"
          variant="outline"
          className="flex-1 border-purple-200 p-4 text-purple-700 hover:bg-purple-50"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isLoading ? "Menambahkan..." : "Tambah ke Keranjang"}
        </Button>
        <Button
          size="lg"
          className="flex-1 bg-gradient-to-r p-4 from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={handleBuyNow}
          disabled={isLoading}
        >
          {isLoading ? "Memproses..." : "Beli Sekarang"}
        </Button>
      </div>
      
      {/* Additional Actions */}
      <div className="flex gap-2 mt-4 justify-center">
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-500"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          {isFavorite ? 'Tersimpan' : 'Simpan'}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-500"
          onClick={handleShare}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Bagikan
        </Button>
      </div>
    </div>
  );
}
