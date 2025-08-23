"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { 
  IconCheck, 
  IconCrown, 
  IconEye, 
  IconShoppingBag, 
  IconDevices,
  IconPalette,
  IconShirt,
  IconChefHat,
  IconDeviceDesktop,
  IconTool
} from "@tabler/icons-react"

interface Template {
  id: string
  name: string
  category: string
  description: string
  previewImage: string
  thumbnailImage: string
  isPremium: boolean
  price: number
  features: Record<string, boolean>
  _count: {
    stores: number
  }
}

const categoryIcons = {
  MARKETPLACE: IconShoppingBag,
  ECOMMERCE: IconDevices,
  FASHION: IconShirt,
  FOOD: IconChefHat,
  ELECTRONICS: IconDeviceDesktop,
  SERVICES: IconTool,
  GENERAL: IconPalette
}

export default function SelectTemplatePage() {
  const router = useRouter()
  const params = useParams()
  const storeSlug = params.store as string

  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [applying, setApplying] = useState<string | null>(null)

  useEffect(() => {
    fetchTemplates()
  }, [selectedCategory])

  const fetchTemplates = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'ALL') {
        params.set('category', selectedCategory)
      }

      const response = await fetch(`/api/templates?${params}`)
      const data = await response.json()

      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyTemplate = async (templateId: string) => {
    setApplying(templateId)
    try {
      // First get store ID from slug
      const storeResponse = await fetch(`/api/store/${storeSlug}`)
      const storeData = await storeResponse.json()

      if (!storeData.success) {
        throw new Error('Store not found')
      }

      const response = await fetch(`/api/templates/${templateId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          storeId: storeData.store.id
        })
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/${storeSlug}/dashboard`)
      } else {
        throw new Error(data.error || 'Failed to apply template')
      }
    } catch (error) {
      console.error('Error applying template:', error)
      alert('Gagal menerapkan template. Silakan coba lagi.')
    } finally {
      setApplying(null)
    }
  }

  const categories = [
    { value: 'ALL', label: 'Semua Template', icon: IconPalette },
    { value: 'MARKETPLACE', label: 'Marketplace', icon: IconShoppingBag },
    { value: 'ECOMMERCE', label: 'E-commerce', icon: IconDevices },
    { value: 'FASHION', label: 'Fashion', icon: IconShirt },
    { value: 'FOOD', label: 'Food & Beverage', icon: IconChefHat },
    { value: 'ELECTRONICS', label: 'Electronics', icon: IconDeviceDesktop },
    { value: 'SERVICES', label: 'Services', icon: IconTool }
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full rounded" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pilih Template Toko</h1>
        <p className="text-gray-600">
          Pilih template yang sesuai dengan jenis bisnis Anda. Semua template sudah dioptimasi untuk konversi dan SEO.
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-gray-100">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <TabsTrigger 
                key={category.value} 
                value={category.value}
                className="flex items-center gap-2 text-xs lg:text-sm"
              >
                <Icon className="size-4" />
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template, index) => {
          const CategoryIcon = categoryIcons[template.category as keyof typeof categoryIcons] || IconPalette
          
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={template.thumbnailImage}
                    alt={template.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/template-placeholder.jpg'
                    }}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      <CategoryIcon className="size-3 mr-1" />
                      {template.category}
                    </Badge>
                    {template.isPremium && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <IconCrown className="size-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="bg-white/90">
                      {template._count.stores} toko
                    </Badge>
                  </div>
                </div>

                <CardHeader className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.isPremium && (
                        <p className="text-sm font-semibold text-blue-600 mt-1">
                          Rp {template.price.toLocaleString('id-ID')}
                        </p>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(`/templates/${template.id}/preview`, '_blank')}
                  >
                    <IconEye className="size-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleApplyTemplate(template.id)}
                    disabled={applying === template.id}
                  >
                    {applying === template.id ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Menerapkan...
                      </div>
                    ) : (
                      <>
                        <IconCheck className="size-4 mr-1" />
                        Gunakan
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {templates.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <IconPalette className="size-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada template ditemukan
          </h3>
          <p className="text-gray-600">
            Coba pilih kategori lain atau hubungi support untuk template custom.
          </p>
        </div>
      )}
    </div>
  )
}
