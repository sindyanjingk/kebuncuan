"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { ProductImageUploader } from "@/components/product/product-image-uploader";
import Image from "next/image";

function formatRupiah(num: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);
}

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  modalPrice?: number;
  productType?: string;
  categoryId: string;
  active: boolean;
  category?: { name: string };
  images: { id: string; url: string; order: number }[];
};

type Category = {
  id: string;
  name: string;
};

type ProductFormData = {
  name: string;
  description: string;
  price: number;
  modalPrice: number;
  productType: string;
  categoryId: string;
  images: string[];
};

export default function ProductsPage() {
  const params = useParams();
  const storeSlug = params.store as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      productType: "DIGITAL",
      modalPrice: 0,
      price: 0,
      images: []
    }
  });

  const watchPrice = watch("price");
  const watchModalPrice = watch("modalPrice");
  const profit = (watchPrice || 0) - (watchModalPrice || 0);

  // Fetch products and categories
  useEffect(() => {
    fetchData();
  }, [storeSlug]);

  // Submit form handler for adding new product
  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          storeSlug,
          price: Number(data.price),
          modalPrice: Number(data.modalPrice),
          images: productImages,
        }),
      });

      if (response.ok) {
        // Refresh products list
        await fetchData();
        
        // Reset form and close dialog
        reset();
        setProductImages([]);
        setIsAddDialogOpen(false);
      } else {
        console.error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit form handler for editing product
  const onEditSubmit = async (data: ProductFormData) => {
    if (!editingProduct) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/products`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          id: editingProduct.id,
          price: Number(data.price),
          modalPrice: Number(data.modalPrice),
          images: productImages,
        }),
      });

      if (response.ok) {
        // Refresh products list
        await fetchData();
        
        // Reset form and close dialog
        reset();
        setProductImages([]);
        setEditingProduct(null);
        setIsEditDialogOpen(false);
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close dialogs and reset forms
  const closeAddDialog = () => {
    reset();
    setProductImages([]);
    setIsAddDialogOpen(false);
  };

  const closeEditDialog = () => {
    reset();
    setProductImages([]);
    setEditingProduct(null);
    setIsEditDialogOpen(false);
  };
  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    
    // Reset form first
    reset();
    
    // Populate form with product data
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("modalPrice", product.modalPrice || 0);
    setValue("productType", product.productType || "DIGITAL");
    setValue("categoryId", product.categoryId);
    
    // Set product images
    const imageUrls = product.images.map(img => img.url);
    setProductImages(imageUrls);
    
    setIsEditDialogOpen(true);
  };

  // Handle delete product (soft delete)
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    
    setIsDeleting(productId);
    try {
      const response = await fetch(`/api/products`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
      });

      if (response.ok) {
        // Refresh products list
        await fetchData();
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch products
      const productsRes = await fetch(`/api/products?store=${storeSlug}`);
      const productsData = await productsRes.json();
      setProducts(productsData.products || []);

      // Fetch categories
      const categoriesRes = await fetch(`/api/category`);
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading products...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produk</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Tambah Produk</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Produk Baru</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6"
                  style={{ maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
              
              {/* Product Images */}
              <ProductImageUploader
                images={productImages}
                onImagesChange={setProductImages}
                maxImages={5}
              />

              <div>
                <Label htmlFor="name">Nama Produk</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Nama produk harus diisi" })}
                  placeholder="Masukkan nama produk"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  {...register("description", { required: "Deskripsi harus diisi" })}
                  placeholder="Masukkan deskripsi produk"
                  rows={3}
                  disabled={isSubmitting}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              <div>
                <Label htmlFor="categoryId">Kategori</Label>
                <Select onValueChange={(value) => setValue("categoryId", value)} disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("categoryId", { required: "Kategori harus dipilih" })} />
                {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
              </div>

              <div>
                <Label htmlFor="productType">Tipe Produk</Label>
                <Select onValueChange={(value) => setValue("productType", value)} defaultValue="DIGITAL" disabled={isSubmitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHYSICAL">📦 Produk Fisik</SelectItem>
                    <SelectItem value="DIGITAL">💾 Produk Digital</SelectItem>
                    <SelectItem value="PPOB">⚡ PPOB</SelectItem>
                    <SelectItem value="SMM">📱 SMM</SelectItem>
                    <SelectItem value="VOUCHER">🎫 Voucher</SelectItem>
                    <SelectItem value="PREMIUM_ACCOUNT">👑 Premium Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="modalPrice">Harga Modal</Label>
                  <Input
                    id="modalPrice"
                    type="number"
                    {...register("modalPrice", { 
                      required: "Harga modal harus diisi",
                      min: { value: 0, message: "Harga modal tidak boleh negatif" }
                    })}
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                  {errors.modalPrice && <p className="text-red-500 text-sm">{errors.modalPrice.message}</p>}
                </div>

                <div>
                  <Label htmlFor="price">Harga Jual</Label>
                  <Input
                    id="price"
                    type="number"
                    {...register("price", { 
                      required: "Harga jual harus diisi",
                      min: { value: 0, message: "Harga jual tidak boleh negatif" }
                    })}
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>
              </div>

              {/* Profit Display */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">
                  Keuntungan: <span className={`${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatRupiah(profit)}
                  </span>
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeAddDialog} className="flex-1" disabled={isSubmitting}>
                  Batal
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Produk</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-6"
                  style={{ maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
              
              {/* Product Images */}
              <ProductImageUploader
                images={productImages}
                onImagesChange={setProductImages}
                maxImages={5}
              />

              <div>
                <Label htmlFor="edit-name">Nama Produk</Label>
                <Input
                  id="edit-name"
                  {...register("name", { required: "Nama produk harus diisi" })}
                  placeholder="Masukkan nama produk"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="edit-description">Deskripsi</Label>
                <Textarea
                  id="edit-description"
                  {...register("description", { required: "Deskripsi harus diisi" })}
                  placeholder="Masukkan deskripsi produk"
                  rows={3}
                  disabled={isSubmitting}
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              <div>
                <Label htmlFor="edit-categoryId">Kategori</Label>
                <Select 
                  onValueChange={(value) => setValue("categoryId", value)} 
                  disabled={isSubmitting}
                  value={editingProduct?.categoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("categoryId", { required: "Kategori harus dipilih" })} />
                {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
              </div>

              <div>
                <Label htmlFor="edit-productType">Tipe Produk</Label>
                <Select 
                  onValueChange={(value) => setValue("productType", value)} 
                  disabled={isSubmitting}
                  value={editingProduct?.productType || "DIGITAL"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHYSICAL">📦 Produk Fisik</SelectItem>
                    <SelectItem value="DIGITAL">💾 Produk Digital</SelectItem>
                    <SelectItem value="PPOB">⚡ PPOB</SelectItem>
                    <SelectItem value="SMM">📱 SMM</SelectItem>
                    <SelectItem value="VOUCHER">🎫 Voucher</SelectItem>
                    <SelectItem value="PREMIUM_ACCOUNT">👑 Premium Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-modalPrice">Harga Modal</Label>
                  <Input
                    id="edit-modalPrice"
                    type="number"
                    {...register("modalPrice", { 
                      required: "Harga modal harus diisi",
                      min: { value: 0, message: "Harga modal tidak boleh negatif" }
                    })}
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                  {errors.modalPrice && <p className="text-red-500 text-sm">{errors.modalPrice.message}</p>}
                </div>

                <div>
                  <Label htmlFor="edit-price">Harga Jual</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    {...register("price", { 
                      required: "Harga jual harus diisi",
                      min: { value: 0, message: "Harga jual tidak boleh negatif" }
                    })}
                    placeholder="0"
                    disabled={isSubmitting}
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>
              </div>

              {/* Profit Display */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">
                  Keuntungan: <span className={`${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatRupiah(profit)}
                  </span>
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={closeEditDialog} className="flex-1" disabled={isSubmitting}>
                  Batal
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Update"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Daftar Produk</h2>
        </div>
        <div className="p-4">
          {products.length === 0 ? (
            <p>Belum ada produk</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {product.images.length > 1 && (
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                              +{product.images.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Harga Jual:</span> {formatRupiah(product.price)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Harga Modal:</span> {formatRupiah(product.modalPrice || 0)}
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                              <span className="font-medium">Keuntungan:</span> {formatRupiah((product.price || 0) - (product.modalPrice || 0))}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Tipe:</span> {
                                product.productType === "PHYSICAL" ? "📦 Produk Fisik" :
                                product.productType === "DIGITAL" ? "💾 Produk Digital" :
                                product.productType === "PPOB" ? "⚡ PPOB" :
                                product.productType === "SMM" ? "📱 SMM" :
                                product.productType === "VOUCHER" ? "🎫 Voucher" :
                                product.productType === "PREMIUM_ACCOUNT" ? "👑 Premium" :
                                product.productType
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditDialog(product)}
                            disabled={isSubmitting || isDeleting === product.id}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={isSubmitting || isDeleting === product.id}
                          >
                            {isDeleting === product.id ? "Hapus..." : "Hapus"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
