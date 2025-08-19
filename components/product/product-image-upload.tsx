"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { IconUpload, IconX, IconPhoto, IconPlus } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface ProductImage {
  id: string
  url: string
  order: number
  file?: File // For local preview images
}

interface Props {
  value?: ProductImage[] 
  onChange?: (images: ProductImage[]) => void
  maxFiles?: number
  className?: string
  onUpload?: (files: File[]) => Promise<string[]> // Optional upload handler
}

const DEFAULT_IMAGE = "/images/product-placeholder.png"
const MAX_IMAGES = 5

export function ProductImageUpload({ value = [], onChange, maxFiles = MAX_IMAGES, className }: Props) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [currentImages, setCurrentImages] = useState<ProductImage[]>(value)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const newImage: ProductImage = {
        id: Math.random().toString(36).slice(2),
        url: url,
        order: currentImages.length,
        file: file // Store the file for later upload
      }
      
      const updatedImages = [...currentImages, newImage]
      setCurrentImages(updatedImages)
      onChange?.(updatedImages)
    }
  }

  const handleImageDelete = (imageId: string) => {
    const updatedImages = currentImages.filter((img) => img.id !== imageId)
    setCurrentImages(updatedImages)
    onChange?.(updatedImages)
  }

  const clearSelectedImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedImage(null)
    setPreviewUrl(null)
  }

  // Keep images in sync with value prop and ensure all images have valid URLs
  useEffect(() => {
    if (Array.isArray(value)) {
      const validImages = value.filter(img => img && img.url && typeof img.url === 'string');
      console.log("Setting current images:", validImages);
      setCurrentImages(validImages);
    } else {
      setCurrentImages([]);
    }
  }, [value])

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...currentImages]
    const [movedItem] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedItem)
    
    // Update order numbers
    const updatedImages = newImages.map((img, idx) => ({
      ...img,
      order: idx
    }))
    
    setCurrentImages(updatedImages)
    onChange?.(updatedImages)
  }

  const mainImage = currentImages[0]

  return (
    <Dialog>
      <DialogTrigger>
        <div className={cn(
          "relative group cursor-pointer border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden hover:border-primary/50 transition-colors h-[200px]",
          className
        )}>
          <Image
            src={mainImage?.url || DEFAULT_IMAGE}
            alt="Product"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <IconUpload className="w-8 h-8 text-white" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Images</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Current Images Grid */}
          <div className="grid grid-cols-3 gap-2">
            {currentImages.map((image, index) => (
              <div 
                key={image.id} 
                className="relative aspect-square h-[80px]"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', index.toString())
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
                  reorderImages(fromIndex, index)
                }}
              >
                <Image
                  src={image.url || DEFAULT_IMAGE}
                  alt={`Product ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-lg cursor-move"
                  onError={(e) => {
                    // If image fails to load, set to default image
                    const imgElement = e.target as HTMLImageElement;
                    imgElement.src = DEFAULT_IMAGE;
                  }}
                />
                <button
                  onClick={() => handleImageDelete(image.id)}
                  className="absolute -top-1 -right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <IconX size={14} />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
                    Main
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-lg" />
              </div>
            ))}
            {currentImages.length < MAX_IMAGES && (
              <button
                onClick={() => document.getElementById('product-image-upload')?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/50 hover:text-primary/50 transition-colors"
              >
                <IconPlus className="w-6 h-6" />
                <span className="text-xs">Add Image</span>
              </button>
            )}
          </div>

          {/* Upload Preview */}
          {previewUrl && (
            <div className="space-y-4">
              <div className="relative">
                <Image 
                  src={previewUrl}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="rounded-lg object-cover w-full h-[200px]"
                />
                <button
                  onClick={clearSelectedImage}
                  className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <IconX size={16} />
                </button>
              </div>
              <Button 
                onClick={() => document.getElementById('product-image-upload')?.click()}
                disabled={currentImages.length >= maxFiles}
                className="w-full"
              >
                <IconUpload className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            id="product-image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
