"use client"
import { motion } from "framer-motion"

const testimonials = [
  { 
    name: "Toko Sambal Nusantara", 
    owner: "Bu Tini",
    website: "www.sambal-nusantara.com",
    quote: "KebunCuan menawarkan kemudahan dalam mengelola toko online tanpa perlu keahlian coding atau IT. Sehingga bisnis bisa terus berjalan dengan mengikuti kemajuan teknologi.",
    logo: "🌶️"
  },
  { 
    name: "Kopi Keliling Indonesia", 
    owner: "Mas Dito",
    website: "www.kopi-keliling.com",
    quote: "Platform KebunCuan memiliki fitur yang mengesankan dengan testimonial positif dari UMKM-UMKM sebelumnya. Kami percaya bahwa tim KebunCuan memiliki keahlian yang dibutuhkan untuk menciptakan toko online yang sesuai dengan visi dan misi kami.",
    logo: "☕"
  },
  { 
    name: "Batik Modern Jaya", 
    owner: "Ibu Sari",
    website: "www.batik-modern.com",
    quote: "KebunCuan dapat membantu UMKM mendapatkan paparan yang lebih besar di platform online dan meningkatkan kepercayaan pelanggan.",
    logo: "👘"
  },
  { 
    name: "Craft Studio Creative", 
    owner: "Pak Rahman",
    website: "www.craft-studio.com",
    quote: "Keunggulan yang didapatkan dari platform KebunCuan yaitu sebagai media promosi yang efektif untuk melakukan pertukaran informasi produk yang dapat dijangkau customer 24jam.",
    logo: "🎨"
  },
  { 
    name: "Snack Tradisional Lezat", 
    owner: "Bu Maya",
    website: "www.snack-tradisional.com",
    quote: "Dengan dashboard admin yang mudah dipelajari, KebunCuan membuat pengelolaan toko online menjadi jauh lebih efisien. Terlebih fitur SEO pada setiap produk yang bisa buat index google lebih mudah.",
    logo: "🍘"
  },
  { 
    name: "Fashion Hijab Trendy", 
    owner: "Mbak Rina",
    website: "www.hijab-trendy.com",
    quote: "Platform KebunCuan bisa membuat toko kami lebih independent, karena website mendatangkan customer lebih banyak dari pada source lain.",
    logo: "🧕"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dipercayai lebih dari <span className="text-blue-600">1,000+</span> UMKM
          </h2>
          <p className="text-lg text-gray-600">
            Testimoni UMKM dengan Platform Toko Online Terbaik
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center text-xl">
                  {testimonial.logo}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                  <a 
                    href={`https://${testimonial.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs hover:underline"
                  >
                    {testimonial.website}
                  </a>
                </div>
              </div>
              
              <blockquote className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              
              <div className="text-right">
                <div className="font-semibold text-gray-900 text-sm">{testimonial.owner}</div>
                <div className="text-gray-500 text-xs">Pemilik {testimonial.name}</div>
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
            Mulai Sekarang
          </button>
        </motion.div>
      </div>
    </section>
  )
}
