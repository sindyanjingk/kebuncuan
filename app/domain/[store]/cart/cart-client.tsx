"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CartClientProps {
  initialCart: {
    id: string;
    items: {
      id: string;
      quantity: number;
      product: {
        id: string;
        name: string;
        price: number;
        description: string;
        images: { url: string }[];
        category: { name: string } | null;
      };
    }[];
  };
  storeSlug: string;
}

export function CartClient({ initialCart, storeSlug }: CartClientProps) {
  const router = useRouter();
  const { removeFromCart, updateQuantity } = useCart();
  const [cart, setCart] = useState(initialCart);
  const [loading, setLoading] = useState(false);

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    setLoading(true);
    try {
      if (newQuantity <= 0) {
        await removeFromCart(cartItemId);
        setCart(prev => ({
          ...prev,
          items: prev.items.filter(item => item.id !== cartItemId)
        }));
        toast.success("Item dihapus dari keranjang");
      } else {
        await updateQuantity(cartItemId, newQuantity);
        setCart(prev => ({
          ...prev,
          items: prev.items.map(item => 
            item.id === cartItemId ? { ...item, quantity: newQuantity } : item
          )
        }));
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal mengupdate keranjang");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    setLoading(true);
    try {
      await removeFromCart(cartItemId);
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== cartItemId)
      }));
      toast.success("Item dihapus dari keranjang");
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus item");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    router.push(`/checkout`);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Keranjang Kosong</h1>
              <p className="text-gray-600 mb-8">
                Sepertinya Anda belum menambahkan item apapun ke keranjang. 
                Mulai berbelanja untuk mengisinya!
              </p>
            </div>
            <Link href={`/products`}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Lanjut Berbelanja
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={``}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
                <p className="text-gray-600 mt-1">{getTotalItems()} item dalam keranjang</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((cartItem) => (
                <Card key={cartItem.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        {cartItem.product.images?.[0]?.url ? (
                          <Image
                            src={cartItem.product.images[0].url}
                            alt={cartItem.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{cartItem.product.name}</h3>
                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{cartItem.product.description}</p>
                        <div className="flex items-center mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {cartItem.product.category?.name || 'Produk'}
                          </Badge>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity - 1)}
                          className="w-8 h-8 p-0"
                          disabled={loading}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{cartItem.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity + 1)}
                          className="w-8 h-8 p-0"
                          disabled={loading}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatRupiah(cartItem.product.price * cartItem.quantity)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatRupiah(cartItem.product.price)} satuan
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveItem(cartItem.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({getTotalItems()} item)</span>
                    <span className="font-medium">{formatRupiah(getTotalPrice())}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pajak (10%)</span>
                    <span className="font-medium">{formatRupiah(getTotalPrice() * 0.1)}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-semibold text-purple-600">
                        {formatRupiah(getTotalPrice() * 1.1)}
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    Lanjut ke Checkout
                  </Button>

                  <div className="text-center">
                    <Link href={`/products`} className="text-sm text-purple-600 hover:text-purple-700">
                      ← Lanjut Berbelanja
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
