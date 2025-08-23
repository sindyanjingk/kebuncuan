import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <span className="text-xl font-bold">KebunCuan</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              PT Kebun Digital Nusantara
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📞 +62 812-3456-7890</p>
              <p>Jam Operasional: 09.00 - 21.00</p>
            </div>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">📘</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">📷</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">🐦</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">💬</a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Layanan KebunCuan</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/register" className="hover:text-white transition-colors">Toko Online Gratis</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Paket Premium</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Desain Custom</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">SEO & Analytics</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Dukungan</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Panduan Membuat Toko</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Konfirmasi Pembayaran</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Tentang Kami</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Tentang KebunCuan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Hubungi Kami</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Karir</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mt-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-semibold text-lg mb-2">Daftar untuk menerima berita dari kami</h3>
              <p className="text-gray-400">Dapatkan tips bisnis dan update fitur terbaru</p>
            </div>
            <div className="flex gap-4">
              <input 
                type="email" 
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors">
                📧
              </button>
            </div>
          </div>
        </div>

        {/* Security & Certifications */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            <div className="text-xs text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-lg mb-2 mx-auto flex items-center justify-center">🔒</div>
              <span>SSL Encryption</span>
            </div>
            <div className="text-xs text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-lg mb-2 mx-auto flex items-center justify-center">🛡️</div>
              <span>Secure Payment</span>
            </div>
            <div className="text-xs text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-lg mb-2 mx-auto flex items-center justify-center">✅</div>
              <span>ISO 27001</span>
            </div>
            <div className="text-xs text-center">
              <div className="w-12 h-12 bg-gray-800 rounded-lg mb-2 mx-auto flex items-center justify-center">🏆</div>
              <span>UMKM Awards</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 mt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © Copyright PT Kebun Digital Nusantara, 2024. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Kebijakan Privasi</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
