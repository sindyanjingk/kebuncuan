"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    images: { url: string }[];
  };
}

export default function CartPage() {
  const params = useParams();
  const storeSlug = params.slug as string;
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/cart?store=${storeSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setCartItems(data.items);
        setLoading(false);
      });
  }, [storeSlug]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) throw new Error("Failed to update quantity");

      // Refresh cart items
      const data = await res.json();
      setCartItems(data.items);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to remove item");

      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link href={`/domain/${storeSlug}/products`}>
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border rounded-lg"
              >
                <div className="relative w-24 h-24">
                  <Image
                    src={item.product.images[0]?.url || "/images/product-placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatRupiah(item.product.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatRupiah(totalPrice)}</span>
                  </div>
                </div>
              </div>
              <Link href={`/domain/${storeSlug}/checkout`}>
                <Button className="w-full mt-6">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
