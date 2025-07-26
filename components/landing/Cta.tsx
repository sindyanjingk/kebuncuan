"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export function CTA() {
  return (
    <section className="py-24 px-6 text-center bg-neutral-900 text-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold"
      >
        Saatnya Tumbuh Bersama KebunCuan
      </motion.h2>
      <p className="mt-4 text-neutral-300 text-lg max-w-xl mx-auto">
        Mulai toko online kamu sekarang dan raih lebih banyak pelanggan.
      </p>
      <div className="mt-6">
        <Link href="/register">
          <Button className="rounded-full bg-white text-neutral-900 hover:bg-neutral-200 px-6 py-3 text-base">
            Daftar Gratis
          </Button>
        </Link>
      </div>
    </section>
  )
}
