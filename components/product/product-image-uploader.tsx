"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Upload, X, Plus } from "lucide-react"

interface ProductImageUploaderProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  maxSize?: number
}

export function ProductImageUploader({ 
  images = [],
  onImagesChange,
  maxImages = 5,
  maxSize = 5
}: ProductImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    // Check if adding these files would exceed max limit
    if (images.length + files.length > maxImages) {
      setError(`Maksimal ${maxImages} gambar per produk`)
      return
    }

    setError("")
    setIsUploading(true)

    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File ${file.name} terlalu besar. Maksimal ${maxSize}MB`)
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File ${file.name} harus berupa gambar`)
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Gagal upload ${file.name}`)
        }

        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      const newImages = [...images, ...uploadedUrls]
      onImagesChange(newImages)
      
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal upload gambar')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const canAddMore = images.length < maxImages

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Gambar Produk (Maksimal {maxImages})</Label>
        <span className="text-sm text-gray-500">{images.length}/{maxImages}</span>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative group aspect-square border-2 border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={`Gambar produk ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Add Image Button */}
        {canAddMore && (
          <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colors">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 p-4"
            >
              {isUploading ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <Plus className="w-6 h-6 mb-1" />
              )}
              <span className="text-xs text-center">
                {isUploading ? 'Uploading...' : 'Tambah Gambar'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Format yang didukung: JPG, PNG, GIF, WebP</p>
        <p>• Ukuran maksimal: {maxSize}MB per gambar</p>
        <p>• Gambar pertama akan dijadikan sebagai gambar utama</p>
        <p>• Anda dapat memilih beberapa gambar sekaligus</p>
      </div>
    </div>
  )
}
