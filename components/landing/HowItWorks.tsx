"use client"
import { motion } from "framer-motion"

const steps = [
  { step: "1", title: "Daftar Akun", desc: "Registrasi dengan mudah menggunakan email dan nomor HP." },
  { step: "2", title: "Buat Toko", desc: "Masukkan nama, deskripsi, dan atur tampilan tokomu." },
  { step: "3", title: "Tambah Produk", desc: "Unggah produk dan atur harga serta stok." },
  { step: "4", title: "Mulai Jualan", desc: "Toko kamu siap menerima pesanan dan pembayaran." },
]

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-800 mb-12">Cara Kerja KebunCuan</h2>
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="p-6 rounded-xl border bg-neutral-50 shadow-sm"
          >
            <div className="text-4xl font-bold text-green-600 mb-2">{s.step}</div>
            <h4 className="text-lg font-semibold mb-1">{s.title}</h4>
            <p className="text-sm text-neutral-600">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
