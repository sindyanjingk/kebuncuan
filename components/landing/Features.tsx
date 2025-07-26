"use client"
import { motion } from "framer-motion"

const features = [
  { icon: "🏪", title: "Multi-Tenant", desc: "Setiap UMKM punya toko sendiri." },
  { icon: "🛒", title: "Fitur Lengkap", desc: "Checkout, katalog, laporan penjualan." },
  { icon: "📦", title: "Manajemen Produk", desc: "Atur stok, harga, dan varian produk." },
  { icon: "🚀", title: "Performa Cepat", desc: "Dibangun dengan Next.js 14 modern." },
  { icon: "📱", title: "Responsif", desc: "Toko tampil bagus di HP, tablet, & desktop." },
  { icon: "🔒", title: "Keamanan", desc: "Dilengkapi autentikasi dan proteksi data." },
]

export function FeaturesGrid() {
  return (
    <section className="py-24 px-6 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-12">
        Fitur Unggulan KebunCuan
      </h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-neutral-50 border rounded-xl shadow-sm hover:shadow-md"
          >
            <div className="text-4xl mb-3">{f.icon}</div>
            <h4 className="text-xl font-semibold mb-1">{f.title}</h4>
            <p className="text-sm text-neutral-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
