'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { AvatarUpload } from '@/components/profile/avatar-upload'
import { User, MapPin, CreditCard, Eye, EyeOff, Package, Calendar, MapPin as ShippingIcon, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

const profileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().optional(),
})

const addressSchema = z.object({
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  city: z.string().min(2, 'Kota minimal 2 karakter'),
  province: z.string().min(2, 'Provinsi minimal 2 karakter'),
  postalCode: z.string().min(5, 'Kode pos minimal 5 digit'),
  country: z.string().default('Indonesia'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password minimal 6 karakter'),
  newPassword: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak sama",
  path: ["confirmPassword"],
})

interface CustomerProfileClientProps {
  storeSlug: string
}

export function CustomerProfileClient({ storeSlug }: CustomerProfileClientProps) {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    }
  })

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: '',
      city: '',
      province: '',
      postalCode: '',
      country: 'Indonesia',
    }
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  })

  // Load user profile data
  useEffect(() => {
    if (session?.user) {
      profileForm.setValue('name', session.user.name || '')
      profileForm.setValue('email', session.user.email || '')
    }
  }, [session])

  // Load additional profile data from API
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          
          // Update profile form
          profileForm.setValue('name', data.username || '')
          profileForm.setValue('phone', data.phone || '')
          
          // Update address form
          addressForm.setValue('address', data.address || '')
          addressForm.setValue('city', data.city || '')
          addressForm.setValue('province', data.province || '')
          addressForm.setValue('postalCode', data.postalCode || '')
          addressForm.setValue('country', data.country || 'Indonesia')
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      }
    }

    if (session?.user) {
      loadProfile()
    }
  }, [session])

  // Load user orders
  useEffect(() => {
    const loadOrders = async () => {
      setOrdersLoading(true)
      try {
        const response = await fetch('/api/user/orders')
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        }
      } catch (error) {
        console.error('Error loading orders:', error)
        toast.error('Gagal memuat riwayat pesanan')
      } finally {
        setOrdersLoading(false)
      }
    }

    if (session?.user) {
      loadOrders()
    }
  }, [session])

  const onProfileSubmit = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.name,
          phone: data.phone,
        }),
      })

      if (response.ok) {
        toast.success('Profile berhasil diperbarui')
        
        // Update session with new name
        await update({
          ...session,
          user: {
            ...session?.user,
            name: data.name,
          }
        })
      } else {
        toast.error('Gagal memperbarui profile')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const onAddressSubmit = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Alamat berhasil diperbarui')
      } else {
        toast.error('Gagal memperbarui alamat')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const onPasswordSubmit = async (data: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      if (response.ok) {
        toast.success('Password berhasil diubah')
        passwordForm.reset()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal mengubah password')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const processOrder = async (orderId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders/${orderId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        toast.success('Pesanan berhasil diproses')
        // Reload orders to show updated status
        const ordersResponse = await fetch('/api/user/orders')
        if (ordersResponse.ok) {
          const data = await ordersResponse.json()
          setOrders(data.orders || [])
        }
      } else {
        const error = await response.json()
        toast.error(error.error || 'Gagal memproses pesanan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Menunggu</Badge>
      case 'PROCESSING':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Diproses</Badge>
      case 'SHIPPED':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Dikirim</Badge>
      case 'SUCCESS':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Selesai</Badge>
      case 'FAILED':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Gagal</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading...</h2>
          <p className="text-gray-600">Memuat data profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Saya</h1>
            <p className="text-gray-600 mt-2">Kelola informasi profile dan pengaturan akun Anda</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Alamat
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Pesanan
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Keamanan
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="flex items-center gap-6">
                      <AvatarUpload 
                        username={session.user?.name || session.user?.email || 'User'}
                        imageUrl={session.user?.image}
                        className="w-20 h-20"
                      />
                      <div>
                        <h3 className="font-medium">Foto Profile</h3>
                        <p className="text-sm text-gray-600">Klik pada foto untuk mengubah gambar profile</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                          id="name"
                          {...profileForm.register('name')}
                          className="mt-1"
                        />
                        {profileForm.formState.errors.name && (
                          <p className="text-sm text-red-600 mt-1">
                            {profileForm.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...profileForm.register('email')}
                          disabled
                          className="mt-1 bg-gray-50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          {...profileForm.register('phone')}
                          placeholder="+62 812 3456 7890"
                          className="mt-1"
                        />
                        {profileForm.formState.errors.phone && (
                          <p className="text-sm text-red-600 mt-1">
                            {profileForm.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Simpan Profile'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Alamat Pengiriman</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="address">Alamat Lengkap</Label>
                      <Input
                        id="address"
                        {...addressForm.register('address')}
                        placeholder="Jl. Contoh No. 123, RT/RW 01/02"
                        className="mt-1"
                      />
                      {addressForm.formState.errors.address && (
                        <p className="text-sm text-red-600 mt-1">
                          {addressForm.formState.errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Kota</Label>
                        <Input
                          id="city"
                          {...addressForm.register('city')}
                          placeholder="Jakarta"
                          className="mt-1"
                        />
                        {addressForm.formState.errors.city && (
                          <p className="text-sm text-red-600 mt-1">
                            {addressForm.formState.errors.city.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="province">Provinsi</Label>
                        <Input
                          id="province"
                          {...addressForm.register('province')}
                          placeholder="DKI Jakarta"
                          className="mt-1"
                        />
                        {addressForm.formState.errors.province && (
                          <p className="text-sm text-red-600 mt-1">
                            {addressForm.formState.errors.province.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="postalCode">Kode Pos</Label>
                        <Input
                          id="postalCode"
                          {...addressForm.register('postalCode')}
                          placeholder="12345"
                          className="mt-1"
                        />
                        {addressForm.formState.errors.postalCode && (
                          <p className="text-sm text-red-600 mt-1">
                            {addressForm.formState.errors.postalCode.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Negara</Label>
                      <Select defaultValue="Indonesia" disabled>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Indonesia">Indonesia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Menyimpan...' : 'Simpan Alamat'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Pesanan</CardTitle>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span className="ml-2">Memuat pesanan...</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Pesanan</h3>
                      <p className="text-gray-600">Anda belum memiliki riwayat pesanan apapun.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="border border-gray-200">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="font-semibold text-lg">{order.product.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  Toko: {order.product.store.name}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(order.createdAt)}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Package className="h-4 w-4" />
                                    ID: {order.id.slice(-8)}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                {getStatusBadge(order.status)}
                                <p className="text-lg font-semibold mt-2">
                                  {formatCurrency(order.product.price)}
                                </p>
                              </div>
                            </div>

                            {/* Shipping Information */}
                            {order.shipping.required && (
                              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <ShippingIcon className="h-4 w-4 text-gray-600" />
                                  <span className="font-medium text-sm">Informasi Pengiriman</span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p><strong>Nama:</strong> {order.shipping.name}</p>
                                  <p><strong>Alamat:</strong> {order.shipping.address}</p>
                                  <p><strong>Kota:</strong> {order.shipping.city}, {order.shipping.province} {order.shipping.postal_code}</p>
                                  <p><strong>Telepon:</strong> {order.shipping.phone}</p>
                                  {order.shipping.courier && (
                                    <p><strong>Kurir:</strong> {order.shipping.courier} - {order.shipping.service}</p>
                                  )}
                                  {order.shipping.cost && (
                                    <p><strong>Ongkir:</strong> {formatCurrency(order.shipping.cost)}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Payment Information */}
                            {order.payment && (
                              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <CreditCard className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium text-sm">Informasi Pembayaran</span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p><strong>Status:</strong> {order.payment.status}</p>
                                  <p><strong>Metode:</strong> {order.payment.method || 'Midtrans'}</p>
                                  {order.payment.amount && (
                                    <p><strong>Jumlah:</strong> {formatCurrency(order.payment.amount)}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Shipment Tracking */}
                            {order.shipment && (
                              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="h-4 w-4 text-purple-600" />
                                  <span className="font-medium text-sm">Tracking Pengiriman</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  <p><strong>Resi:</strong> {order.shipment.trackingNumber}</p>
                                  <p><strong>Status:</strong> {order.shipment.status}</p>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            {order.status === 'PENDING' && order.payment && order.payment.status === 'PAID' && (
                              <div className="flex justify-end pt-4 border-t">
                                <Button 
                                  onClick={() => processOrder(order.id)}
                                  disabled={loading}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  {loading ? 'Memproses...' : 'Proses Pesanan'}
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Ubah Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <div>
                      <Label htmlFor="currentPassword">Password Saat Ini</Label>
                      <div className="relative mt-1">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          {...passwordForm.register('currentPassword')}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {passwordForm.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="newPassword">Password Baru</Label>
                      <div className="relative mt-1">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          {...passwordForm.register('newPassword')}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                      <div className="relative mt-1">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...passwordForm.register('confirmPassword')}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">
                          {passwordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Mengubah...' : 'Ubah Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
