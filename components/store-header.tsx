import { NavbarAuth } from "@/components/navbar-auth";
import Image from 'next/image';
import Link from 'next/link';
import { HeaderClient } from "./header-client";

interface StoreHeaderProps {
  storeData: any;
  storeSlug: string;
  session: any;
}

export function StoreHeader({ storeData, storeSlug, session }: StoreHeaderProps) {
  // Get colors from store settings with fallbacks
  const settings = storeData.settings || {};
  const primaryColor = settings.primaryColor || '#6366F1';
  const secondaryColor = settings.secondaryColor || '#8B5CF6';
  const accentColor = settings.accentColor || '#A855F7';
  const textColor = '#FFFFFF';

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-lg transition-all duration-300"
      style={{ 
        background: `linear-gradient(135deg, ${primaryColor}CC, ${secondaryColor}B3, ${accentColor}99)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {storeData.logoUrl ? (
              <div className="relative w-10 h-10">
                <Image
                  src={storeData.logoUrl}
                  alt={`${storeData.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div 
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold border border-white/30 shadow-lg"
                style={{ color: textColor }}
              >
                {storeData.name.charAt(0)}
              </div>
            )}
            <span 
              className="font-bold text-lg drop-shadow-lg"
              style={{ color: textColor }}
            >
              {storeData.name}
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            {/* Home */}
            <Link 
              href={`/`}
              className="text-white/90 hover:text-white transition-all duration-300 font-medium drop-shadow-sm hover:drop-shadow-lg transform hover:scale-105"
            >
              Home
            </Link>
            
            {/* Products Dropdown */}
            <HeaderClient storeSlug={storeSlug} />
            
            {/* Categories */}
            <Link 
              href={`/categories`}
              className="text-white/90 hover:text-white transition-all duration-300 font-medium drop-shadow-sm hover:drop-shadow-lg transform hover:scale-105"
            >
              Kategori
            </Link>
            
            {/* About */}
            <Link 
              href={`/about`}
              className="text-white/90 hover:text-white transition-all duration-300 font-medium drop-shadow-sm hover:drop-shadow-lg transform hover:scale-105"
            >
              Tentang
            </Link>
            
            {/* Contact */}
            <a href="#contact" className="text-white/90 hover:text-white transition-all duration-300 font-medium drop-shadow-sm hover:drop-shadow-lg transform hover:scale-105">Kontak</a>
          </nav>
          
          <NavbarAuth session={session} storeSlug={storeData.slug} />
        </div>
      </div>
    </header>
  );
}
