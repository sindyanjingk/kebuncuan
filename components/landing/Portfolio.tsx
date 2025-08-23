"use client"
import { motion } from "framer-motion"
import Image from "next/image"

const portfolioItems = [
  {
    name: "Toko Sambal Nusantara",
    category: "Makanan & Minuman",
    image: "/images/portfolio-1.jpg",
    url: "sambal-nusantara.kebuncuan.com"
  },
  {
    name: "Kopi Keliling Indonesia", 
    category: "F&B",
    image: "/images/portfolio-2.jpg",
    url: "kopi-keliling.kebuncuan.com"
  },
  {
    name: "Batik Modern Jaya",
    category: "Fashion",
    image: "/images/portfolio-3.jpg", 
    url: "batik-modern.kebuncuan.com"
  },
  {
    name: "Craft Studio Creative",
    category: "Kerajinan",
    image: "/images/portfolio-4.jpg",
    url: "craft-studio.kebuncuan.com"
  },
  {
    name: "Snack Tradisional Lezat",
    category: "Makanan",
    image: "/images/portfolio-5.jpg",
    url: "snack-tradisional.kebuncuan.com"
  },
  {
    name: "Fashion Hijab Trendy",
    category: "Fashion",
    image: "/images/portfolio-6.jpg",
    url: "hijab-trendy.kebuncuan.com"
  }
]

export function PortfolioSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kami Telah Membantu Transformasi Digital UMKM Melalui Toko Online
          </h2>
          <p className="text-lg text-gray-600">
            Lihat berbagai toko online yang telah berhasil dibuat dengan platform KebunCuan
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-green-100 overflow-hidden">
                  {/* Placeholder for portfolio image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">
                        {item.category === 'Makanan & Minuman' || item.category === 'Makanan' ? '🍽️' :
                         item.category === 'F&B' ? '☕' :
                         item.category === 'Fashion' ? '👗' :
                         '🎨'}
                      </div>
                      <div className="text-sm text-gray-600">{item.category}</div>
                    </div>
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold shadow-lg">
                        Lihat Toko
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-blue-600 text-sm font-semibold">{item.url}</p>
                  <div className="mt-3 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
                    {item.category}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300">
            Lihat Semua Portfolio
          </button>
        </motion.div>
      </div>
    </section>
  )
}
