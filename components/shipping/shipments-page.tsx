'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Search,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Shipment {
  id: string
  waybill: string | null
  status: string
  courier_company: string | null
  courier_type: string | null
  recipient_name: string | null
  recipient_address: string | null
  recipient_phone: string | null
  price: number | null
  createdAt: string
  updatedAt: string
  order: {
    id: string
    product: {
      name: string
    }
    user: {
      email: string
      username: string
    }
  }
}

const statusIcons = {
  PENDING: Clock,
  CONFIRMED: Package,
  ALLOCATED: Package,
  PICKING_UP: Truck,
  PICKED_UP: Truck,
  DROPPING_OFF: Truck,
  DELIVERED: CheckCircle,
  RETURNED: AlertCircle,
  CANCELLED: AlertCircle,
  ON_HOLD: AlertCircle
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  ALLOCATED: 'bg-blue-100 text-blue-800',
  PICKING_UP: 'bg-orange-100 text-orange-800',
  PICKED_UP: 'bg-orange-100 text-orange-800',
  DROPPING_OFF: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  RETURNED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-red-100 text-red-800',
  ON_HOLD: 'bg-gray-100 text-gray-800'
}

export default function ShipmentsPage({ storeSlug }: { storeSlug: string }) {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    fetchShipments()
  }, [storeSlug])

  const fetchShipments = async () => {
    try {
      const response = await fetch(`/api/store/${storeSlug}/shipping/shipments`)
      if (response.ok) {
        const data = await response.json()
        setShipments(data)
      }
    } catch (error) {
      console.error('Error fetching shipments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateLabel = async (shipmentId: string) => {
    try {
      const response = await fetch(`/api/store/${storeSlug}/shipping/shipments/${shipmentId}/label`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        // Open label in new tab
        window.open(data.label_url, '_blank')
      } else {
        alert('Failed to generate label')
      }
    } catch (error) {
      console.error('Error generating label:', error)
      alert('Error generating label')
    }
  }

  const handleTrackShipment = (waybill: string, courier: string) => {
    if (waybill && courier) {
      window.open(`/${storeSlug}/tracking?waybill=${waybill}&courier=${courier}`, '_blank')
    }
  }

  // Filter shipments
  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = !searchTerm || 
      shipment.waybill?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.order.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || statusFilter === 'ALL' || shipment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by waybill, recipient, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="ALLOCATED">Allocated</SelectItem>
            <SelectItem value="PICKING_UP">Picking Up</SelectItem>
            <SelectItem value="PICKED_UP">Picked Up</SelectItem>
            <SelectItem value="DROPPING_OFF">Dropping Off</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="RETURNED">Returned</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipments ({filteredShipments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredShipments.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter ? 'Try adjusting your filters.' : 'Start shipping orders to see them here.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredShipments.map((shipment) => {
                const StatusIcon = statusIcons[shipment.status as keyof typeof statusIcons] || Package
                
                return (
                  <div key={shipment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <StatusIcon className="h-6 w-6 text-gray-500 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">
                              {shipment.waybill || 'No Waybill'}
                            </h3>
                            <Badge 
                              className={cn(
                                'text-xs',
                                statusColors[shipment.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                              )}
                            >
                              {shipment.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Product:</span> {shipment.order.product.name}
                            </div>
                            <div>
                              <span className="font-medium">Customer:</span> {shipment.order.user.email}
                            </div>
                            <div>
                              <span className="font-medium">Recipient:</span> {shipment.recipient_name || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Courier:</span> {shipment.courier_company?.toUpperCase()} - {shipment.courier_type}
                            </div>
                            <div>
                              <span className="font-medium">Address:</span> {shipment.recipient_address || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Cost:</span> Rp {(shipment.price || 0).toLocaleString('id-ID')}
                            </div>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-500">
                            Created: {new Date(shipment.createdAt).toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={() => handleGenerateLabel(shipment.id)}
                            className="cursor-pointer"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Label
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleTrackShipment(shipment.waybill || '', shipment.courier_company || '')}
                            className="cursor-pointer"
                            disabled={!shipment.waybill}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Track Shipment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
