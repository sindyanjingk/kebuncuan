"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
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

interface StoreData {
  name: string
  description: string
  slug: string
  templateId?: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('store-info')
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  
  const [storeData, setStoreData] = useState<StoreData>({
    name: '',
    description: '',
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

  // Fetch templates when reaching template selection step
  useEffect(() => {
    if (currentStep === 'template-selection') {
      fetchTemplates()
    }
  }, [currentStep])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      const data = await response.json()
      if (response.ok) {
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const handleNext = () => {
    if (currentStep === 'store-info') {
      setCurrentStep('template-selection')
    } else if (currentStep === 'template-selection') {
      handleSubmit()
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
        throw new Error('Failed to create store')
      }

      const { slug } = await storeResponse.json()

      setCurrentStep('complete')
      
      // Redirect to store dashboard after 2 seconds
      setTimeout(() => {
        router.push(`/${slug}/dashboard`)
      }, 2000)

    } catch (error) {
      console.error('Error creating store:', error)
      alert('Gagal membuat toko. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    if (currentStep === 'store-info') {
      return storeData.name.trim() && storeData.slug.trim()
    }
    if (currentStep === 'template-selection') {
      return selectedTemplate !== ''
    }
    return false
  }

  const stepConfig = {
    'store-info': {
      title: 'Informasi Toko',
      description: 'Masukkan informasi dasar toko online Anda',
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
      <Card className="w-full max-w-2xl">
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

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Toko</Label>
                <textarea
                  id="description"
                  value={storeData.description}
                  onChange={(e) => setStoreData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Jelaskan tentang toko Anda..."
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          )}

          {currentStep === 'template-selection' && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {template.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {template._count?.stores || 0} toko
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
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
                  <p>Template sedang dimuat...</p>
                </div>
              )}
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

            <Button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="flex items-center gap-2"
            >
              {loading ? (
                "Membuat..."
              ) : currentStep === 'template-selection' ? (
                <>
                  Buat Toko
                  <IconRocket className="w-4 h-4" />
                </>
              ) : (
                <>
                  Lanjut
                  <IconChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
