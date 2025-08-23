import React from 'react'
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { LoginModal } from "@/components/auth-modals"
import { StoreRegisterModal } from "@/components/store-register-modal"
import { StoreAuthStatus } from "@/components/store-auth-status"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BuyButton } from '@/components/buy-button'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Page({ params }: { params: { store: string } }) {
  const store = await prisma.store.findUnique({
    where: { slug: params.store },
    include: { 
      products: { include: { category: true } },
      settings: true,
      template: {
        include: {
          heroConfig: true,
          featuresConfig: {
            where: { isActive: true },
            orderBy: { order: 'asc' }
          },
          socialProofConfig: {
            include: {
              testimonials: {
                where: { isActive: true },
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      }
    },
  });
  
  if (!store) return notFound();

  const session = await getServerSession(authOptions)

  // Default store view (if no template)
  if (!store.template) {
    return (
      <main className="flex flex-col items-center min-h-screen py-10 px-4 bg-gradient-to-br from-green-50 to-white">
        <div className="w-full max-w-3xl flex flex-col items-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-700 mb-2 drop-shadow">{store.name}</h1>
          <p className="text-muted-foreground mb-4">Toko: {store.slug}</p>
          {session ?
            <StoreAuthStatus session={session} /> :
            <div className="flex gap-4 mt-2">
              <LoginModal />
              <StoreRegisterModal />
            </div>
          }
        </div>
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {store.products.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">Belum ada produk</div>
          ) : (
            store.products.map((product) => (
              <div key={product.id} className="flex flex-col">
                <div className="rounded-2xl border bg-white/80 shadow-lg hover:shadow-2xl transition p-6 flex flex-col h-full group">
                  <div className="font-bold text-lg mb-1 group-hover:text-green-700 transition">{product.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{product.category?.name || '-'}</div>
                  <div className="font-extrabold text-green-700 text-xl mb-2">Rp {product.price.toLocaleString('id-ID')}</div>
                  <div className="flex-1 text-sm mb-3 text-gray-700">{product.description}</div>
                  <div className="mt-auto flex gap-2 items-center">
                    <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{product.active ? 'Aktif' : 'Nonaktif'}</span>
                    <BuyButton productId={product.id} disabled={!product.active} session={session} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    );
  }

  // Template-based store view
  const template = store.template;
  const heroConfig = template.heroConfig;
  const featuresConfig = template.featuresConfig || [];
  const socialProofConfig = template.socialProofConfig;
  
  // Get customization settings
  const customization = store.settings?.customization as any;
  
  // Apply customization or use defaults
  const settings = {
    hero: {
      enabled: customization?.hero?.enabled !== false,
      headline: customization?.hero?.headline || heroConfig?.headline || "Selamat Datang di {storeName}",
      subheadline: customization?.hero?.subheadline || heroConfig?.subheadline || "Platform terpercaya untuk kebutuhan Anda",
      ctaText: customization?.hero?.ctaText || heroConfig?.ctaText || "Mulai Belanja",
      backgroundColor: customization?.hero?.backgroundColor || "#3B82F6",
      textColor: customization?.hero?.textColor || "#FFFFFF",
    },
    products: {
      enabled: customization?.products?.enabled !== false,
      title: customization?.products?.title || "Produk Pilihan Terbaik",
      subtitle: customization?.products?.subtitle || "Koleksi eksklusif produk berkualitas tinggi dengan harga terbaik",
      showBadge: customization?.products?.showBadge !== false,
      badgeText: customization?.products?.badgeText || "🔥 Trending Now"
    },
    features: {
      enabled: customization?.features?.enabled !== false,
      title: customization?.features?.title || "Fitur Unggulan Platform",
      subtitle: customization?.features?.subtitle || "Teknologi terdepan untuk pengalaman marketplace yang tak tertandingi",
      backgroundColor: customization?.features?.backgroundColor || "#3B82F6"
    },
    about: {
      enabled: customization?.about?.enabled !== false,
      title: customization?.about?.title || "Berbelanja Lebih Mudah & Aman",
      subtitle: customization?.about?.subtitle || "Kami menghadirkan pengalaman berbelanja online yang tak terlupakan dengan komitmen kualitas dan kepuasan pelanggan."
    },
    testimonials: {
      enabled: customization?.testimonials?.enabled !== false && (socialProofConfig?.testimonials?.length || 0) > 0,
      title: customization?.testimonials?.title || "Apa Kata Mereka?",
      subtitle: customization?.testimonials?.subtitle || "Ribuan pelanggan telah merasakan pengalaman berbelanja yang luar biasa",
      showStats: customization?.testimonials?.showStats !== false
    },
    newsletter: {
      enabled: customization?.newsletter?.enabled !== false,
      title: customization?.newsletter?.title || "🎉 Jangan Sampai Ketinggalan!",
      subtitle: customization?.newsletter?.subtitle || "Dapatkan update promo eksklusif, launching produk terbaru, dan tips belanja cerdas"
    },
    colorScheme: {
      primary: customization?.colorScheme?.primary || "#3B82F6",
      secondary: customization?.colorScheme?.secondary || "#8B5CF6",
      accent: customization?.colorScheme?.accent || "#10B981",
      background: customization?.colorScheme?.background || "#FFFFFF",
      text: customization?.colorScheme?.text || "#1F2937"
    }
  };

  return (
    <main className="min-h-screen"
      style={{ 
        backgroundColor: settings.colorScheme.background,
        color: settings.colorScheme.text 
      }}
    >
      {/* Hero Section - Bagian Atas */}
      {settings.hero.enabled && (
        <section 
          className="relative min-h-screen text-white overflow-hidden"
          style={{ 
            background: `linear-gradient(135deg, ${settings.hero.backgroundColor}E6, ${settings.colorScheme.secondary}E6, ${settings.colorScheme.primary}E6)`
          }}
        >
          {/* Floating Header with same gradient */}
          <header 
            className="absolute top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/10"
            style={{ 
              background: `linear-gradient(90deg, ${settings.hero.backgroundColor}E6, ${settings.colorScheme.secondary}E6, ${settings.colorScheme.primary}E6)`
            }}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ color: settings.hero.textColor }}
                  >
                    {store.name.charAt(0)}
                  </div>
                  <span 
                    className="font-bold text-lg"
                    style={{ color: settings.hero.textColor }}
                  >
                    {store.name}
                  </span>
                </div>
                
                <nav className="hidden md:flex items-center gap-6">
                  {settings.products.enabled && (
                    <a href="#products" className="text-white/80 hover:text-white transition-colors font-medium">Produk</a>
                  )}
                  {settings.features.enabled && (
                    <a href="#features" className="text-white/80 hover:text-white transition-colors font-medium">Fitur</a>
                  )}
                  {settings.testimonials.enabled && (
                    <a href="#testimonials" className="text-white/80 hover:text-white transition-colors font-medium">Testimoni</a>
                  )}
                  <a href="#contact" className="text-white/80 hover:text-white transition-colors font-medium">Kontak</a>
                </nav>
                
                <div className="flex items-center gap-3">
                  {session ? (
                    <span className="text-white/80 text-sm">👋 {session.user?.email}</span>
                  ) : (
                    <div className="flex gap-2">
                      <LoginModal />
                      <StoreRegisterModal />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative container mx-auto px-4 py-20 lg:py-32 pt-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-left">
                <div className="mb-6">
                  <Badge className="bg-white/20 text-white border-white/30 mb-4">
                    🔥 Platform Terpercaya
                  </Badge>
                  <h1 
                    className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                    style={{ color: settings.hero.textColor }}
                  >
                    {settings.hero.headline.replace('{storeName}', store.name)}
                  </h1>
                  <p 
                    className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90"
                    style={{ color: settings.hero.textColor }}
                  >
                    {settings.hero.subheadline}
                  </p>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    size="lg" 
                    className="bg-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ 
                      color: settings.colorScheme.primary,
                      backgroundColor: settings.hero.textColor 
                    }}
                  >
                    🚀 {settings.hero.ctaText}
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white font-semibold px-8 py-4 text-lg rounded-full"
                    style={{ 
                      borderColor: settings.hero.textColor,
                      color: settings.hero.textColor,
                    }}
                  >
                    📱 Download App
                  </Button>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 text-center lg:text-left">
                  <div>
                    <div 
                      className="text-3xl font-bold"
                      style={{ color: settings.hero.textColor }}
                    >
                      {store.products.length}+
                    </div>
                    <div 
                      className="text-sm opacity-80"
                      style={{ color: settings.hero.textColor }}
                    >
                      Produk Tersedia
                    </div>
                  </div>
                  <div>
                    <div 
                      className="text-3xl font-bold"
                      style={{ color: settings.hero.textColor }}
                    >
                      1M+
                    </div>
                    <div 
                      className="text-sm opacity-80"
                      style={{ color: settings.hero.textColor }}
                    >
                      Pengguna Aktif
                    </div>
                  </div>
                  <div>
                    <div 
                      className="text-3xl font-bold"
                      style={{ color: settings.hero.textColor }}
                    >
                      4.8★
                    </div>
                    <div 
                      className="text-sm opacity-80"
                      style={{ color: settings.hero.textColor }}
                    >
                      Rating Toko
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Visual */}
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="bg-white rounded-2xl p-6 shadow-2xl">
                    <div className="text-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">{store.name}</h3>
                        <Badge className="bg-green-100 text-green-700">✓ Terverifikasi</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            🛡️
                          </div>
                          <div>
                            <div className="font-semibold">Pembayaran Aman</div>
                            <div className="text-sm text-gray-600">Escrow & Refund Guarantee</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            🚚
                          </div>
                          <div>
                            <div className="font-semibold">Gratis Ongkir</div>
                            <div className="text-sm text-gray-600">Minimum pembelian 50k</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            💬
                          </div>
                          <div>
                            <div className="font-semibold">Chat Real-time</div>
                            <div className="text-sm text-gray-600">Support 24/7</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Value Proposition Section */}
      {settings.about.enabled && (
        <section id="about" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">{/* Left: Content */}
                <div className="space-y-8">
                  <div>
                    <Badge 
                      className="mb-4"
                      style={{ 
                        backgroundColor: `${settings.colorScheme.accent}20`,
                        color: settings.colorScheme.accent 
                      }}
                    >
                      ✨ Mengapa Kami?
                    </Badge>
                    <h2 
                      className="text-4xl md:text-5xl font-bold mb-6"
                      style={{ color: settings.colorScheme.text }}
                    >
                      {settings.about.title.split(' ').map((word: string, index: number) => (
                        <span key={index}>
                          {word === 'Mudah' ? (
                            <span style={{ color: settings.colorScheme.primary }}>{word}</span>
                          ) : word === 'Aman' ? (
                            <span style={{ color: settings.colorScheme.secondary }}>{word}</span>
                          ) : (
                            `${word} `
                          )}
                        </span>
                      ))}
                    </h2>
                    <p 
                      className="text-xl"
                      style={{ color: `${settings.colorScheme.text}80` }}
                    >
                      {settings.about.subtitle}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                {/* Right: Visual */}
                <div className="relative">
                  <div 
                    className="aspect-square rounded-3xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${settings.colorScheme.primary}, ${settings.colorScheme.secondary})`
                    }}
                  >
                    <div className="text-white text-center">
                      <div className="text-6xl mb-4">🛍️</div>
                      <p className="text-xl font-semibold">Shopping Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cara Kerja / How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Cara Kerja Mudah
            </h2>
            <p className="text-xl text-gray-600">
              Hanya 4 langkah untuk mulai berbelanja
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center relative">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Daftar</h3>
              <p className="text-gray-600">Buat akun gratis dalam 1 menit</p>
              {/* Arrow */}
              <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
            </div>
            
            <div className="text-center relative">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Cari Produk</h3>
              <p className="text-gray-600">Temukan produk impian Anda</p>
              <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
            </div>
            
            <div className="text-center relative">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Bayar Aman</h3>
              <p className="text-gray-600">Pilih metode pembayaran favorit</p>
              <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                4
              </div>
              <h3 className="text-xl font-bold mb-2">Terima Barang</h3>
              <p className="text-gray-600">Nikmati produk berkualitas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Showcase Produk */}
      {settings.products.enabled && (
        <section id="products" className="py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              {settings.products.showBadge && (
                <Badge 
                  className="mb-4"
                  style={{ 
                    backgroundColor: `${settings.colorScheme.primary}20`,
                    color: settings.colorScheme.primary 
                  }}
                >
                  {settings.products.badgeText}
                </Badge>
              )}
              <h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ color: settings.colorScheme.text }}
              >
                {settings.products.title}
              </h2>
              <p 
                className="text-xl max-w-3xl mx-auto"
                style={{ color: `${settings.colorScheme.text}80` }}
              >
                {settings.products.subtitle.replace('{storeName}', store.name)}
              </p>
            </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {store.products.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <div className="text-8xl mb-6">🏪</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Toko Sedang Persiapan</h3>
                <p className="text-gray-600 mb-8">Produk amazing akan segera hadir di sini!</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full">
                  🔔 Notify Me
                </Button>
              </div>
            ) : (
              store.products.map((product, index) => (
                <Card key={product.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                      <span className="text-4xl">{index % 2 === 0 ? '🎁' : '⭐'}</span>
                      <div className="absolute top-3 left-3">
                        <Badge variant={product.active ? "default" : "secondary"} className="shadow-sm">
                          {product.active ? '✅ Ready' : '⏳ Soon'}
                        </Badge>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-red-500 text-white animate-pulse">🔥 Best Seller</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-blue-600 font-medium">
                      {product.category?.name || 'Kategori Premium'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          Rp {product.price.toLocaleString('id-ID')}
                        </div>
                        <div className="text-xs text-gray-500">💎 Harga Terbaik</div>
                      </div>
                      <BuyButton productId={product.id} disabled={!product.active} session={session} />
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
                      <span className="flex items-center gap-1">
                        <span>⭐</span> 4.8 (234 review)
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🚚</span> Free shipping
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {store.products.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                size="lg" 
                className="px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ 
                  backgroundColor: settings.colorScheme.primary,
                  color: settings.colorScheme.background 
                }}
              >
                🛍️ Lihat Semua Produk
              </Button>
            </div>
          )}
        </div>
        </section>
      )}

      {/* Fitur Utama Section */}
      {settings.features.enabled && (
        <section 
          id="features" 
          className="py-20 text-white"
          style={{ backgroundColor: settings.features.backgroundColor }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {settings.features.title}
              </h2>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                {settings.features.subtitle}
              </p>
            </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-2">Chat Real-time</h3>
              <p className="text-blue-100 text-sm">Komunikasi langsung dengan penjual, respons instan</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-2">Escrow Payment</h3>
              <p className="text-blue-100 text-sm">Sistem pembayaran aman dengan jaminan uang kembali</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-2">Live Tracking</h3>
              <p className="text-blue-100 text-sm">Pantau pengiriman real-time sampai depan rumah</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-bold mb-2">Loyalty Rewards</h3>
              <p className="text-blue-100 text-sm">Kumpulkan poin setiap transaksi untuk hadiah menarik</p>
            </div>
          </div>
        </div>
        </section>
      )}

      {/* Keamanan & Kepercayaan */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              🛡️ Keamanan Terjamin
            </h2>
            <p className="text-xl text-gray-600">
              Belanja dengan tenang, keamanan adalah prioritas utama kami
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Sertifiasi ISO</h3>
              <p className="text-gray-600 text-sm">Platform bersertifikat internasional untuk keamanan data</p>
            </div>
            
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold mb-2">SSL Encryption</h3>
              <p className="text-gray-600 text-sm">Enkripsi tingkat bank untuk melindungi data pribadi Anda</p>
            </div>
            
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎧</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Support 24/7</h3>
              <p className="text-gray-600 text-sm">Tim customer service siap membantu kapan saja</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials - Lebih Engaging */}
      {socialProofConfig && socialProofConfig.testimonials.length > 0 && (
        <section id="testimonials" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-yellow-100 text-yellow-700 mb-4">⭐ Dipercaya Jutaan User</Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Apa Kata Mereka?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ribuan pelanggan telah merasakan pengalaman berbelanja yang luar biasa
              </p>
            </div>
            
            {/* Trust Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">1M+</div>
                <div className="text-gray-600">Pengguna Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">4.8★</div>
                <div className="text-gray-600">Rating Rata-rata</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">50K+</div>
                <div className="text-gray-600">Review Positif</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600">99.9%</div>
                <div className="text-gray-600">Uptime Server</div>
              </div>
            </div>
            
            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {socialProofConfig.testimonials.slice(0, 6).map((testimonial, index) => (
                <Card key={testimonial.id} className={`bg-gradient-to-br ${
                  index % 3 === 0 ? 'from-blue-50 to-cyan-50' :
                  index % 3 === 1 ? 'from-purple-50 to-pink-50' :
                  'from-green-50 to-emerald-50'
                } border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">★</span>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({testimonial.rating}/5)
                      </span>
                    </div>
                    <p className="text-gray-700 mb-6 italic leading-relaxed">
                      &quot;{testimonial.content}&quot;
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                        {testimonial.customerName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{testimonial.customerName}</div>
                        <div className="text-sm text-gray-600">
                          {testimonial.customerTitle || 'Verified Buyer'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* App Download Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                📱 Download App {store.name}
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Belanja lebih mudah dengan aplikasi mobile. Dapatkan notifikasi promo eksklusif, 
                checkout lebih cepat, dan tracking real-time.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>Push notification untuk promo terbatas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>One-click checkout dengan Face ID</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm">✓</span>
                  </div>
                  <span>Offline mode untuk wishlist</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-xl">
                  <span className="mr-2">📱</span> App Store
                </Button>
                <Button size="lg" className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-xl">
                  <span className="mr-2">🤖</span> Google Play
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="bg-white rounded-2xl p-6 shadow-2xl">
                  <div className="text-gray-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">📱 Mobile App Preview</h3>
                      <Badge className="bg-green-100 text-green-700">Live</Badge>
                    </div>
                    <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">🛍️</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Downloads</span>
                        <span className="font-bold">1M+</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Rating</span>
                        <span className="font-bold">4.8 ⭐</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Size</span>
                        <span className="font-bold">25 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup - Lead Capture */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              🎉 Jangan Sampai Ketinggalan!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Dapatkan update promo eksklusif, launching produk terbaru, dan tips belanja cerdas
            </p>
            
            <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Masukkan email Anda..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold">
                  🚀 Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * Gratis selamanya. Unsubscribe kapan saja. Data aman terlindungi.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-center">
              <div>
                <div className="text-2xl mb-2">🎁</div>
                <div className="text-sm font-semibold">Promo Eksklusif</div>
              </div>
              <div>
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-semibold">Flash Sale Alert</div>
              </div>
              <div>
                <div className="text-2xl mb-2">🆕</div>
                <div className="text-sm font-semibold">Product Launch</div>
              </div>
              <div>
                <div className="text-2xl mb-2">💡</div>
                <div className="text-sm font-semibold">Shopping Tips</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Comprehensive dengan gradient konsisten */}
      <footer id="contact" className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
        {/* Main Footer */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {store.name.charAt(0)}
                  </div>
                  <h3 className="text-2xl font-bold">{store.name}</h3>
                </div>
                <p className="text-blue-100 mb-8 leading-relaxed max-w-md">
                  Platform marketplace terpercaya yang menghadirkan pengalaman berbelanja online 
                  terbaik dengan jaminan keamanan dan kualitas produk terjamin.
                </p>
                
                {/* Social Media */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Ikuti Kami:</h4>
                  <div className="flex space-x-4">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      📘
                    </Button>
                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      📷
                    </Button>
                    <Button size="sm" className="bg-blue-400 hover:bg-blue-500 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      🐦
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      📺
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white">Tautan Cepat</h4>
                <ul className="space-y-3 text-blue-100">
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Tentang Kami</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Cara Berbelanja</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Cara Menjual</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">FAQ</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Karir</a></li>
                </ul>
              </div>
              
              {/* Customer Service */}
              <div>
                <h4 className="font-bold text-lg mb-6 text-white">Layanan Pelanggan</h4>
                <ul className="space-y-3 text-blue-100">
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Pusat Bantuan</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Hubungi Kami</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Metode Pembayaran</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Kebijakan Pengembalian</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Garansi & Klaim</a></li>
                  <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Lacak Pesanan</a></li>
                </ul>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-16 pt-8 border-t border-white/20">
              <div className="text-center">
                <h4 className="font-bold text-xl mb-8 text-white">🏆 Dipercaya & Bersertifikat</h4>
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <span>🛡️</span> SSL Secured
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <span>🏅</span> ISO 27001
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <span>✅</span> Verified Partner
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <span>💳</span> PCI DSS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer dengan gradient yang sama */}
        <div className="bg-gradient-to-r from-black/50 via-blue-950/50 to-purple-950/50 backdrop-blur-sm py-8 border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-blue-100 text-sm text-center md:text-left">
                © 2025 {store.name}. All rights reserved. Made with ❤️ in Indonesia
              </div>
              <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
                <a href="#" className="text-blue-100 hover:text-white transition-colors duration-300">
                  Syarat & Ketentuan
                </a>
                <a href="#" className="text-blue-100 hover:text-white transition-colors duration-300">
                  Kebijakan Privasi
                </a>
                <a href="#" className="text-blue-100 hover:text-white transition-colors duration-300">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}