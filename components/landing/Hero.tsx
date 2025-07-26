"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative bg-white py-36 px-6 md:px-12 text-center overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-extrabold text-neutral-900"
      >
        Bangun Toko UMKM Kamu di <span className="text-green-600">KebunCuan</span> 🌱
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mt-6 max-w-2xl mx-auto text-lg text-neutral-600"
      >
        Marketplace multi-tenant yang memudahkan kamu berjualan online dalam hitungan menit.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        className="mt-10"
      >
        <Link href="/register">
          <Button className="rounded-full text-base px-6 py-3 bg-neutral-900 text-white hover:bg-neutral-700">
            Mulai Sekarang
          </Button>
        </Link>
      </motion.div>

      <div className="absolute -top-32 -left-32 w-[300px] h-[300px] bg-green-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-32 -right-32 w-[300px] h-[300px] bg-green-200 rounded-full blur-3xl opacity-30"></div>
    </section>
  )
}
