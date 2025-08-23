"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import Image from "next/image"
import {
  IconArrowLeft,
  IconCheck,
  IconExternalLink,
  IconEye,
  IconPalette,
  IconCrown,
  IconShieldCheck,
  IconDevices,
  IconUsers,
  IconStar
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
  heroConfig?: {
    headline: string
    subheadline: string
    ctaText: string
  }
  featuresConfig?: Array<{
    title: string
    description: string
    icon: string
  }>
  socialProofConfig?: {
    userCountText: string
    averageRating: number
    totalReviews: number
    testimonials: Array<{
      customerName: string
      content: string
      rating: number
    }>
  }
  _count?: {
    stores: number
  }
}

const featureIcons = {
  'shield-check': IconShieldCheck,
  'devices': IconDevices,
  'users': IconUsers,
  'star': IconStar,
  'palette': IconPalette
}

export default function TemplatePreviewPage() {
  const params = useParams()
  const router = useRouter()
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  const templateId = params.templateId as string
  const storeSlug = params.store as string

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const response = await fetch(`/api/templates/${templateId}`)
        if (response.ok) {
          const data = await response.json()
          setTemplate(data.template)
        }
      } catch (error) {
        console.error('Error fetching template:', error)
      } finally {
        setLoading(false)
      }
    }

    if (templateId) {
      fetchTemplate()
    }
  }, [templateId])

  const handleApplyTemplate = async () => {
    setApplying(true)
    try {
      const response = await fetch(`/api/${storeSlug}/template`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateId: template?.id
        })
      })

      if (response.ok) {
        router.push(`/${storeSlug}/dashboard?template_applied=true`)
      } else {
        console.error('Failed to apply template')
      }
    } catch (error) {
      console.error('Error applying template:', error)
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Template Tidak Ditemukan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Template yang Anda cari tidak ditemukan atau tidak tersedia.</p>
            <Button onClick={() => router.back()} variant="outline" className="w-full">
              <IconArrowLeft className="size-4 mr-2" />
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="p-2"
              >
                <IconArrowLeft className="size-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
                <p className="text-gray-600">{template.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={template.isPremium ? "default" : "secondary"}>
                {template.isPremium ? (
                  <>
                    <IconCrown className="size-3 mr-1" />
                    Premium
                  </>
                ) : (
                  'Gratis'
                )}
              </Badge>
              <Badge variant="outline">
                <IconEye className="size-3 mr-1" />
                {template._count?.stores || 0} toko menggunakan
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Preview Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Preview */}
            <Card className="overflow-hidden">
              <div className="aspect-video relative bg-gradient-to-br from-blue-50 to-purple-50">
                {template.previewImage && (
                  <Image
                    src={template.previewImage}
                    alt={`Preview ${template.name}`}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-4 right-4">
                  <Button size="sm" variant="secondary">
                    <IconExternalLink className="size-4 mr-2" />
                    Preview Lengkap
                  </Button>
                </div>
              </div>
            </Card>

            {/* Hero Section Preview */}
            {template.heroConfig && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hero Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">{template.heroConfig.headline}</h3>
                    <p className="text-gray-600">{template.heroConfig.subheadline}</p>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      {template.heroConfig.ctaText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features Preview */}
            {template.featuresConfig && template.featuresConfig.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fitur Utama</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {template.featuresConfig.slice(0, 4).map((feature, index) => {
                      const IconComponent = featureIcons[feature.icon as keyof typeof featureIcons] || IconCheck
                      return (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="size-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{feature.title}</h4>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Template Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detail Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Kategori</div>
                  <div className="font-medium">{template.category}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600">Harga</div>
                  <div className="font-medium">
                    {template.isPremium ? `Rp ${template.price.toLocaleString()}` : 'Gratis'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600">Fitur Included</div>
                  <div className="space-y-2 mt-2">
                    {Object.entries(template.features)
                      .filter(([, enabled]) => enabled)
                      .map(([feature]) => (
                        <div key={feature} className="flex items-center gap-2">
                          <IconCheck className="size-4 text-green-600" />
                          <span className="text-sm capitalize">
                            {feature.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Proof */}
            {template.socialProofConfig && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Testimoni</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{template.socialProofConfig.averageRating}</div>
                      <div className="text-sm text-gray-600">
                        dari {template.socialProofConfig.totalReviews} review
                      </div>
                    </div>
                    
                    {template.socialProofConfig.testimonials?.slice(0, 2).map((testimonial, index) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-3">
                        <p className="text-sm italic">&quot;{testimonial.content}&quot;</p>
                        <div className="text-xs text-gray-600 mt-1">
                          - {testimonial.customerName}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Apply Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky bottom-6"
            >
              <Card>
                <CardContent className="p-6">
                  <Button 
                    onClick={handleApplyTemplate}
                    disabled={applying}
                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                  >
                    {applying ? (
                      "Menerapkan Template..."
                    ) : (
                      <>
                        <IconCheck className="size-5 mr-2" />
                        Gunakan Template Ini
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-600 text-center mt-2">
                    Template akan diterapkan ke toko Anda
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
