"use client"
import { motion } from "framer-motion"
import Image from "next/image"

const mainFeatures = [
  { 
    title: "Desain Tanpa Batas", 
    desc: "Buat tampilan toko online secara profesional dengan template siap pakai dan mobile friendly",
    icon: "🎨",
    color: "blue"
  },
  { 
    title: "Sistem E-commerce Lengkap", 
    desc: "One stop solution e-commerce dengan berbagai kemudahan metode pembayaran dan fitur promosi lengkap.",
    icon: "�",
    color: "green"
  },
  { 
    title: "SEO Friendly", 
    desc: "Fitur SEO bawaan KebunCuan pada produk sangat mendukung kemunculan toko pada halaman pertama pencarian Google.",
    icon: "�",
    color: "purple"
  }
]

const detailedFeatures = [
  {
    title: "Mendukung Integrasi Marketing",
    desc: "Secara efektif meningkatkan penjualan dengan beragam fitur bawaan yang mampu diintegrasikan",
    image: "/images/marketing-integration.svg"
  },
  {
    title: "Konfigurasi SEO",
    desc: "Fitur SEO yang mendukung penempatan toko pada posisi teratas halaman pencarian Google.",
    image: "/images/seo-config.svg"
  },
  {
    title: "E-commerce Terlengkap",
    desc: "Kemudahan mengelola pesanan serta integrasi platform pembayaran terpercaya.",
    image: "/images/ecommerce-features.svg"
  },
  {
    title: "Desain yang Memukau",
    desc: "Buat Toko dengan Desain Keren dengan Mudah dengan Fitur Drag & Drop Termasuk Layout, Font, Warna, dan Gambar",
    image: "/images/design-features.svg"
  },
  {
    title: "Payment Gateway",
    desc: "Mendukung pembayaran debit/kredit serta cicilan dari Payment Gateways terkemuka.",
    image: "/images/payment-gateway.svg"
  },
  {
    title: "Fitur Pendongkrak Penjualan",
    desc: "Lengkap dengan Berbagai Fitur E-Commerce: Kode Promo, Kupon, Flash Sale, Pop-Up, Ads Banner, dan lainnya",
    image: "/images/sales-boost.svg"
  }
]

export function FeaturesGrid() {
  return (
    <>
      {/* Main Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tingkatkan Toko Online Anda dengan Berbagai Fitur Lengkap & Terintegrasi
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Memudahkan pembuatan toko online bisnis maupun UMKM secara profesional.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {mainFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="group cursor-pointer"
              >
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-2xl
                    ${feature.color === 'blue' ? 'bg-blue-50 text-blue-600' : 
                      feature.color === 'green' ? 'bg-green-50 text-green-600' : 
                      'bg-purple-50 text-purple-600'}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  <div className="mt-4 text-blue-600 font-semibold group-hover:text-blue-700">
                    Pelajari lebih lanjut →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dilengkapi semua fitur yang dibutuhkan pada pembuatan toko online.
            </h2>
            <p className="text-lg text-gray-600">
              Memudahkan pembuatan website bisnis maupun toko online secara profesional.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {detailedFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-4xl">{feature.title.includes('Marketing') ? '📈' : 
                                              feature.title.includes('SEO') ? '🔍' : 
                                              feature.title.includes('E-commerce') ? '🛒' : 
                                              feature.title.includes('Desain') ? '🎨' : 
                                              feature.title.includes('Payment') ? '💳' : '🚀'}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Terintegrasi dengan Platform Terkemuka</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {['Midtrans', 'Xendit', 'JNE', 'JNT', 'SiCepat', 'GoSend'].map((partner, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.6 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="bg-gray-100 rounded-lg p-4 h-16 flex items-center justify-center">
                  <span className="font-semibold text-gray-700">{partner}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
