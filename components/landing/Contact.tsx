"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    captcha: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-green-600 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Konsultasikan UMKM Anda!
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Hubungi Kami Sekarang Untuk Merasakan Layanan Platform Toko Online Terbaik 
              yang Sudah Berpengalaman Membantu Ribuan UMKM!
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <p className="opacity-90">
                  Menawarkan alternatif yang mungkin dibutuhkan untuk membangun toko online terbaik 
                  dengan rencana pemasaran digital.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <p className="opacity-90">
                  Berikan jawaban yang jelas dengan cepat, bisa segera untuk mulai bekerja.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mt-1">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <p className="opacity-90">
                  Memberikan bantuan dalam membuat toko online yang efektif
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm opacity-80 mb-2">Hubungi</p>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                <span>📱</span>
                WhatsApp: +62 812-3456-7890
              </a>
            </div>
          </motion.div>

          {/* Right Content - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 text-gray-900"
          >
            <h3 className="text-2xl font-bold mb-6">Hubungi Kami</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold">Nama *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-semibold">Nomor handphone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="service" className="text-sm font-semibold">Tertarik dengan layanan *</Label>
                <select 
                  id="service"
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih layanan</option>
                  <option value="toko-online">Pembuatan Toko Online</option>
                  <option value="konsultasi">Konsultasi Digital</option>
                  <option value="seo">SEO & Analytics</option>
                  <option value="payment">Sistem Pembayaran</option>
                </select>
              </div>

              <div>
                <Label htmlFor="captcha" className="text-sm font-semibold">7 + 14 = ? *</Label>
                <Input
                  id="captcha"
                  type="text"
                  value={formData.captcha}
                  onChange={(e) => setFormData({...formData, captcha: e.target.value})}
                  className="mt-1"
                  placeholder="Hasil perhitungan"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Kirim
              </Button>

              <p className="text-xs text-gray-500 mt-4">
                Dengan mengklik &quot;Kirim&quot;, Anda mengakui dan menyetujui bahwa kami akan 
                memproses informasi Anda sebagaimana mestinya sesuai Kebijakan Privasi KebunCuan 
                dan bersedia menerima informasi produk KebunCuan dari kami.
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
    </section>
  )
}
