import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedAllTemplates() {
  console.log('🌱 Seeding all templates for tenants...')

  // Template 1: Marketplace Modern (Free)
  const marketplaceTemplate = await prisma.template.upsert({
    where: { id: 'marketplace-modern' },
    update: {},
    create: {
      id: 'marketplace-modern',
      name: 'Marketplace Modern',
      category: 'MARKETPLACE',
      description: 'Template marketplace modern dengan fokus pada trust dan kemudahan berbelanja. Cocok untuk multi-vendor marketplace.',
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
        multiDevice: true,
        search: true,
        categories: true
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

  // Template 2: Fashion Elegance (Premium)
  const fashionTemplate = await prisma.template.upsert({
    where: { id: 'fashion-elegance' },
    update: {},
    create: {
      id: 'fashion-elegance',
      name: 'Fashion Elegance',
      category: 'FASHION',
      description: 'Template khusus untuk toko fashion dengan desain elegan dan modern. Dilengkapi lookbook dan size guide.',
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
        instagram: true,
        sizeGuide: true
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

  // Template 3: Food Delight (Free)
  const foodTemplate = await prisma.template.upsert({
    where: { id: 'food-delight' },
    update: {},
    create: {
      id: 'food-delight',
      name: 'Food Delight',
      category: 'FOOD',
      description: 'Template untuk bisnis makanan dan minuman dengan tampilan yang menggugah selera. Cocok untuk restoran dan katering.',
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
        contact: true,
        reservation: true
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

  // Template 4: Tech Hub (Premium)
  const electronicsTemplate = await prisma.template.upsert({
    where: { id: 'tech-hub' },
    update: {},
    create: {
      id: 'tech-hub',
      name: 'Tech Hub',
      category: 'ELECTRONICS',
      description: 'Template modern untuk toko elektronik dan gadget dengan fokus pada spesifikasi produk dan review detail.',
      previewImage: '/templates/tech-hub-preview.jpg',
      thumbnailImage: '/templates/tech-hub-thumb.jpg',
      isActive: true,
      isPremium: true,
      price: 149000,
      features: {
        hero: true,
        productSpecs: true,
        comparison: true,
        reviews: true,
        warranty: true,
        support: true,
        newsletter: true,
        techSpecs: true
      },
      config: {
        layout: 'tech',
        colorScheme: 'blue-tech',
        sections: ['hero', 'categories', 'featured', 'specs', 'reviews', 'support']
      },
      heroConfig: {
        create: {
          headline: 'Teknologi Terdepan untuk Kehidupan Digital Anda',
          subheadline: 'Jelajahi koleksi gadget dan elektronik terbaru dengan teknologi canggih dan garansi resmi.',
          ctaText: 'Lihat Produk',
          ctaUrl: '/products',
          backgroundImage: '/images/hero-tech.jpg',
          overlayOpacity: 0.4,
          textAlignment: 'center',
          showStats: true
        }
      },
      featuresConfig: {
        create: [
          {
            title: 'Garansi Resmi',
            description: 'Semua produk bergaransi resmi distributor dan after sales terjamin',
            icon: '🛡️',
            order: 1
          },
          {
            title: 'Spec Lengkap',
            description: 'Informasi spesifikasi produk yang detail dan akurat',
            icon: '📊',
            order: 2
          },
          {
            title: 'Tech Support',
            description: 'Tim teknisi berpengalaman siap membantu 24/7',
            icon: '🔧',
            order: 3
          },
          {
            title: 'Update Firmware',
            description: 'Layanan update firmware gratis untuk produk tertentu',
            icon: '⚡',
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
          userCountText: 'Dipercaya 15.000+ tech enthusiast',
          averageRating: 4.9,
          totalReviews: 3200,
          testimonials: {
            create: [
              {
                customerName: 'Alex Pratama',
                customerTitle: 'IT Professional',
                content: 'Produknya original semua dan tech supportnya sangat membantu!',
                rating: 5,
                order: 1
              },
              {
                customerName: 'Rizki Hidayat',
                customerTitle: 'Gamer',
                content: 'Gaming gear di sini lengkap dan performanya top notch!',
                rating: 5,
                order: 2
              }
            ]
          }
        }
      }
    }
  })

  // Template 5: Pro Services (Free)
  const servicesTemplate = await prisma.template.upsert({
    where: { id: 'pro-services' },
    update: {},
    create: {
      id: 'pro-services',
      name: 'Pro Services',
      category: 'SERVICES',
      description: 'Template profesional untuk bisnis jasa dengan fokus pada portofolio dan testimoni. Cocok untuk konsultan dan agency.',
      previewImage: '/templates/pro-services-preview.jpg',
      thumbnailImage: '/templates/pro-services-thumb.jpg',
      isActive: true,
      isPremium: false,
      price: 0,
      features: {
        hero: true,
        services: true,
        portfolio: true,
        team: true,
        testimonials: true,
        contact: true,
        booking: true,
        caseStudies: true
      },
      config: {
        layout: 'professional',
        colorScheme: 'corporate',
        sections: ['hero', 'services', 'portfolio', 'team', 'testimonials', 'contact']
      },
      heroConfig: {
        create: {
          headline: 'Solusi Profesional untuk Kebutuhan Bisnis Anda',
          subheadline: 'Tim ahli dengan pengalaman bertahun-tahun siap memberikan layanan terbaik untuk mengembangkan bisnis Anda.',
          ctaText: 'Konsultasi Gratis',
          ctaUrl: '/contact',
          backgroundImage: '/images/hero-services.jpg',
          overlayOpacity: 0.6,
          textAlignment: 'left',
          showStats: true
        }
      },
      featuresConfig: {
        create: [
          {
            title: 'Tim Berpengalaman',
            description: 'Profesional dengan track record puluhan project sukses',
            icon: '👥',
            order: 1
          },
          {
            title: 'Konsultasi Gratis',
            description: 'Diskusi kebutuhan dan solusi tanpa biaya di awal',
            icon: '💡',
            order: 2
          },
          {
            title: 'Project Management',
            description: 'Manajemen project yang terstruktur dan tepat waktu',
            icon: '📋',
            order: 3
          },
          {
            title: 'After Service',
            description: 'Dukungan berkelanjutan setelah project selesai',
            icon: '🤝',
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
          userCountText: 'Menangani 500+ project berhasil',
          averageRating: 4.8,
          totalReviews: 450,
          testimonials: {
            create: [
              {
                customerName: 'PT Maju Jaya',
                customerTitle: 'Manufacturing Company',
                content: 'Hasil kerjanya memuaskan dan sesuai timeline yang disepakati.',
                rating: 5,
                order: 1
              },
              {
                customerName: 'CV Berkah Sentosa',
                customerTitle: 'Trading Company',
                content: 'Profesional dan responsif. Highly recommended!',
                rating: 5,
                order: 2
              }
            ]
          }
        }
      }
    }
  })

  // Template 6: Clean Minimal (Free)
  const generalTemplate = await prisma.template.upsert({
    where: { id: 'clean-minimal' },
    update: {},
    create: {
      id: 'clean-minimal',
      name: 'Clean Minimal',
      category: 'GENERAL',
      description: 'Template minimalis dan bersih yang cocok untuk semua jenis bisnis. Fleksibel dan mudah dikustomisasi.',
      previewImage: '/templates/clean-minimal-preview.jpg',
      thumbnailImage: '/templates/clean-minimal-thumb.jpg',
      isActive: true,
      isPremium: false,
      price: 0,
      features: {
        hero: true,
        features: true,
        showcase: true,
        testimonials: true,
        newsletter: true,
        contact: true,
        minimal: true,
        responsive: true
      },
      config: {
        layout: 'minimal',
        colorScheme: 'neutral',
        sections: ['hero', 'features', 'showcase', 'testimonials', 'newsletter']
      },
      heroConfig: {
        create: {
          headline: 'Solusi Bisnis yang Sederhana dan Efektif',
          subheadline: 'Pendekatan minimalis untuk hasil maksimal. Fokus pada kualitas dan kepuasan pelanggan.',
          ctaText: 'Mulai Sekarang',
          ctaUrl: '/products',
          backgroundImage: '/images/hero-minimal.jpg',
          overlayOpacity: 0.3,
          textAlignment: 'center',
          showStats: false
        }
      },
      featuresConfig: {
        create: [
          {
            title: 'Sederhana',
            description: 'Interface yang clean dan mudah digunakan',
            icon: '✨',
            order: 1
          },
          {
            title: 'Responsif',
            description: 'Tampil sempurna di semua perangkat',
            icon: '📱',
            order: 2
          },
          {
            title: 'Cepat',
            description: 'Loading time yang optimal untuk user experience terbaik',
            icon: '⚡',
            order: 3
          },
          {
            title: 'Fleksibel',
            description: 'Mudah dikustomisasi sesuai kebutuhan bisnis',
            icon: '🎨',
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
          userCountText: 'Dipercaya 1.000+ pengguna',
          averageRating: 4.7,
          totalReviews: 200,
          testimonials: {
            create: [
              {
                customerName: 'Maria Sari',
                customerTitle: 'Entrepreneur',
                content: 'Template yang sangat clean dan mudah digunakan. Perfect!',
                rating: 5,
                order: 1
              }
            ]
          }
        }
      }
    }
  })

  console.log('✅ All templates seeded successfully!')
  console.log('')
  console.log('📊 Template Summary:')
  console.log('===================')
  console.log('FREE TEMPLATES:')
  console.log(`✓ ${marketplaceTemplate.name} - ${marketplaceTemplate.category}`)
  console.log(`✓ ${foodTemplate.name} - ${foodTemplate.category}`)
  console.log(`✓ ${servicesTemplate.name} - ${servicesTemplate.category}`)
  console.log(`✓ ${generalTemplate.name} - ${generalTemplate.category}`)
  console.log('')
  console.log('PREMIUM TEMPLATES:')
  console.log(`✓ ${fashionTemplate.name} - ${fashionTemplate.category} (Rp ${fashionTemplate.price.toLocaleString('id-ID')})`)
  console.log(`✓ ${electronicsTemplate.name} - ${electronicsTemplate.category} (Rp ${electronicsTemplate.price.toLocaleString('id-ID')})`)
  console.log('')
  console.log('🎯 Total: 6 templates ready for your tenants!')
}

async function main() {
  try {
    await seedAllTemplates()
  } catch (error) {
    console.error('❌ Error seeding templates:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default seedAllTemplates
