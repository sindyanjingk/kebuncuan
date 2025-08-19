"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const params = useParams();
  const storeSlug = params.store as string;
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/orders?store=${storeSlug}&page=${page}&pageSize=${PAGE_SIZE}`)
      .then(res => res.json())
      .then(data => {
        setOrders(data.data || []);
        setTotal(data.total || 0);
        setLoading(false);
      });
  }, [storeSlug, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Pesanan</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Pemesan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
            ) : orders.length === 0 ? (
              <TableRow><TableCell colSpan={5}>Belum ada pesanan</TableCell></TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.product?.name || '-'}</TableCell>
                  <TableCell>{order.user?.username || order.user?.email || '-'}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" disabled>Detail</Button>
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
