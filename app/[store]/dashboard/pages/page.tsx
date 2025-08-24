"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useParams } from 'next/navigation'

interface StorePage {
  id: string
  type: string
  title: string
  slug: string
  content: string
  metaTitle?: string
  metaDesc?: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function StorePagesPage() {
  const params = useParams()
  const storeSlug = params.store as string
  
  const [pages, setPages] = useState<StorePage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPage, setEditingPage] = useState<StorePage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchPages()
  }, [storeSlug])

  const fetchPages = async () => {
    try {
      const response = await fetch(`/api/${storeSlug}/pages`)
      if (response.ok) {
        const data = await response.json()
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (page: StorePage) => {
    setEditingPage(page)
    setIsDialogOpen(true)
  }

  const handleSave = async (formData: FormData) => {
    if (!editingPage) return

    const updatedData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      metaTitle: formData.get('metaTitle') as string,
      metaDesc: formData.get('metaDesc') as string,
      isActive: formData.get('isActive') === 'on'
    }

    try {
      const response = await fetch(`/api/${storeSlug}/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        await fetchPages()
        setIsDialogOpen(false)
        setEditingPage(null)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update page')
      }
    } catch (error) {
      console.error('Error updating page:', error)
      alert('Failed to update page')
    }
  }

  const togglePageStatus = async (pageId: string, currentStatus: boolean) => {
    try {
      const page = pages.find(p => p.id === pageId)
      if (!page) return

      const response = await fetch(`/api/${storeSlug}/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...page,
          isActive: !currentStatus
        })
      })

      if (response.ok) {
        await fetchPages()
      }
    } catch (error) {
      console.error('Error toggling page status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Kelola Halaman</h1>
          <p className="text-gray-600">Atur konten halaman-halaman di toko Anda</p>
        </div>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-lg">{page.title}</CardTitle>
                <Badge variant={page.isActive ? "default" : "secondary"}>
                  {page.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => togglePageStatus(page.id, page.isActive)}
                >
                  {page.isActive ? "Nonaktifkan" : "Aktifkan"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(page)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                    Lihat
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">URL:</span> /{page.slug}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Tipe:</span> {page.type.replace(/_/g, ' ')}
              </div>
              <div className="text-sm text-gray-500">
                Terakhir diupdate: {new Date(page.updatedAt).toLocaleDateString('id-ID')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Halaman: {editingPage?.title}</DialogTitle>
          </DialogHeader>
          
          {editingPage && (
            <form action={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Judul Halaman</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={editingPage.title}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={editingPage.slug}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    defaultValue={editingPage.metaTitle || ''}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    defaultChecked={editingPage.isActive}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive">Halaman Aktif</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="metaDesc">Meta Description (SEO)</Label>
                <Input
                  id="metaDesc"
                  name="metaDesc"
                  defaultValue={editingPage.metaDesc || ''}
                />
              </div>

              <div>
                <Label htmlFor="content">Konten Halaman</Label>
                <textarea
                  id="content"
                  name="content"
                  rows={20}
                  defaultValue={editingPage.content}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="HTML content untuk halaman..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Anda dapat menggunakan HTML untuk formatting. CSS classes Tailwind tersedia.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
