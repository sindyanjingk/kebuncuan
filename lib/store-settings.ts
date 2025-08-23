import { prisma } from "@/lib/prisma";

export interface DefaultStoreSettingsConfig {
  storeName: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
}

export const getDefaultStoreSettings = (config: DefaultStoreSettingsConfig) => {
  const {
    storeName,
    primaryColor = '#6366F1',
    secondaryColor = '#8B5CF6',
    accentColor = '#10B981',
    fontFamily = 'Inter'
  } = config;

  return {
    primaryColor,
    secondaryColor,
    accentColor,
    fontFamily,
    socialLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      tiktok: '',
      linkedin: ''
    },
    seoConfig: {
      title: storeName,
      description: `${storeName} - Platform terpercaya untuk kebutuhan Anda`,
      keywords: ['toko online', 'marketplace', 'belanja', storeName.toLowerCase()],
      ogImage: '',
      twitterCard: 'summary_large_image'
    },
    contactInfo: {
      phone: '',
      email: '',
      address: '',
      whatsapp: '',
      businessHours: {
        monday: '09:00-17:00',
        tuesday: '09:00-17:00',
        wednesday: '09:00-17:00',
        thursday: '09:00-17:00',
        friday: '09:00-17:00',
        saturday: '09:00-17:00',
        sunday: 'Tutup'
      }
    },
    paymentMethods: {
      enabled: ['bank_transfer', 'ewallet'],
      bankAccounts: [],
      ewalletAccounts: [],
      minimumOrder: 10000,
      processingTime: '1-2 hari kerja'
    },
    shippingConfig: {
      enabled: true,
      freeShippingMinimum: 50000,
      defaultShippingCost: 10000,
      estimatedDelivery: '2-5 hari kerja',
      regions: [],
      availableCouriers: ['jne', 'pos', 'tiki', 'anteraja']
    },
    customization: {
      hero: {
        enabled: true,
        headline: `Selamat Datang di ${storeName}`,
        subheadline: 'Platform terpercaya untuk kebutuhan Anda',
        ctaText: 'Mulai Belanja',
        backgroundColor: primaryColor,
        textColor: '#FFFFFF',
        showStats: true,
        backgroundImage: ''
      },
      products: {
        enabled: true,
        title: 'Produk Pilihan Terbaik',
        subtitle: 'Koleksi eksklusif produk berkualitas tinggi dengan harga terbaik',
        showBadge: true,
        badgeText: '🔥 Trending Now',
        perPage: 12,
        sortOptions: ['newest', 'price_low', 'price_high', 'popular']
      },
      features: {
        enabled: true,
        title: 'Fitur Unggulan Platform',
        subtitle: 'Teknologi terdepan untuk pengalaman marketplace yang tak tertandingi',
        backgroundColor: primaryColor,
        items: [
          {
            title: 'Pembayaran Aman',
            description: 'Sistem pembayaran yang aman dan terpercaya',
            icon: '🔒'
          },
          {
            title: 'Pengiriman Cepat',
            description: 'Pengiriman ke seluruh Indonesia dengan berbagai pilihan kurir',
            icon: '🚚'
          },
          {
            title: 'Customer Service 24/7',
            description: 'Tim customer service yang siap membantu Anda kapan saja',
            icon: '💬'
          },
          {
            title: 'Garansi Kualitas',
            description: 'Jaminan kualitas produk dan kepuasan pelanggan',
            icon: '✅'
          }
        ]
      },
      about: {
        enabled: true,
        title: 'Berbelanja Lebih Mudah & Aman',
        subtitle: 'Kami menghadirkan pengalaman berbelanja online yang tak terlupakan dengan komitmen kualitas dan kepuasan pelanggan.',
        content: `${storeName} adalah platform e-commerce terpercaya yang menghadirkan pengalaman berbelanja online terbaik. Dengan komitmen terhadap kualitas produk dan kepuasan pelanggan, kami menyediakan berbagai pilihan produk berkualitas dengan harga terjangkau.`,
        image: ''
      },
      testimonials: {
        enabled: true,
        title: 'Apa Kata Mereka?',
        subtitle: 'Ribuan pelanggan telah merasakan pengalaman berbelanja yang luar biasa',
        showStats: true,
        stats: {
          customers: '1000+',
          products: '500+',
          rating: '4.8',
          reviews: '2000+'
        }
      },
      newsletter: {
        enabled: true,
        title: '🎉 Jangan Sampai Ketinggalan!',
        subtitle: 'Dapatkan update promo eksklusif, launching produk terbaru, dan tips belanja cerdas',
        placeholder: 'Masukkan email Anda...',
        buttonText: 'Berlangganan'
      },
      colorScheme: {
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
        background: '#FFFFFF',
        text: '#1F2937',
        muted: '#6B7280',
        border: '#E5E7EB'
      },
      layout: {
        headerStyle: 'modern',
        footerStyle: 'detailed',
        showBreadcrumb: true,
        showSearchBar: true,
        showCategories: true,
        showRecentlyViewed: true
      }
    }
  };
};

export const createDefaultStoreSettings = async (storeId: string, config: DefaultStoreSettingsConfig) => {
  const defaultSettings = getDefaultStoreSettings(config);
  
  return await prisma.storeSetting.create({
    data: {
      storeId,
      ...defaultSettings
    }
  });
};

export const ensureStoreHasSettings = async (storeId: string, storeName: string) => {
  const existing = await prisma.storeSetting.findUnique({
    where: { storeId }
  });

  if (!existing) {
    return await createDefaultStoreSettings(storeId, { storeName });
  }

  return existing;
};
