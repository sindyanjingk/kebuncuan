"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah } from "@/lib/utils";
import { ArrowLeft, ShoppingBag, CreditCard, Truck, MapPin, User } from "lucide-react";
import { useState, useEffect } from "react";
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
  store: {
    id: string;
    name: string;
    address: string | null;
    city: string | null;
    province: string | null;
    postalCode: string | null;
  };
}

interface ShippingOption {
  courier_company: string;
  courier_type: string;
  price: number;
  duration: string;
  description: string;
}

export function CheckoutClient({ initialCart, storeSlug, initialUser, store }: CheckoutClientProps) {
  const router = useRouter();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    notes: ""
  });

  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Load user profile
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
          
          // Pre-fill form with profile data if available
          if (profile) {
            setCustomerInfo(prev => ({
              ...prev,
              name: profile.username || prev.name,
              phone: profile.phone || prev.phone,
              address: profile.address || prev.address,
              city: profile.city || prev.city,
              province: profile.province || prev.province,
              postalCode: profile.postalCode || prev.postalCode,
            }));
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  // Calculate shipping rates when customer address changes
  useEffect(() => {
    const calculateShipping = async () => {
      if (!customerInfo.city || !customerInfo.postalCode) {
        setShippingOptions([]);
        setSelectedShipping(null);
        return;
      }

      setIsLoadingShipping(true);
      try {
        const response = await fetch('/api/shipping/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            origin: {
              area_id: store.city || '', // You might need to map this to actual area_id
              address: store.address || '',
              postal_code: store.postalCode ? parseInt(store.postalCode) : 0,
            },
            destination: {
              address: customerInfo.address,
              postal_code: parseInt(customerInfo.postalCode),
            },
            items: initialCart.items.map(item => ({
              name: item.product.name,
              value: item.product.price * item.quantity,
              weight: 1000, // Default 1kg per item, you might want to add weight to product model
              quantity: item.quantity,
            })),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setShippingOptions(data.couriers || []);
          if (data.couriers && data.couriers.length > 0) {
            setSelectedShipping(data.couriers[0]); // Select first option by default
          }
        } else {
          toast.error('Gagal menghitung ongkos kirim');
        }
      } catch (error) {
        console.error('Error calculating shipping:', error);
        toast.error('Gagal menghitung ongkos kirim');
      } finally {
        setIsLoadingShipping(false);
      }
    };

    const timeoutId = setTimeout(calculateShipping, 1000); // Debounce
    return () => clearTimeout(timeoutId);
  }, [customerInfo.city, customerInfo.postalCode, customerInfo.address]);

  const getTotalPrice = () => {
    return initialCart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return initialCart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getShippingCost = () => {
    return selectedShipping ? selectedShipping.price : 0;
  };

  const getTax = () => {
    return getTotalPrice() * 0.1; // 10% tax
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getShippingCost() + getTax();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast.error("Silakan lengkapi semua informasi yang diperlukan");
      return;
    }

    if (!selectedShipping) {
      toast.error("Silakan pilih metode pengiriman");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order with Midtrans payment
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeSlug,
          customerInfo,
          shipping: selectedShipping,
          items: initialCart.items,
          totals: {
            subtotal: getTotalPrice(),
            shipping: getShippingCost(),
            tax: getTax(),
            total: getFinalTotal(),
          },
          usesMidtrans: true,
        }),
      });

      if (response.ok) {
        const orderData = await response.json();
        
        if (orderData.payment && orderData.payment.token) {
          // Load Midtrans Snap
          const script = document.createElement('script');
          script.src = process.env.NODE_ENV === 'production' 
            ? 'https://app.midtrans.com/snap/snap.js' 
            : 'https://app.sandbox.midtrans.com/snap/snap.js';
          script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
          
          script.onload = () => {
            // @ts-ignore
            window.snap.pay(orderData.payment.token, {
              onSuccess: function(result: any) {
                console.log('Payment success:', result);
                toast.success("Pembayaran berhasil!");
                router.push(`/payment/finish?order_id=${result.order_id}&status_code=${result.status_code}&transaction_status=${result.transaction_status}`);
              },
              onPending: function(result: any) {
                console.log('Payment pending:', result);
                toast.info("Pembayaran pending, silakan selesaikan pembayaran");
                router.push(`/payment/pending?order_id=${result.order_id}`);
              },
              onError: function(result: any) {
                console.log('Payment error:', result);
                toast.error("Pembayaran gagal!");
                router.push(`/payment/error?order_id=${result.order_id}`);
              },
              onClose: function() {
                console.log('Payment closed');
                toast.info("Jendela pembayaran ditutup");
              }
            });
          };
          
          document.head.appendChild(script);
        } else {
          // No payment token - show success message and redirect
          toast.success(orderData.message || "Pesanan berhasil dibuat!");
          
          // Redirect to a success page or store page
          setTimeout(() => {
            router.push(`/domain/${storeSlug}/home`);
          }, 2000);
        }
      } else {
        throw new Error('Gagal membuat pesanan');
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUseProfile = () => {
    if (userProfile) {
      setCustomerInfo(prev => ({
        ...prev,
        name: userProfile.username || prev.name,
        phone: userProfile.phone || prev.phone,
        address: userProfile.address || prev.address,
        city: userProfile.city || prev.city,
        province: userProfile.province || prev.province,
        postalCode: userProfile.postalCode || prev.postalCode,
      }));
      toast.success("Data profil berhasil dimuat");
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
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Informasi Pelanggan
                      </div>
                      {userProfile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleUseProfile}
                        >
                          Gunakan Data Profil
                        </Button>
                      )}
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
                      <MapPin className="w-5 h-5" />
                      Alamat Pengiriman
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Alamat Lengkap *</Label>
                      <Textarea
                        id="address"
                        placeholder="Masukkan alamat lengkap"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Kota *</Label>
                        <Input
                          id="city"
                          placeholder="Jakarta"
                          value={customerInfo.city}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="province">Provinsi *</Label>
                        <Input
                          id="province"
                          placeholder="DKI Jakarta"
                          value={customerInfo.province}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, province: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Kode Pos *</Label>
                        <Input
                          id="postalCode"
                          placeholder="12345"
                          value={customerInfo.postalCode}
                          onChange={(e) => setCustomerInfo(prev => ({ ...prev, postalCode: e.target.value }))}
                          required
                        />
                      </div>
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

                {/* Shipping Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Metode Pengiriman
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingShipping ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <span className="ml-2">Menghitung ongkos kirim...</span>
                      </div>
                    ) : shippingOptions.length > 0 ? (
                      <div className="space-y-3">
                        {shippingOptions.map((option, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedShipping === option
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedShipping(option)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <div className={`w-4 h-4 rounded-full border-2 ${
                                    selectedShipping === option
                                      ? 'border-purple-500 bg-purple-500'
                                      : 'border-gray-300'
                                  }`}>
                                    {selectedShipping === option && (
                                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">
                                      {option.courier_company} - {option.courier_type}
                                    </h4>
                                    <p className="text-sm text-gray-600">{option.description}</p>
                                    <p className="text-sm text-gray-500">Estimasi: {option.duration}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-medium text-lg">{formatRupiah(option.price)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {customerInfo.city && customerInfo.postalCode
                          ? 'Tidak ada opsi pengiriman tersedia untuk alamat ini'
                          : 'Masukkan alamat lengkap untuk melihat opsi pengiriman'
                        }
                      </div>
                    )}
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
                        <span className="text-gray-600">Ongkos Kirim</span>
                        <span className="font-medium">
                          {selectedShipping ? formatRupiah(getShippingCost()) : 'Pilih metode pengiriman'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pajak (10%)</span>
                        <span className="font-medium">{formatRupiah(getTax())}</span>
                      </div>
                      
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-lg font-semibold text-purple-600">
                            {formatRupiah(getFinalTotal())}
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
