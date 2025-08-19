
"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

const PAGE_SIZE = 10;

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  createdAt: string;
};

type CustomerForm = {
  name: string;
  email: string;
  phone: string;
};

export default function CustomersPage() {
  const params = useParams();
  const storeSlug = params.store as string;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerForm>({
    name: "",
    email: "",
    phone: "",
  });

  // Fetch customers
  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      store: storeSlug,
      page: String(page),
      pageSize: String(PAGE_SIZE),
      q: search,
    });
    fetch(`/api/customers?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.data);
        setTotal(data.total);
        setLoading(false);
      });
  }, [search, page, storeSlug]);

  // Modal open/close helpers
  const openCreate = () => {
    setEditCustomer(null);
    setForm({ name: "", email: "", phone: "" });
    setModalOpen(true);
  };
  const openEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setForm({
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
    });
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditCustomer(null);
  };

  // CRUD handlers
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = editCustomer ? "PUT" : "POST";
    const url = `/api/customers${method === "POST" ? "" : "?store=" + storeSlug}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        editCustomer
          ? { id: editCustomer.id, ...form }
          : { ...form, storeId: storeSlug }
      ),
    });
    if (res.ok) {
      closeModal();
      setPage(1);
      setLoading(true);
      fetch(`/api/customers?store=${storeSlug}&page=1&pageSize=${PAGE_SIZE}`)
        .then((res) => res.json())
        .then((data) => {
          setCustomers(data.data);
          setTotal(data.total);
          setLoading(false);
        });
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Hapus customer ini?")) return;
    const res = await fetch(`/api/customers?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPage(1);
      setLoading(true);
      fetch(`/api/customers?store=${storeSlug}&page=1&pageSize=${PAGE_SIZE}`)
        .then((res) => res.json())
        .then((data) => {
          setCustomers(data.data);
          setTotal(data.total);
          setLoading(false);
        });
    }
  };

  // Pagination helpers
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          <Input
            placeholder="Cari customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48"
          />
        </div>
        <div className="flex gap-2">
          <Sheet open={modalOpen} onOpenChange={setModalOpen}>
            <SheetTrigger asChild>
              <Button onClick={openCreate}>Tambah Customer</Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="text-xl font-bold mb-2">{editCustomer ? "Edit" : "Tambah"} Customer</h2>
                <Label>Nama</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                <Label>Email</Label>
                <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" />
                <Label>No. HP</Label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                <div className="flex gap-2 mt-4">
                  <Button type="submit">{editCustomer ? "Update" : "Tambah"}</Button>
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
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>No. HP</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
            ) : customers.length === 0 ? (
              <TableRow><TableCell colSpan={5}>Belum ada customer</TableCell></TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email || <span className="text-muted-foreground">-</span>}</TableCell>
                  <TableCell>{c.phone || <span className="text-muted-foreground">-</span>}</TableCell>
                  <TableCell>{new Date(c.createdAt).toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => openEdit(c)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(c.id)} className="ml-2">Hapus</Button>
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