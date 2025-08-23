"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Check } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  emoji?: string;
}

export function BuyButton({ 
  product, 
  disabled, 
  session 
}: { 
  product: Product; 
  disabled?: boolean; 
  session?: any;
}) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(product.id, 1);
      
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e: any) {
      console.error("Failed to add to cart:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) return null;

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading || disabled || added}
      className={`transition-all duration-200 ${
        added 
          ? "bg-green-600 hover:bg-green-700" 
          : "bg-purple-600 hover:bg-purple-700"
      }`}
    >
      {loading ? (
        "Adding..."
      ) : added ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
