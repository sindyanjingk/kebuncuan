
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet as Modal, SheetTrigger as ModalTrigger, SheetContent as ModalContent } from "@/components/ui/sheet";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductImageUpload } from "@/components/product/product-image-upload";
import { useForm, Controller } from "react-hook-form";
import { Pencil, Trash2 } from "lucide-react";

function formatRupiah(num:number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num);
}

const PAGE_SIZE = 10;

type Category = {
  id: string;
  name: string;
};

type ProductImage = {
  id: string;
  url: string;
  order: number;
  file?: File; // For local preview images
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  type: string;
  active: boolean;
  category?: Category;
  images: ProductImage[];
};

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  type: string;
  images: ProductImage[];
};

export default function ProductsPage() {
  const params = useParams();
  const storeSlug = params.store as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("createdAt");
  const [order, setOrder] = useState<string>("desc");
  const [page, setPage] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  // Category modal state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const {
    control,
    handleSubmit: hookSubmit,
    reset,
    setValue,
    watch
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
      type: "PPOB",
      images: []
    }
  });

  // Fetch categories for filter and form
  useEffect(() => {
    fetch(`/api/category`)
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      store: storeSlug,
      page: String(page),
      pageSize: String(PAGE_SIZE),
      search,
      sort,
      order,
      ...(category !== "all" && { category }),
    });
    fetch(`/api/products?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setTotal(data.total);
        setLoading(false);
      });
  }, [search, category, sort, order, page, storeSlug]);

  // Modal open/close helpers
  const openCreate = () => {
    setEditProduct(null);
    reset({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      type: "PPOB",
      images: []
    });
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    console.log("Opening edit with images:", product);
    setEditProduct(product);
    reset({
      name: product.name,
      description: product.description,
      price: String(product.price),
      categoryId: product.categoryId,
      type: product.type,
      images: Array.isArray(product.images) ? product.images.map(img => ({
        id: img.id || Math.random().toString(36).slice(2),
        url: img.url,
        order: img.order || 0
      })) : []
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditProduct(null);
    reset();
  };

  // CRUD handlers
  const onSubmit = async (formData: ProductFormData) => {
    setLoading(true);

    try {
      // First, upload all images that have files attached
      const imagesToUpload = formData.images.filter((img: ProductImage) => img.file);
      const uploadedUrls: string[] = [];

      for (const image of imagesToUpload) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", image.file as File);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload image");
        const { url } = await uploadRes.json();
        uploadedUrls.push(url);
      }

      // Replace temporary URLs with uploaded URLs
      const finalImages = formData.images.map((img: ProductImage, index: number) => {
        if (img.file) {
          const url = uploadedUrls.shift() as string;
          return { id: img.id, url, order: index };
        }
        return { id: img.id, url: img.url, order: index };
      });

      const method = editProduct ? "PUT" : "POST";
      // Prepare the data to be sent
      const submitData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        categoryId: formData.categoryId,
        type: formData.type,
        storeId: storeSlug,
        images: finalImages.map((img: ProductImage) => ({
          url: img.url,
          order: img.order
        }))
      };

      const res = await fetch(`/api/products`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct ? 
          { id: editProduct.id, ...submitData } : 
          submitData
        ),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save product");
      }

      closeModal();
      setPage(1);

      // Refetch products
      const productsRes = await fetch(`/api/products?store=${storeSlug}&page=1&pageSize=${PAGE_SIZE}`);
      const data = await productsRes.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert(error.message || "Failed to save product"); // Show error to user
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/products?store=${storeSlug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      setPage(1);
      
      // Refetch products
      const productsRes = await fetch(`/api/products?store=${storeSlug}&page=1&pageSize=${PAGE_SIZE}`);
      const data = await productsRes.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination helpers
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <Input
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
          <div className="flex gap-2 items-center">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Modal open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
              <ModalTrigger asChild>
                <Button size="sm" variant="outline" onClick={() => setCategoryModalOpen(true)}>+ Kategori</Button>
              </ModalTrigger>
              <ModalContent side="right" className="w-[350px]">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newCategory.trim()) return;
                    setCategoryLoading(true);
                    const res = await fetch("/api/category", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: newCategory }),
                    });
                    setCategoryLoading(false);
                    if (res.ok) {
                      setNewCategory("");
                      setCategoryModalOpen(false);
                      // Refetch categories and select the new one
                      const cats = await fetch("/api/category").then(r => r.json());
                      setCategories(cats.categories || []);
                      const created = cats.categories.find((c:any) => c.name === newCategory);
                      if (created) setCategory(created.id);
                    }
                  }}
                  className="flex flex-col gap-4"
                >
                  <h2 className="text-lg font-bold mb-2">Tambah Kategori</h2>
                  <Label>Nama Kategori</Label>
                  <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} required autoFocus />
                  <div className="flex gap-2 mt-4">
                    <Button type="submit" disabled={categoryLoading}>{categoryLoading ? "Menyimpan..." : "Simpan"}</Button>
                    <Button type="button" variant="outline" onClick={() => setCategoryModalOpen(false)}>Batal</Button>
                  </div>
                </form>
              </ModalContent>
            </Modal>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setOrder(order === "asc" ? "desc" : "asc")}>{order === "asc" ? "⬆️" : "⬇️"}</Button>
          <Sheet open={modalOpen} onOpenChange={setModalOpen}>
            <SheetTrigger asChild>
              <Button onClick={openCreate}>Tambah Produk</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] overflow-y-auto">
              <form onSubmit={hookSubmit(onSubmit)} className="flex flex-col gap-4 pb-20">
                <h2 className="text-xl font-bold mb-2">{editProduct ? "Edit" : "Tambah"} Produk</h2>
                
                <Label>Nama Produk</Label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Nama produk wajib diisi" }}
                  render={({ field }) => (
                    <Input {...field} />
                  )}
                />

                <Label>Deskripsi</Label>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Deskripsi wajib diisi" }}
                  render={({ field }) => (
                    <Input {...field} />
                  )}
                />

                <Label>Harga</Label>
                <Controller
                  name="price"
                  control={control}
                  rules={{ required: "Harga wajib diisi" }}
                  render={({ field }) => (
                    <Input type="number" {...field} />
                  )}
                />

                <Label>Kategori</Label>
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: "Kategori wajib dipilih" }}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                <Label>Tipe Produk</Label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: "Tipe produk wajib dipilih" }}
                  render={({ field }) => (
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Tipe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PPOB">PPOB</SelectItem>
                        <SelectItem value="SMM">SMM</SelectItem>
                        <SelectItem value="VOUCHER">VOUCHER</SelectItem>
                        <SelectItem value="PREMIUM_ACCOUNT">PREMIUM_ACCOUNT</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                <div className="mt-4">
                  <Label>Gambar Produk</Label>
                  <div className="mt-2">
                    <Controller
                      name="images"
                      control={control}
                      render={({ field }) => (
                        <ProductImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          maxFiles={5}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Menyimpan..." : editProduct ? "Update" : "Tambah"}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeModal}>Batal</Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={products.length > 0 && selectedProducts.length === products.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedProducts(products.map(p => p.id));
                    } else {
                      setSelectedProducts([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7}>Loading...</TableCell></TableRow>
            ) : products.length === 0 ? (
              <TableRow><TableCell colSpan={7}>Belum ada produk</TableCell></TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(p.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProducts([...selectedProducts, p.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== p.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                        <Image
                          src={p.images?.[0]?.url || "/images/product-placeholder.svg"}
                          alt={p.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{p.category?.name || "-"}</TableCell>
                  <TableCell>{formatRupiah(p.price)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      p.type === "PPOB" ? "default" :
                      p.type === "SMM" ? "secondary" :
                      p.type === "VOUCHER" ? "destructive" :
                      "outline"
                    }>
                      {p.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.active ? "default" : "secondary"}>
                      {p.active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(p)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span>
          Halaman {page} dari {totalPages}
        </span>
        <div className="flex gap-2">
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
          <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      </div>
    </div>
  );
}
