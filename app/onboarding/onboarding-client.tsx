"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { IconChevronLeft, IconChevronRight, IconBuildingStore, IconPalette, IconRocket } from "@tabler/icons-react"

type OnboardingStep = 'store-info' | 'template-selection' | 'complete'

interface Template {
  id: string
  name: string
  description: string
  category: string
  previewImage?: string
  thumbnailImage?: string
  isActive: boolean
  _count: {
    stores: number
  }
}

interface TemplateDetail {
  id: string
  name: string
  description: string
  category: string
  previewImage?: string
  thumbnailImage?: string
  isActive: boolean
  heroConfig?: {
    title: string
    subtitle: string
    ctaText: string
    backgroundImage?: string
  }
  featuresConfig?: Array<{
    title: string
    description: string
    icon?: string
  }>
  socialProofConfig?: {
    title: string
    subtitle: string
    testimonials: Array<{
      name: string
      content: string
      rating: number
      avatar?: string
    }>
  }
  _count: {
    stores: number
  }
}

interface StoreData {
  name: string
  slug: string
  templateId?: string
}

interface OnboardingClientProps {
  initialTemplates: Template[]
}

export default function OnboardingClient({ initialTemplates }: OnboardingClientProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('store-info')
  const [loading, setLoading] = useState(false)
  const [templates] = useState<Template[]>(initialTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedTemplateDetail, setSelectedTemplateDetail] = useState<TemplateDetail | null>(null)
  const [loadingTemplateDetail, setLoadingTemplateDetail] = useState(false)
  
  const [storeData, setStoreData] = useState<StoreData>({
    name: '',
    slug: ''
  })

  // Generate slug from store name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  // Handle store name change and auto-generate slug
  const handleNameChange = (value: string) => {
    setStoreData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }))
  }

  const fetchTemplateDetail = async (templateId: string) => {
    setLoadingTemplateDetail(true)
    try {
      const response = await fetch(`/api/templates/${templateId}`)
      const data = await response.json()
      if (response.ok) {
        setSelectedTemplateDetail(data.template)
      }
    } catch (error) {
      console.error('Error fetching template detail:', error)
    } finally {
      setLoadingTemplateDetail(false)
    }
  }

  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplate(templateId)
    fetchTemplateDetail(templateId)
  }

  const handleNext = () => {
    if (currentStep === 'store-info') {
      if (!storeData.name.trim() || !storeData.slug.trim()) {
        alert('Nama toko dan slug wajib diisi')
        return
      }
      setCurrentStep('template-selection')
    }
  }

  const handleBack = () => {
    if (currentStep === 'template-selection') {
      setCurrentStep('store-info')
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // Create store
      const storeResponse = await fetch('/api/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...storeData,
          templateId: selectedTemplate
        })
      })

      if (!storeResponse.ok) {
        const errorData = await storeResponse.json()
        throw new Error(errorData.error || 'Failed to create store')
      }

      const { slug } = await storeResponse.json()

      setCurrentStep('complete')
      
      // Redirect to store dashboard after 2 seconds
      setTimeout(() => {
        router.push(`/${slug}/dashboard`)
      }, 2000)

    } catch (error) {
      console.error('Error creating store:', error)
      alert(`Gagal membuat toko: ${error instanceof Error ? error.message : 'Silakan coba lagi.'}`)
    } finally {
      setLoading(false)
    }
  }

  const stepConfig = {
    'store-info': {
      title: 'Informasi Toko',
      description: 'Buat toko online Anda dengan mudah',
      icon: IconBuildingStore
    },
    'template-selection': {
      title: 'Pilih Template',
      description: 'Pilih template yang sesuai dengan bisnis Anda',
      icon: IconPalette
    },
    'complete': {
      title: 'Selesai!',
      description: 'Toko online Anda berhasil dibuat',
      icon: IconRocket
    }
  }

  const currentConfig = stepConfig[currentStep]
  const Icon = currentConfig.icon

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconRocket className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Selamat!</CardTitle>
            <CardDescription>
              Toko online Anda berhasil dibuat. Anda akan dialihkan ke dashboard dalam beberapa detik...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className={`w-full ${currentStep === 'template-selection' ? 'max-w-6xl' : 'max-w-2xl'}`}>
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{currentConfig.title}</CardTitle>
              <CardDescription>{currentConfig.description}</CardDescription>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-3 h-3 rounded-full ${currentStep === 'store-info' ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className="flex-1 h-1 bg-gray-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ 
                  width: currentStep === 'store-info' ? '0%' : 
                         currentStep === 'template-selection' ? '50%' : '100%' 
                }}
              />
            </div>
            <div className={`w-3 h-3 rounded-full ${
              currentStep === 'template-selection' ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 'store-info' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Toko *</Label>
                <Input
                  id="name"
                  value={storeData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Toko Buah Segar"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Toko *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">kebuncuan.com/</span>
                  <Input
                    id="slug"
                    value={storeData.slug}
                    onChange={(e) => setStoreData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="toko-buah-segar"
                    className="flex-1"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  URL ini akan menjadi alamat toko online Anda
                </p>
              </div>
            </div>
          )}

          {currentStep === 'template-selection' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Template List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pilih Template</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {templates.map((template) => (
                    <Card 
                      key={template.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedTemplate === template.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleTemplateSelection(template.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {template.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-600">
                              {template._count?.stores || 0} toko
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {templates.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <IconPalette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Tidak ada template tersedia</p>
                  </div>
                )}
              </div>

              {/* Template Preview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preview Template</h3>
                {selectedTemplate && selectedTemplateDetail ? (
                  <Card className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      <CardTitle className="text-white">{selectedTemplateDetail.name}</CardTitle>
                      <CardDescription className="text-blue-100">
                        {selectedTemplateDetail.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      {/* Hero Preview */}
                      {selectedTemplateDetail.heroConfig && (
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
                          <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            {selectedTemplateDetail.heroConfig.title}
                          </h2>
                          <p className="text-gray-600 mb-4">
                            {selectedTemplateDetail.heroConfig.subtitle}
                          </p>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            {selectedTemplateDetail.heroConfig.ctaText}
                          </Button>
                        </div>
                      )}

                      {/* Features Preview */}
                      {selectedTemplateDetail.featuresConfig && selectedTemplateDetail.featuresConfig.length > 0 && (
                        <div className="p-6 border-t">
                          <h3 className="text-lg font-semibold mb-4">Fitur Unggulan</h3>
                          <div className="grid grid-cols-1 gap-3">
                            {selectedTemplateDetail.featuresConfig.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="font-medium text-sm">{feature.title}</h4>
                                  <p className="text-xs text-gray-600">{feature.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Social Proof Preview */}
                      {selectedTemplateDetail.socialProofConfig && selectedTemplateDetail.socialProofConfig.testimonials.length > 0 && (
                        <div className="p-6 border-t bg-gray-50">
                          <h3 className="text-lg font-semibold mb-4">
                            {selectedTemplateDetail.socialProofConfig.title}
                          </h3>
                          <div className="space-y-3">
                            {selectedTemplateDetail.socialProofConfig.testimonials.slice(0, 2).map((testimonial, index) => (
                              <div key={index} className="bg-white p-3 rounded-lg">
                                <p className="text-sm text-gray-700 mb-2">&quot;{testimonial.content}&quot;</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                    {testimonial.name?.charAt(0) || 'U'}
                                  </div>
                                  <span className="text-xs font-medium">{testimonial.name || 'User'}</span>
                                  <div className="flex gap-1">
                                    {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                                      <span key={i} className="text-yellow-400 text-xs">★</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : selectedTemplate && loadingTemplateDetail ? (
                  <Card className="p-6 text-center">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">Memuat preview...</p>
                  </Card>
                ) : (
                  <Card className="p-6 text-center text-gray-500">
                    <IconPalette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Pilih template untuk melihat preview</p>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 'store-info'}
              className="flex items-center gap-2"
            >
              <IconChevronLeft className="w-4 h-4" />
              Kembali
            </Button>

            {currentStep === 'store-info' && (
              <Button
                onClick={handleNext}
                disabled={!storeData.name.trim() || !storeData.slug.trim()}
                className="flex items-center gap-2"
              >
                Selanjutnya
                <IconChevronRight className="w-4 h-4" />
              </Button>
            )}

            {currentStep === 'template-selection' && (
              <Button
                onClick={handleSubmit}
                disabled={loading || !selectedTemplate}
                className="flex items-center gap-2"
              >
                {loading ? 'Membuat...' : 'Buat Toko'}
                <IconRocket className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
