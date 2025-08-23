"use client"
import { motion } from "framer-motion"
import Link from "next/link"

const services = [
  {
    title: "Pembuatan Toko Online",
    description: "Visualisasi brand UMKM Anda bersama kami dalam platform yang profesional.",
    icon: "🏪",
    features: ["Template Profesional", "Mobile Responsive", "SEO Optimized"]
  },
  {
    title: "Konsultasi Strategi Digital",
    description: "Kelola strategi pemasaran digital dengan efektif untuk UMKM Anda.",
    icon: "📈",
    features: ["Digital Marketing", "Social Media", "Content Strategy"]
  },
  {
    title: "Sistem Pembayaran",
    description: "Raih kepercayaan pelanggan dengan sistem pembayaran yang aman dan terpercaya.",
    icon: "💳",
    features: ["Multiple Payment", "Secure Transaction", "Auto Settlement"]
  },
  {
    title: "SEO & Analytics",
    description: "Tempati posisi di halaman pertama pencarian Google secara organik dan berkelanjutan.",
    icon: "🔍",
    features: ["SEO Optimization", "Analytics Dashboard", "Performance Report"]
  },
  {
    title: "Manajemen Inventori",
    description: "Proses pengelolaan stok yang aman dan mudah demi kelancaran proses bisnis.",
    icon: "📦",
    features: ["Stock Management", "Auto Reorder", "Supplier Integration"]
  },
  {
    title: "Customer Support",
    description: "Dukungan teknis 24/7 untuk memastikan toko online Anda berjalan lancar.",
    icon: "🛠️",
    features: ["24/7 Support", "Live Chat", "Training & Guide"]
  }
]

export function ServicesSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Layanan KebunCuan
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tingkatkan Performa UMKM Anda Dengan Berbagai Layanan Pembuatan Toko Online dari KebunCuan
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <button className="w-full bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 py-2 px-4 rounded-lg font-semibold transition-colors duration-300 border border-gray-200 hover:border-blue-200">
                  Detail layanan
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
              Konsultasi Layanan Sekarang
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
