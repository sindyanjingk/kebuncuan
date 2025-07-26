"use client"
import { motion } from "framer-motion"

const testimonials = [
  { name: "Bu Tini", bisnis: "Toko Sambal", quote: "KebunCuan bikin jualan saya naik 3x lipat karena tampilannya profesional dan gampang diatur." },
  { name: "Mas Dito", bisnis: "Kopi Keliling", quote: "Sistem checkout-nya cepat banget. Sekarang pelanggan makin nyaman belanja." },
]

export function Testimonials() {
  return (
    <section className="py-20 px-6 bg-green-50 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-12">Apa Kata UMKM</h2>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white p-6 rounded-xl border shadow-md text-left"
          >
            <p className="text-neutral-600 italic mb-4\">“{t.quote}”</p>
            <div className="font-semibold text-neutral-800">{t.name}</div>
            <div className="text-sm text-neutral-500">{t.bisnis}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
