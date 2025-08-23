import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "@/components/ui/sonner";
import { StoreHeader } from "@/components/store-header";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: { store: string } }): Promise<Metadata> {
  const storeData = await prisma.store.findUnique({
    where: { slug: params.store },
    select: {
      name: true,
      logoUrl: true,
      faviconUrl: true,
    }
  });

  if (!storeData) {
    return {
      title: 'Store Not Found',
      description: 'The requested store could not be found.',
    };
  }

  const description = `Welcome to ${storeData.name} - Your trusted online store`;

  return {
    title: storeData.name,
    description: description,
    icons: {
      icon: storeData.faviconUrl || storeData.logoUrl || '/favicon.ico',
    },
    openGraph: {
      title: storeData.name,
      description: description,
      images: storeData.logoUrl ? [storeData.logoUrl] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: storeData.name,
      description: description,
      images: storeData.logoUrl ? [storeData.logoUrl] : [],
    },
  };
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { store: string };
}) {
  // Fetch store data on server
  const storeData = await prisma.store.findUnique({
    where: { slug: params.store },
    include: {
      settings: true,
      template: {
        include: {
          heroConfig: true,
          featuresConfig: true,
          socialProofConfig: true
        }
      }
    }
  });

  if (!storeData) {
    notFound();
  }

  // Get session on server
  const session = await getServerSession(authOptions);

  return (
      <CartProvider session={session}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          {storeData && storeData.template && storeData.settings && (
            <StoreHeader storeData={storeData} storeSlug={params.store} session={session} />
          )}
          
          <main className="flex-1">
            {children}
          </main>
          
          {/* Footer */}
          {storeData && (
            <footer id="contact" className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
              {/* Main Footer */}
              <div className="py-20">
                <div className="container mx-auto px-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {storeData.name.charAt(0)}
                        </div>
                        <h3 className="text-2xl font-bold">{storeData.name}</h3>
                      </div>
                      <p className="text-blue-100 mb-8 leading-relaxed max-w-md">
                        Platform marketplace terpercaya yang menghadirkan pengalaman berbelanja online 
                        terbaik dengan jaminan keamanan dan kualitas produk terjamin.
                      </p>
                      
                      {/* Social Media */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Ikuti Kami:</h4>
                        <div className="flex space-x-4">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            📘
                          </Button>
                          <Button size="sm" className="bg-pink-600 hover:bg-pink-700 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            📷
                          </Button>
                          <Button size="sm" className="bg-blue-400 hover:bg-blue-500 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            🐦
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700 rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all duration-300">
                            📺
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Links */}
                    <div>
                      <h4 className="font-bold text-lg mb-6 text-white">Tautan Cepat</h4>
                      <ul className="space-y-3 text-blue-100">
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Tentang Kami</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Cara Berbelanja</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Cara Menjual</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">FAQ</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Blog</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Karir</a></li>
                      </ul>
                    </div>
                    
                    {/* Customer Service */}
                    <div>
                      <h4 className="font-bold text-lg mb-6 text-white">Layanan Pelanggan</h4>
                      <ul className="space-y-3 text-blue-100">
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Pusat Bantuan</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Hubungi Kami</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Metode Pembayaran</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Kebijakan Pengembalian</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Garansi & Klaim</a></li>
                        <li><a href="#" className="hover:text-white transition-colors duration-300 hover:translate-x-1 transform block">Lacak Pesanan</a></li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="mt-16 pt-8 border-t border-white/20">
                    <div className="text-center">
                      <h4 className="font-bold text-xl mb-8 text-white">🏆 Dipercaya & Bersertifikat</h4>
                      <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                          <span>🛡️</span> SSL Secured
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                          <span>🏅</span> ISO 27001
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                          <span>✅</span> Verified Partner
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300">
                          <span>💳</span> PCI DSS
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Footer dengan gradient yang sama */}
              <div className="bg-gradient-to-r from-black/50 via-blue-950/50 to-purple-950/50 backdrop-blur-sm py-8 border-t border-white/10">
                <div className="container mx-auto px-4">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-blue-100 text-sm text-center md:text-left">
                      © 2025 {storeData.name}. All rights reserved. Made with ❤️ in Indonesia
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
                      <a href="#" className="text-blue-100 hover:text-white transition-colors duration-300">
                        Syarat & Ketentuan
                      </a>
                      <a href="#" className="text-blue-100 hover:text-white transition-colors duration-300">
                        Kebijakan Privasi
                      </a>
                      <a href="#" className="text-blue-100 hover:text-white transition-colors duration-300">
                        Sitemap
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          )}
          
          <Toaster />
        </div>
      </CartProvider>
  );
}
