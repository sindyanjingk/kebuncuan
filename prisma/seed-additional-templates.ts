import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedAdditionalTemplates() {
  console.log('🌱 Seeding additional templates...')

  // Template 4: Electronics Store
  const electronicsTemplate = await prisma.template.upsert({
    where: { id: 'tech-hub' },
    update: {},
    create: {
      id: 'tech-hub',
      name: 'Tech Hub',
      category: 'ELECTRONICS',
      description: 'Template modern untuk toko elektronik dan gadget dengan fokus pada spesifikasi produk',
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
        newsletter: true
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

  // Template 5: Service Business
  const servicesTemplate = await prisma.template.upsert({
    where: { id: 'pro-services' },
    update: {},
    create: {
      id: 'pro-services',
      name: 'Pro Services',
      category: 'SERVICES',
      description: 'Template profesional untuk bisnis jasa dengan fokus pada portofolio dan testimoni',
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
        booking: true
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

  // Template 6: General Store
  const generalTemplate = await prisma.template.upsert({
    where: { id: 'clean-minimal' },
    update: {},
    create: {
      id: 'clean-minimal',
      name: 'Clean Minimal',
      category: 'GENERAL',
      description: 'Template minimalis dan bersih yang cocok untuk semua jenis bisnis',
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
        contact: true
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

  console.log('✅ Additional templates seeded successfully!')
  console.log(`- ${electronicsTemplate.name}`)
  console.log(`- ${servicesTemplate.name}`)
  console.log(`- ${generalTemplate.name}`)
}

async function main() {
  try {
    await seedAdditionalTemplates()
  } catch (error) {
    console.error('❌ Error seeding additional templates:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default seedAdditionalTemplates
