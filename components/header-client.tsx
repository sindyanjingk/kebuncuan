"use client";

import Link from 'next/link';
import { ShoppingBag, Grid3X3, Star, TrendingUp } from 'lucide-react';

interface HeaderClientProps {
  storeSlug: string;
}

export function HeaderClient({ storeSlug }: HeaderClientProps) {
  return (
    <div className="relative group">
      <Link 
        href={`/products`}
        className="text-white/90 hover:text-white transition-all duration-300 font-medium flex items-center gap-1 drop-shadow-sm hover:drop-shadow-lg transform hover:scale-105"
      >
        Produk
        <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
      
      <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0"
           style={{ 
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
           }}
      >
        <div className="p-3">
          <Link 
            href={`/products`} 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
          >
            <ShoppingBag className="w-5 h-5 text-purple-600" />
            <div>
              <div className="font-medium">Semua Produk</div>
              <div className="text-sm text-gray-500">Lihat koleksi lengkap</div>
            </div>
          </Link>
          
          <Link 
            href={`/products?category=featured`} 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
          >
            <Star className="w-5 h-5 text-yellow-600" />
            <div>
              <div className="font-medium">Produk Unggulan</div>
              <div className="text-sm text-gray-500">Pilihan terbaik</div>
            </div>
          </Link>
          
          <Link 
            href={`/products?sort=newest`} 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
          >
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium">Produk Terbaru</div>
              <div className="text-sm text-gray-500">Update terkini</div>
            </div>
          </Link>
          
          <a 
            href="#products" 
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
          >
            <Grid3X3 className="w-5 h-5 text-blue-600" />
            <div>
              <div className="font-medium">Katalog Produk</div>
              <div className="text-sm text-gray-500">Jelajahi kategori</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
