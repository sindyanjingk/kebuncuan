"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ImageUploader } from "@/components/ui/image-uploader"

type Store = {
  id: string
  name: string
  slug: string
  template: any
}

interface CustomizationFormProps {
  store: Store
}

export function CustomizationForm({ store }: CustomizationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [settings, setSettings] = useState({
    // Brand Settings
    brand: {
      logoUrl: "",
      faviconUrl: "",
      storeName: store.name
    },
    
    // Hero Section Settings
    hero: {
      enabled: true,
      headline: store.template?.heroConfig?.headline || "Selamat Datang di {storeName}",
      subheadline: store.template?.heroConfig?.subheadline || "Platform terpercaya untuk kebutuhan Anda",
      ctaText: store.template?.heroConfig?.ctaText || "Mulai Belanja",
      backgroundColor: "#3B82F6", // blue-600
      textColor: "#FFFFFF",
      backgroundType: "gradient"
    },
    
    // Products Section Settings
    products: {
      enabled: true,
      title: "Produk Pilihan Terbaik",
      subtitle: "Koleksi eksklusif produk berkualitas tinggi dengan harga terbaik",
      showBadge: true,
      badgeText: "🔥 Trending Now"
    },
    
    // Features Section Settings
    features: {
      enabled: true,
      title: "Fitur Unggulan Platform",
      subtitle: "Teknologi terdepan untuk pengalaman marketplace yang tak tertandingi",
      backgroundColor: "#3B82F6" // blue-600
    },
    
    // Testimonials Section Settings
    testimonials: {
      enabled: store.template?.socialProofConfig?.showTestimonials || false,
      title: "Apa Kata Mereka?",
      subtitle: "Ribuan pelanggan telah merasakan pengalaman berbelanja yang luar biasa",
      showStats: store.template?.socialProofConfig?.showStats || false
    },
    
    // About Section Settings
    about: {
      enabled: true,
      title: "Berbelanja Lebih Mudah & Aman",
      subtitle: "Kami menghadirkan pengalaman berbelanja online yang tak terlupakan dengan komitmen kualitas dan kepuasan pelanggan."
    },
    
    // Newsletter Section Settings
    newsletter: {
      enabled: true,
      title: "🎉 Jangan Sampai Ketinggalan!",
      subtitle: "Dapatkan update promo eksklusif, launching produk terbaru, dan tips belanja cerdas"
    },
    
    // General Color Scheme
    colorScheme: {
      primary: "#3B82F6", // blue-600
      secondary: "#8B5CF6", // purple-600
      accent: "#10B981", // emerald-600
      background: "#FFFFFF",
      text: "#1F2937" // gray-800
    }
  })

  // Load existing customization settings
  const loadExistingSettings = async () => {
    try {
      // Load customization settings
      const customizeResponse = await fetch(`/api/store/${store.slug}/customize`)
      if (customizeResponse.ok) {
        const customizeData = await customizeResponse.json()
        if (customizeData.customization) {
          setSettings(prev => ({
            ...prev,
            ...customizeData.customization
          }))
        }
      }

      // Load store brand data
      const storeResponse = await fetch(`/api/store`)
      if (storeResponse.ok) {
        const storeData = await storeResponse.json()
        const currentStore = storeData.stores?.find((s: any) => s.slug === store.slug)
        if (currentStore) {
          setSettings(prev => ({
            ...prev,
            brand: {
              logoUrl: currentStore.logoUrl || "",
              faviconUrl: currentStore.faviconUrl || "",
              storeName: currentStore.name || store.name
            }
          }))
        }
      }
    } catch (error) {
      console.error('Error loading existing settings:', error)
    } finally {
      setIsInitialized(true)
    }
  }

  // Load settings on component mount
  useEffect(() => {
    loadExistingSettings()
  }, [])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat pengaturan...</p>
        </div>
      </div>
    )
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Save customization settings
      const customizeResponse = await fetch(`/api/store/${store.slug}/customize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      // Save brand settings separately
      const brandResponse = await fetch(`/api/store/${store.slug}/branding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings.brand),
      })

      if (customizeResponse.ok && brandResponse.ok) {
        alert('Pengaturan berhasil disimpan!')
      } else {
        throw new Error('Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Terjadi kesalahan saat menyimpan pengaturan')
    } finally {
      setIsLoading(false)
    }
  }

  const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="font-mono"
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="products">Produk</TabsTrigger>
          <TabsTrigger value="features">Fitur</TabsTrigger>
          <TabsTrigger value="about">Tentang</TabsTrigger>
          <TabsTrigger value="testimonials">Testimoni</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="colors">Warna</TabsTrigger>
        </TabsList>



        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>🎯 Hero Section</CardTitle>
                  <CardDescription>Bagian utama yang pertama dilihat pengunjung</CardDescription>
                </div>
                <Switch
                  checked={settings.hero.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, hero: { ...prev.hero, enabled: checked } }))
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-headline">Judul Utama</Label>
                  <Input
                    id="hero-headline"
                    value={settings.hero.headline}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, hero: { ...prev.hero, headline: e.target.value } }))
                    }
                    placeholder="Masukkan judul utama"
                  />
                  <p className="text-xs text-gray-500">Gunakan {"{storeName}"} untuk nama toko</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hero-cta">Teks Tombol</Label>
                  <Input
                    id="hero-cta"
                    value={settings.hero.ctaText}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, hero: { ...prev.hero, ctaText: e.target.value } }))
                    }
                    placeholder="Mulai Belanja"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-subheadline">Subjudul</Label>
                <Textarea
                  id="hero-subheadline"
                  value={settings.hero.subheadline}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, hero: { ...prev.hero, subheadline: e.target.value } }))
                  }
                  placeholder="Deskripsi singkat tentang toko Anda"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPicker
                  label="Warna Background"
                  value={settings.hero.backgroundColor}
                  onChange={(value) => 
                    setSettings(prev => ({ ...prev, hero: { ...prev.hero, backgroundColor: value } }))
                  }
                />
                
                <ColorPicker
                  label="Warna Teks"
                  value={settings.hero.textColor}
                  onChange={(value) => 
                    setSettings(prev => ({ ...prev, hero: { ...prev.hero, textColor: value } }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Section Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>🛍️ Section Produk</CardTitle>
                  <CardDescription>Showcase produk-produk unggulan toko</CardDescription>
                </div>
                <Switch
                  checked={settings.products.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, products: { ...prev.products, enabled: checked } }))
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="products-title">Judul Section</Label>
                  <Input
                    id="products-title"
                    value={settings.products.title}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, products: { ...prev.products, title: e.target.value } }))
                    }
                    placeholder="Judul section produk"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="products-badge">Teks Badge</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.products.showBadge}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, products: { ...prev.products, showBadge: checked } }))
                      }
                    />
                    <Input
                      id="products-badge"
                      value={settings.products.badgeText}
                      onChange={(e) => 
                        setSettings(prev => ({ ...prev, products: { ...prev.products, badgeText: e.target.value } }))
                      }
                      placeholder="🔥 Trending Now"
                      disabled={!settings.products.showBadge}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="products-subtitle">Deskripsi</Label>
                <Textarea
                  id="products-subtitle"
                  value={settings.products.subtitle}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, products: { ...prev.products, subtitle: e.target.value } }))
                  }
                  placeholder="Deskripsi section produk"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Section Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>⚡ Section Fitur</CardTitle>
                  <CardDescription>Highlight fitur-fitur unggulan platform</CardDescription>
                </div>
                <Switch
                  checked={settings.features.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, features: { ...prev.features, enabled: checked } }))
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="features-title">Judul Section</Label>
                  <Input
                    id="features-title"
                    value={settings.features.title}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, features: { ...prev.features, title: e.target.value } }))
                    }
                    placeholder="Judul section fitur"
                  />
                </div>
                
                <ColorPicker
                  label="Warna Background"
                  value={settings.features.backgroundColor}
                  onChange={(value) => 
                    setSettings(prev => ({ ...prev, features: { ...prev.features, backgroundColor: value } }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="features-subtitle">Deskripsi</Label>
                <Textarea
                  id="features-subtitle"
                  value={settings.features.subtitle}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, features: { ...prev.features, subtitle: e.target.value } }))
                  }
                  placeholder="Deskripsi section fitur"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>ℹ️ Section Tentang</CardTitle>
                  <CardDescription>Ceritakan value proposition toko Anda</CardDescription>
                </div>
                <Switch
                  checked={settings.about.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, about: { ...prev.about, enabled: checked } }))
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Judul Section</Label>
                <Input
                  id="about-title"
                  value={settings.about.title}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, about: { ...prev.about, title: e.target.value } }))
                  }
                  placeholder="Judul section tentang"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-subtitle">Deskripsi</Label>
                <Textarea
                  id="about-subtitle"
                  value={settings.about.subtitle}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, about: { ...prev.about, subtitle: e.target.value } }))
                  }
                  placeholder="Deskripsi tentang toko Anda"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section Tab */}
        <TabsContent value="testimonials" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>⭐ Section Testimoni</CardTitle>
                  <CardDescription>Tampilkan review dan testimoni pelanggan</CardDescription>
                </div>
                <Switch
                  checked={settings.testimonials.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, testimonials: { ...prev.testimonials, enabled: checked } }))
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="testimonials-title">Judul Section</Label>
                  <Input
                    id="testimonials-title"
                    value={settings.testimonials.title}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, testimonials: { ...prev.testimonials, title: e.target.value } }))
                    }
                    placeholder="Judul section testimoni"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={settings.testimonials.showStats}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, testimonials: { ...prev.testimonials, showStats: checked } }))
                      }
                    />
                    <Label>Tampilkan Statistik</Label>
                  </div>
                  <p className="text-xs text-gray-500">Menampilkan jumlah pengguna, rating, dll.</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="testimonials-subtitle">Deskripsi</Label>
                <Textarea
                  id="testimonials-subtitle"
                  value={settings.testimonials.subtitle}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, testimonials: { ...prev.testimonials, subtitle: e.target.value } }))
                  }
                  placeholder="Deskripsi section testimoni"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Newsletter Section Tab */}
        <TabsContent value="newsletter" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>📧 Section Newsletter</CardTitle>
                  <CardDescription>Form subscribe untuk email marketing</CardDescription>
                </div>
                <Switch
                  checked={settings.newsletter.enabled}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, newsletter: { ...prev.newsletter, enabled: checked } }))
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newsletter-title">Judul Section</Label>
                <Input
                  id="newsletter-title"
                  value={settings.newsletter.title}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, newsletter: { ...prev.newsletter, title: e.target.value } }))
                  }
                  placeholder="Judul section newsletter"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newsletter-subtitle">Deskripsi</Label>
                <Textarea
                  id="newsletter-subtitle"
                  value={settings.newsletter.subtitle}
                  onChange={(e) => 
                    setSettings(prev => ({ ...prev, newsletter: { ...prev.newsletter, subtitle: e.target.value } }))
                  }
                  placeholder="Deskripsi section newsletter"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Color Scheme Tab */}
        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🎨 Skema Warna</CardTitle>
              <CardDescription>Atur palet warna utama untuk seluruh halaman</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ColorPicker
                  label="Warna Primer"
                  value={settings.colorScheme.primary}
                  onChange={(value) => 
                    setSettings(prev => ({ ...prev, colorScheme: { ...prev.colorScheme, primary: value } }))
                  }
                />
                
                <ColorPicker
                  label="Warna Sekunder"
                  value={settings.colorScheme.secondary}
                  onChange={(value) => 
                    setSettings(prev => ({ ...prev, colorScheme: { ...prev.colorScheme, secondary: value } }))
                  }
                />
                
                <ColorPicker
                  label="Warna Aksen"
                  value={settings.colorScheme.accent}
                  onChange={(value) => 
                    setSettings(prev => ({ ...prev, colorScheme: { ...prev.colorScheme, accent: value } }))
                  }
                />
                
                <ColorPicker
                  label="Warna Background"
                  value={settings.colorScheme.background}
                  onChange={(value) => 
                    setSettings(prev => ({ ...prev, colorScheme: { ...prev.colorScheme, background: value } }))
                  }
                />
                
                <ColorPicker
                  label="Warna Teks"
                  value={settings.colorScheme.text}
                  onChange={(value) => 
                    setSettings(prev => ({ ...prev, colorScheme: { ...prev.colorScheme, text: value } }))
                  }
                />
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-3">Preview Warna</h4>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: settings.colorScheme.primary }}
                    ></div>
                    <span className="text-sm">Primer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: settings.colorScheme.secondary }}
                    ></div>
                    <span className="text-sm">Sekunder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: settings.colorScheme.accent }}
                    ></div>
                    <span className="text-sm">Aksen</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "💾 Simpan Pengaturan"}
        </Button>
      </div>
    </div>
  )
}
