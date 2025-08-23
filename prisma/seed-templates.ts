import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedTemplates() {
  console.log('🌱 Seeding templates...')

  // Template 1: Marketplace Modern
  const marketplaceTemplate = await prisma.template.upsert({
    where: { id: 'marketplace-modern' },
    update: {},
    create: {
      id: 'marketplace-modern',
      name: 'Marketplace Modern',
      category: 'MARKETPLACE',
      description: 'Template marketplace modern dengan fokus pada trust dan kemudahan berbelanja',
      previewImage: '/templates/marketplace-modern-preview.jpg',
      thumbnailImage: '/templates/marketplace-modern-thumb.jpg',
      isActive: true,
      isPremium: false,
      price: 0,
      features: {
        hero: true,
        valueProposition: true,
        showcase: true,
        socialProof: true,
        features: true,
        security: true,
        newsletter: true,
        multiDevice: true
      },
      config: {
        layout: 'modern',
        colorScheme: 'blue',
        sections: ['hero', 'features', 'showcase', 'testimonials', 'security', 'cta']
      },
      heroConfig: {
        create: {
          headline: 'Belanja mudah, aman, dan cepat.',
          subheadline: 'Platform marketplace terpercaya dengan ribuan produk berkualitas dan sistem pembayaran yang aman.',
          ctaText: 'Mulai Belanja Sekarang',
          ctaUrl: '/products',
          backgroundImage: '/images/hero-marketplace.jpg',
          overlayOpacity: 0.4,
          textAlignment: 'center',
          showStats: true
        }
      },
      featuresConfig: {
        create: [
          {
            title: 'Pembayaran Aman',
            description: 'Sistem escrow dan berbagai metode pembayaran yang aman dan terpercaya',
            icon: '🔒',
            order: 1
          },
          {
            title: 'Gratis Ongkir',
            description: 'Gratis ongkos kirim untuk pembelian di atas Rp 50.000',
            icon: '🚚',
            order: 2
          },
          {
            title: 'Chat Langsung',
            description: 'Komunikasi langsung dengan penjual untuk tanya jawab produk',
            icon: '💬',
            order: 3
          },
          {
            title: 'Tracking Real-time',
            description: 'Lacak pengiriman produk Anda secara real-time',
            icon: '📱',
            order: 4
          }
        ]
      },
      socialProofConfig: {
        create: {
          showTestimonials: true,
          showPartnerLogos: true,
          showUserCount: true,
          showRatings: true,
          userCountText: 'Dipercaya 10.000+ pengguna',
          averageRating: 4.8,
          totalReviews: 2500,
          testimonials: {
            create: [
              {
                customerName: 'Sarah Wijaya',
                customerTitle: 'Ibu Rumah Tangga',
                content: 'Belanja di sini sangat mudah dan aman. Produk selalu sampai tepat waktu!',
                rating: 5,
                order: 1
              },
              {
                customerName: 'Budi Santoso',
                customerTitle: 'Pengusaha',
                content: 'Sistem pembayarannya sangat aman dan customer service responsif.',
                rating: 5,
                order: 2
              }
            ]
          }
        }
      }
    }
  })

  // Template 2: E-commerce Fashion
  const fashionTemplate = await prisma.template.upsert({
    where: { id: 'fashion-elegance' },
    update: {},
    create: {
      id: 'fashion-elegance',
      name: 'Fashion Elegance',
      category: 'FASHION',
      description: 'Template khusus untuk toko fashion dengan desain elegan dan modern',
      previewImage: '/templates/fashion-elegance-preview.jpg',
      thumbnailImage: '/templates/fashion-elegance-thumb.jpg',
      isActive: true,
      isPremium: true,
      price: 99000,
      features: {
        hero: true,
        lookbook: true,
        collections: true,
        socialProof: true,
        features: true,
        newsletter: true,
        instagram: true
      },
      config: {
        layout: 'fashion',
        colorScheme: 'black-gold',
        sections: ['hero', 'collections', 'lookbook', 'testimonials', 'instagram', 'newsletter']
      },
      heroConfig: {
        create: {
          headline: 'Fashion Terkini untuk Gaya Hidup Modern',
          subheadline: 'Koleksi pakaian dan aksesoris terbaru dengan kualitas premium dan desain yang mengikuti tren terkini.',
          ctaText: 'Lihat Koleksi',
          ctaUrl: '/collections',
          backgroundImage: '/images/hero-fashion.jpg',
          overlayOpacity: 0.3,
          textAlignment: 'left',
          showStats: true
        }
      },
      featuresConfig: {
        create: [
          {
            title: 'Kualitas Premium',
            description: 'Semua produk telah melalui quality control ketat',
            icon: '✨',
            order: 1
          },
          {
            title: 'Fashion Terkini',
            description: 'Selalu update dengan tren fashion terbaru',
            icon: '👗',
            order: 2
          },
          {
            title: 'Size Guide',
            description: 'Panduan ukuran lengkap untuk semua produk',
            icon: '📏',
            order: 3
          },
          {
            title: 'Easy Return',
            description: 'Kemudahan tukar barang dalam 7 hari',
            icon: '🔄',
            order: 4
          }
        ]
      },
      socialProofConfig: {
        create: {
          showTestimonials: true,
          showPartnerLogos: false,
          showUserCount: true,
          showRatings: true,
          userCountText: 'Dipercaya 5.000+ fashion enthusiast',
          averageRating: 4.9,
          totalReviews: 800,
          testimonials: {
            create: [
              {
                customerName: 'Maya Fashion',
                customerTitle: 'Fashion Blogger',
                content: 'Koleksinya selalu up to date dan kualitasnya sangat bagus!',
                rating: 5,
                order: 1
              }
            ]
          }
        }
      }
    }
  })

  // Template 3: Food & Beverage
  const foodTemplate = await prisma.template.upsert({
    where: { id: 'food-delight' },
    update: {},
    create: {
      id: 'food-delight',
      name: 'Food Delight',
      category: 'FOOD',
      description: 'Template untuk bisnis makanan dan minuman dengan tampilan yang menggugah selera',
      previewImage: '/templates/food-delight-preview.jpg',
      thumbnailImage: '/templates/food-delight-thumb.jpg',
      isActive: true,
      isPremium: false,
      price: 0,
      features: {
        hero: true,
        menu: true,
        gallery: true,
        delivery: true,
        reviews: true,
        contact: true
      },
      config: {
        layout: 'food',
        colorScheme: 'warm',
        sections: ['hero', 'menu', 'gallery', 'delivery', 'reviews', 'contact']
      },
      heroConfig: {
        create: {
          headline: 'Cita Rasa Otentik yang Tak Terlupakan',
          subheadline: 'Nikmati kelezatan makanan tradisional dan modern dengan bahan-bahan segar pilihan.',
          ctaText: 'Pesan Sekarang',
          ctaUrl: '/menu',
          backgroundImage: '/images/hero-food.jpg',
          overlayOpacity: 0.5,
          textAlignment: 'center',
          showStats: true
        }
      },
      featuresConfig: {
        create: [
          {
            title: 'Bahan Segar',
            description: 'Menggunakan bahan-bahan segar pilihan setiap hari',
            icon: '🥬',
            order: 1
          },
          {
            title: 'Delivery Cepat',
            description: 'Pengiriman dalam 30 menit di area terdekat',
            icon: '🛵',
            order: 2
          },
          {
            title: 'Halal Certified',
            description: 'Semua produk bersertifikat halal MUI',
            icon: '🏅',
            order: 3
          },
          {
            title: 'Hygiene Standard',
            description: 'Standar kebersihan dan keamanan pangan tinggi',
            icon: '🧼',
            order: 4
          }
        ]
      },
      socialProofConfig: {
        create: {
          showTestimonials: true,
          showPartnerLogos: false,
          showUserCount: true,
          showRatings: true,
          userCountText: 'Melayani 2.000+ pelanggan setiap bulan',
          averageRating: 4.7,
          totalReviews: 1500,
          testimonials: {
            create: [
              {
                customerName: 'Andi Kurniawan',
                customerTitle: 'Food Lover',
                content: 'Rasanya authentic banget dan pelayanannya cepat!',
                rating: 5,
                order: 1
              }
            ]
          }
        }
      }
    }
  })

  console.log('✅ Templates seeded successfully!')
  console.log(`- ${marketplaceTemplate.name}`)
  console.log(`- ${fashionTemplate.name}`)
  console.log(`- ${foodTemplate.name}`)
}

async function main() {
  try {
    await seedTemplates()
  } catch (error) {
    console.error('❌ Error seeding templates:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default seedTemplates
