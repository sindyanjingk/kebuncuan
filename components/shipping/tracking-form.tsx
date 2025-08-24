"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Package, Search, Clock, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface TrackingEvent {
  note: string
  updated_at: string
  status: string
}

interface TrackingResult {
  waybill: string
  courier: string
  status: string
  history: TrackingEvent[]
  link: string
}

interface TrackingFormProps {
  storeSlug: string
}

const courierOptions = [
  { value: 'jne', label: 'JNE' },
  { value: 'tiki', label: 'TIKI' },
  { value: 'pos', label: 'POS Indonesia' },
  { value: 'jnt', label: 'J&T Express' },
  { value: 'sicepat', label: 'SiCepat' },
  { value: 'anteraja', label: 'AnterAja' },
  { value: 'ninja', label: 'Ninja Express' },
  { value: 'lion', label: 'Lion Parcel' },
  { value: 'pcp', label: 'PCP Express' },
]

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'cancelled':
    case 'returned':
      return <XCircle className="h-5 w-5 text-red-500" />
    case 'on_hold':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    default:
      return <Clock className="h-5 w-5 text-blue-500" />
  }
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'confirmed': 'Dikonfirmasi',
    'allocated': 'Dialokasikan',
    'picking_up': 'Sedang Dijemput',
    'picked_up': 'Sudah Dijemput',
    'dropping_off': 'Sedang Diantar',
    'delivered': 'Terkirim',
    'returned': 'Dikembalikan',
    'cancelled': 'Dibatalkan',
    'on_hold': 'Ditahan'
  }
  return statusMap[status.toLowerCase()] || status
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function TrackingForm({ storeSlug }: TrackingFormProps) {
  const [waybill, setWaybill] = useState('')
  const [courier, setCourier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [error, setError] = useState('')

  const handleTrack = async () => {
    if (!waybill || !courier) {
      setError('Mohon lengkapi nomor resi dan pilih kurir')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch(`/api/store/${storeSlug}/shipping/track/${waybill}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courier }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Gagal melacak pengiriman')
      }
    } catch (error) {
      console.error('Error tracking:', error)
      setError('Terjadi kesalahan saat melacak pengiriman')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Lacak Pengiriman</h1>
        <p className="text-gray-600">Masukkan nomor resi untuk melacak status pengiriman Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Form Tracking
          </CardTitle>
          <CardDescription>
            Masukkan nomor resi dan pilih kurir untuk melacak paket Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="waybill">Nomor Resi</Label>
              <Input
                id="waybill"
                value={waybill}
                onChange={(e) => setWaybill(e.target.value)}
                placeholder="Masukkan nomor resi"
              />
            </div>
            
            <div>
              <Label htmlFor="courier">Kurir</Label>
              <Select value={courier} onValueChange={setCourier}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kurir" />
                </SelectTrigger>
                <SelectContent>
                  {courierOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleTrack}
            disabled={isLoading || !waybill || !courier}
            className="w-full flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {isLoading ? 'Melacak...' : 'Lacak Pengiriman'}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(result.status)}
              Status Pengiriman
            </CardTitle>
            <CardDescription>
              Resi: {result.waybill} • Kurir: {result.courier.toUpperCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="font-medium">Status Terkini</p>
                <p className="text-gray-600">{getStatusText(result.status)}</p>
              </div>
            </div>

            {result.history && result.history.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Riwayat Pengiriman</h3>
                <div className="space-y-3">
                  {result.history.map((event, index) => (
                    <div 
                      key={index}
                      className="flex gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{getStatusText(event.status)}</p>
                        <p className="text-gray-600 text-sm">{event.note}</p>
                        <p className="text-gray-500 text-xs">{formatDate(event.updated_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.link && (
              <div className="pt-3 border-t">
                <a
                  href={result.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Lihat tracking di website kurir →
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
