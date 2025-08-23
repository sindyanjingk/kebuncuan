"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart, Search } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: { url: string }[];
  category: { name: string } | null;
  active: boolean;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: string[];
  storeSlug: string;
}

export function ProductsClient({ initialProducts, categories, storeSlug }: ProductsClientProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { addToCart } = useCart();

  useEffect(() => {
    let filtered = initialProducts.filter(product => product.active);
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => product.category?.name === categoryFilter);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    setFilteredProducts(filtered);
  }, [initialProducts, searchTerm, sortBy, categoryFilter]);

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} ditambahkan ke keranjang!`);
    } catch (error: any) {
      toast.error(error.message || "Gagal menambahkan ke keranjang");
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setSortBy("name");
  };

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nama A-Z</SelectItem>
              <SelectItem value="price-low">Harga Terendah</SelectItem>
              <SelectItem value="price-high">Harga Tertinggi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="text-sm text-gray-600">
            Menampilkan {filteredProducts.length} dari {initialProducts.filter(p => p.active).length} produk
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada produk ditemukan</h3>
          <p className="text-gray-600 mb-6">Coba ubah filter pencarian Anda</p>
          <Button onClick={resetFilters}>
            Reset Filter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white">
              <CardContent className="p-0">
                <Link href={`/products/${product.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.images[0]?.url || "/images/product-placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Category Badge */}
                    {product.category && (
                      <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700">
                        {product.category.name}
                      </Badge>
                    )}
                  </div>
                </Link>
              </CardContent>
              
              <CardFooter className="p-4">
                <div className="w-full">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 mb-1 hover:text-purple-600 transition-colors line-clamp-1 cursor-pointer">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">
                      {formatRupiah(product.price)}
                    </span>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
