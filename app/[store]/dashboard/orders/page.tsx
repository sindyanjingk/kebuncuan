"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package } from "lucide-react";

const PAGE_SIZE = 10;

export default function OrdersPage() {
  const params = useParams();
  const storeSlug = params.store as string;
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [creatingShipments, setCreatingShipments] = useState<Set<string>>(new Set());

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

  const createShipment = async (orderId: string) => {
    setCreatingShipments(prev => new Set(prev.add(orderId)))
    
    try {
      const response = await fetch(`/api/store/${storeSlug}/orders/${orderId}/ship`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        alert(`Shipment created successfully! Waybill: ${data.shipment.waybill}`)
        // Refresh orders
        window.location.reload()
      } else {
        const errorData = await response.json()
        alert(`Failed to create shipment: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating shipment:', error)
      alert('Error creating shipment')
    } finally {
      setCreatingShipments(prev => {
        const newSet = new Set(prev)
        newSet.delete(orderId)
        return newSet
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-blue-100 text-blue-800'
    }
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

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
              <TableHead>Shipping</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
            ) : orders.length === 0 ? (
              <TableRow><TableCell colSpan={6}>Belum ada pesanan</TableCell></TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.product?.name || '-'}</TableCell>
                  <TableCell>{order.user?.username || order.user?.email || '-'}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    {order.shipping_required ? (
                      order.shipment ? (
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">Shipped</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-orange-600" />
                          <span className="text-sm text-orange-600">Required</span>
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-gray-500">Not required</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" disabled>Detail</Button>
                      {order.shipping_required && !order.shipment && order.payment?.status === 'PAID' && (
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => createShipment(order.id)}
                          disabled={creatingShipments.has(order.id)}
                          className="flex items-center gap-1"
                        >
                          <Truck className="h-3 w-3" />
                          {creatingShipments.has(order.id) ? 'Creating...' : 'Ship'}
                        </Button>
                      )}
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
