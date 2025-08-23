"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Upload, X } from "lucide-react"

interface ImageUploaderProps {
  label: string
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  accept?: string
  maxSize?: number
  recommended?: string
}

export function ImageUploader({ 
  label, 
  currentImage, 
  onImageChange, 
  accept = "image/*",
  maxSize = 5,
  recommended 
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File terlalu besar. Maksimal ${maxSize}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar')
      return
    }

    setError("")
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Gagal upload gambar')
      }

      const data = await response.json()
      onImageChange(data.url)
    } catch (err) {
      setError('Gagal upload gambar. Silakan coba lagi.')
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{label}</Label>
        {recommended && (
          <p className="text-xs text-gray-500">{recommended}</p>
        )}
      </div>

      {currentImage ? (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={currentImage}
              alt={label}
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div 
          className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Upload</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Pilih File"}
          </Button>
          
          {currentImage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
            >
              Hapus
            </Button>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
