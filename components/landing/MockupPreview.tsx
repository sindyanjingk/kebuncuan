"use client"
import { motion } from "framer-motion"
import { Search, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function MockupPreview() {
  return (
    <section className="py-20 px-6 bg-neutral-100 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-neutral-800 mb-6">Tampilan Toko Kamu</h2>

        {/* Simulasi UI toko */}
        <div className="max-w-6xl mx-auto rounded-xl overflow-hidden border bg-white shadow-xl">
          {/* Header toko */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4 border-b bg-neutral-50">
            <div className="text-lg font-semibold text-green-700">Toko Sambal Bu Tini</div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Input placeholder="Cari produk..." className="pl-10" />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
              </div>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Grid Produk */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition">
                <div className="aspect-[4/3] bg-neutral-200" />
                <div className="p-4 text-left">
                  <h4 className="font-medium text-sm text-neutral-800">Produk {i + 1}</h4>
                  <p className="text-sm text-green-600 font-semibold mt-1">Rp{(i + 1) * 10000}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
