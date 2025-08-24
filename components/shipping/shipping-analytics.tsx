'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Truck, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShippingStats {
  totalShipments: number
  pendingShipments: number
  inTransitShipments: number
  deliveredShipments: number
  totalRevenue: number
  averageShippingCost: number
  popularCouriers: { name: string; count: number }[]
  recentShipments: ShipmentItem[]
}

interface ShipmentItem {
  id: string
  waybill: string
  courier_company: string
  status: string
  recipient_name: string
  createdAt: string
  price: number
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

export default function ShippingAnalytics({ storeSlug }: { storeSlug: string }) {
  const [stats, setStats] = useState<ShippingStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [storeSlug])

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/store/${storeSlug}/shipping/analytics`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching shipping stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No shipping data</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start shipping orders to see analytics.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalShipments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingShipments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inTransitShipments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{stats.deliveredShipments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Shipping Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {stats.totalRevenue.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Shipping Cost</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {stats.averageShippingCost.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Couriers */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Couriers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.popularCouriers.map((courier, index) => (
              <div key={courier.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium capitalize">{courier.name}</span>
                </div>
                <Badge variant="secondary">{courier.count} shipments</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Shipments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Shipments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentShipments.map((shipment) => {
              const StatusIcon = statusIcons[shipment.status as keyof typeof statusIcons] || Package
              
              return (
                <div key={shipment.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <StatusIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{shipment.waybill}</p>
                      <p className="text-sm text-gray-500">
                        {shipment.recipient_name} • {shipment.courier_company.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(shipment.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">
                      Rp {shipment.price.toLocaleString('id-ID')}
                    </span>
                    <Badge 
                      className={cn(
                        'font-medium',
                        statusColors[shipment.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {shipment.status}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="text-center">
        <Button 
          onClick={() => window.location.href = `/dashboard/shipping`} 
          className="w-full sm:w-auto"
        >
          View All Shipments
        </Button>
      </div>
    </div>
  )
}
