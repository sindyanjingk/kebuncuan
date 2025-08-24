"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Trash2, AlertTriangle, Store, MapPin, Save, Truck, Key, Globe, CheckCircle, XCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ImageUploader } from '@/components/ui/image-uploader'

interface StoreSettings {
  name: string
  logoUrl: string
  faviconUrl: string
  address: string
  city: string
  province: string
  postalCode: string
  phone: string
}

interface ShippingProvider {
  id: string
  is_active: boolean
  origin_area_id: string | null
  monthly_usage: number
  quota_limit: number
}

export default function StoreSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const storeSlug = params.store as string
  
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Shipping states
  const [shippingProvider, setShippingProvider] = useState<ShippingProvider | null>(null)
  const [isShippingSaving, setIsShippingSaving] = useState(false)
  const [originAreaId, setOriginAreaId] = useState('')
  
  const [settings, setSettings] = useState<StoreSettings>({
    name: '',
    logoUrl: '',
    faviconUrl: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: ''
  })

  // Load existing store data
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        const response = await fetch(`/api/store?slug=${storeSlug}`)
        if (response.ok) {
          const { store } = await response.json()
          setSettings({
            name: store.name || '',
            logoUrl: store.logoUrl || '',
            faviconUrl: store.faviconUrl || '',
            address: store.address || '',
            city: store.city || '',
            province: store.province || '',
            postalCode: store.postalCode || '',
            phone: store.phone || ''
          })
        }
      } catch (error) {
        console.error('Error loading store data:', error)
      }
    }

    const loadShippingData = async () => {
      try {
        const response = await fetch(`/api/store/${storeSlug}/shipping`)
        if (response.ok) {
          const { shippingProvider } = await response.json()
          if (shippingProvider) {
            setShippingProvider(shippingProvider)
            setOriginAreaId(shippingProvider.origin_area_id || '')
          }
        }
      } catch (error) {
        console.error('Error loading shipping data:', error)
      }
    }

    loadStoreData()
    loadShippingData()
  }, [storeSlug])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/store/${storeSlug}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert('Pengaturan berhasil disimpan!')
      } else {
        const error = await response.json()
        alert(error.error || 'Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Terjadi kesalahan saat menyimpan pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveShipping = async () => {
    setIsShippingSaving(true)
    try {
      const method = shippingProvider ? 'PUT' : 'POST'
      const response = await fetch(`/api/store/${storeSlug}/shipping`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin_area_id: originAreaId,
          is_active: true
        }),
      })

      if (response.ok) {
        const { shippingProvider: newProvider } = await response.json()
        setShippingProvider(newProvider)
        alert('Konfigurasi pengiriman berhasil disimpan!')
      } else {
        const error = await response.json()
        alert(error.error || 'Gagal menyimpan konfigurasi pengiriman')
      }
    } catch (error) {
      console.error('Error saving shipping:', error)
      alert('Terjadi kesalahan saat menyimpan konfigurasi pengiriman')
    } finally {
      setIsShippingSaving(false)
    }
  }

  const handleToggleShipping = async () => {
    if (!shippingProvider) return
    
    setIsShippingSaving(true)
    try {
      const response = await fetch(`/api/store/${storeSlug}/shipping`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !shippingProvider.is_active
        }),
      })

      if (response.ok) {
        const { shippingProvider: updatedProvider } = await response.json()
        setShippingProvider(updatedProvider)
      }
    } catch (error) {
      console.error('Error toggling shipping:', error)
    } finally {
      setIsShippingSaving(false)
    }
  }

  const handleDeleteStore = async () => {
    if (confirmationText !== storeSlug) {
      alert('Nama toko tidak sesuai!')
      return
    }

    setIsDeleting(true)
    try {
      // Delete the store using the slug-based endpoint
      const deleteResponse = await fetch(`/api/store/${storeSlug}/delete`, {
        method: 'DELETE'
      })

      if (deleteResponse.ok) {
        alert('Toko berhasil dihapus!')
        router.push('/') // Redirect to home page
      } else {
        const error = await deleteResponse.json()
        alert(error.error || 'Gagal menghapus toko')
      }
    } catch (error) {
      console.error('Error deleting store:', error)
      alert('Terjadi kesalahan saat menghapus toko')
    } finally {
      setIsDeleting(false)
      setConfirmationText('')
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan Toko</h1>
        <p className="text-gray-600">Kelola pengaturan dan konfigurasi toko Anda</p>
      </div>

      {/* Brand Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Identitas Brand
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="storeName">Nama Toko</Label>
            <Input
              id="storeName"
              value={settings.name}
              onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nama toko..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploader
              label="Logo Toko"
              currentImage={settings.logoUrl}
              onImageChange={(url) => setSettings(prev => ({ ...prev, logoUrl: url }))}
              accept="image/*"
              maxSize={5}
              recommended="Rekomendasi: 200x60px, format PNG/SVG dengan background transparan"
            />
            
            <ImageUploader
              label="Favicon"
              currentImage={settings.faviconUrl}
              onImageChange={(url) => setSettings(prev => ({ ...prev, faviconUrl: url }))}
              accept="image/*"
              maxSize={1}
              recommended="Rekomendasi: 32x32px atau 16x16px, format ICO/PNG"
            />
          </div>
        </CardContent>
      </Card>

      {/* Store Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Alamat Toko
          </CardTitle>
          <p className="text-sm text-gray-600">Informasi alamat untuk integrasi pengiriman Biteship</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Jl. Contoh No. 123, RT/RW 01/02, Kelurahan ABC"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Kota</Label>
              <Input
                id="city"
                value={settings.city}
                onChange={(e) => setSettings(prev => ({ ...prev, city: e.target.value }))}
                placeholder="Jakarta"
              />
            </div>
            
            <div>
              <Label htmlFor="province">Provinsi</Label>
              <Input
                id="province"
                value={settings.province}
                onChange={(e) => setSettings(prev => ({ ...prev, province: e.target.value }))}
                placeholder="DKI Jakarta"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">Kode Pos</Label>
              <Input
                id="postalCode"
                value={settings.postalCode}
                onChange={(e) => setSettings(prev => ({ ...prev, postalCode: e.target.value }))}
                placeholder="12345"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="08123456789"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Konfigurasi Pengiriman (Biteship)
            {shippingProvider?.is_active && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!shippingProvider ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Biteship terintegrasi menggunakan API key platform. Anda hanya perlu mengatur area asal pengiriman.
              </p>

              <div>
                <Label htmlFor="origin-area-id" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Origin Area ID (Opsional)
                </Label>
                <Input
                  id="origin-area-id"
                  value={originAreaId}
                  onChange={(e) => setOriginAreaId(e.target.value)}
                  placeholder="ID area asal pengiriman"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Kosongkan jika ingin menggunakan alamat toko sebagai origin
                </p>
              </div>

              <Button 
                onClick={handleSaveShipping}
                disabled={isShippingSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isShippingSaving ? 'Menyimpan...' : 'Aktifkan Biteship'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {shippingProvider.is_active ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">
                      Biteship {shippingProvider.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                </div>
                <Button
                  variant={shippingProvider.is_active ? "destructive" : "default"}
                  size="sm"
                  onClick={handleToggleShipping}
                  disabled={isShippingSaving}
                >
                  {shippingProvider.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="update-origin-area">Origin Area ID</Label>
                  <Input
                    id="update-origin-area"
                    value={originAreaId}
                    onChange={(e) => setOriginAreaId(e.target.value)}
                    placeholder="ID area asal"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Update area asal pengiriman untuk store Anda
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4" />
                  <span>Menggunakan API key platform centralized</span>
                </div>
              </div>

              <Button 
                onClick={handleSaveShipping}
                disabled={isShippingSaving}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isShippingSaving ? 'Menyimpan...' : 'Update Konfigurasi'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Zona Berbahaya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Menghapus toko akan menyembunyikan toko dari publik namun data akan tetap tersimpan. 
              Anda dapat menghubungi support untuk memulihkan toko jika diperlukan.
            </AlertDescription>
          </Alert>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Hapus Toko
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hapus Toko</DialogTitle>
                <DialogDescription>
                  Tindakan ini akan menghapus toko Anda. Meskipun data tidak akan hilang permanen, 
                  toko akan tidak dapat diakses oleh publik.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Peringatan:</strong> Setelah dihapus, toko tidak akan dapat diakses oleh pelanggan. 
                    Produk, pesanan, dan data lainnya akan tetap tersimpan untuk keperluan administrasi.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <Label htmlFor="confirmation">
                    Ketik <strong>{storeSlug}</strong> untuk mengkonfirmasi penghapusan:
                  </Label>
                  <Input
                    id="confirmation"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder={`Ketik ${storeSlug} di sini...`}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsDialogOpen(false)
                    setConfirmationText('')
                  }}
                >
                  Batal
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteStore}
                  disabled={confirmationText !== storeSlug || isDeleting}
                >
                  {isDeleting ? 'Menghapus...' : 'Hapus Toko'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
