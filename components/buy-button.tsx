"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function BuyButton({ productId, disabled, session }: { productId: string; disabled?: boolean; session?: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleBuy = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Gagal membuat pesanan");
      setSuccess("Pesanan berhasil dibuat!");
    } catch (e: any) {
      setError(e.message || "Gagal membuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) return null;

  return (
    <div className="flex flex-col gap-1">
      <Button
        onClick={handleBuy}
        disabled={loading || disabled}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {loading ? "Memproses..." : "Beli"}
      </Button>
      {success && <span className="text-blue-600 text-xs">{success}</span>}
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
