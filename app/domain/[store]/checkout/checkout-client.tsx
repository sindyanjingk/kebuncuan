"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatRupiah } from "@/lib/utils";
import { ArrowLeft, ShoppingBag, CreditCard, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CheckoutClientProps {
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
  initialUser: {
    name?: string | null;
    email?: string | null;
  };
}

export function CheckoutClient({ initialCart, storeSlug, initialUser }: CheckoutClientProps) {
  const router = useRouter();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone: "",
    address: "",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTotalPrice = () => {
    return initialCart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return initialCart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast.error("Silakan lengkapi semua informasi yang diperlukan");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically create an order in your database
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Pesanan berhasil dibuat!");
      router.push(`/`);
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/cart`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Keranjang
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-600 mt-1">Selesaikan pesanan Anda</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Informasi Pelanggan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nama Lengkap *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Nomor Telepon *</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Alamat Pengiriman
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Alamat Lengkap *</Label>
                      <Textarea
                        id="address"
                        placeholder="Masukkan alamat lengkap termasuk kode pos"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Catatan khusus untuk pesanan Anda"
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Ringkasan Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {initialCart.items.map((cartItem) => (
                        <div key={cartItem.id} className="flex gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                            {cartItem.product.images?.[0]?.url ? (
                              <Image
                                src={cartItem.product.images[0].url}
                                alt={cartItem.product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <ShoppingBag className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate">{cartItem.product.name}</h4>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>{cartItem.quantity}x</span>
                              <span>{formatRupiah(cartItem.product.price * cartItem.quantity)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <hr />

                    {/* Price Breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal ({getTotalItems()} item)</span>
                        <span className="font-medium">{formatRupiah(getTotalPrice())}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pajak (10%)</span>
                        <span className="font-medium">{formatRupiah(getTotalPrice() * 0.1)}</span>
                      </div>
                      
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-lg font-semibold text-purple-600">
                            {formatRupiah(getTotalPrice() * 1.1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Memproses..." : "Buat Pesanan"}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Dengan melanjutkan, Anda menyetujui syarat dan ketentuan kami
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
