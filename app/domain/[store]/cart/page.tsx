"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const params = useParams();
  const storeSlug = params.store as string;
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">
                Looks like you haven&apos;t added any items to your cart yet. 
                Start shopping to fill it up!
              </p>
            </div>
            <Link href={`/domain/${storeSlug}`}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image or Emoji */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        {item.emoji ? (
                          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                            {item.emoji}
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                        <div className="flex items-center mt-2">
                          <Badge variant="secondary" className="text-xs">
                            Product
                          </Badge>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          {formatRupiah(item.price * item.quantity)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatRupiah(item.price)} each
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">{formatRupiah(getTotalPrice())}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
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
                    asChild
                  >
                    <Link href={`/domain/${storeSlug}/checkout`}>
                      Proceed to Checkout
                    </Link>
                  </Button>

                  <div className="text-center">
                    <Link href={`/domain/${storeSlug}`} className="text-sm text-purple-600 hover:text-purple-700">
                      ← Continue Shopping
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
