"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import Image from "next/image"

interface Props {
  username: string
  imageUrl?: string | null
  className?: string
}

export function AvatarUpload({ username, imageUrl, className }: Props) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [open, setOpen] = useState(false)
  const { update } = useSession()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleUpload = async () => {
    if (!selectedImage) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", selectedImage)

    try {
      const response = await fetch("/api/user/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      
      // Update session with new image URL
      await update({
        image: data.imageUrl
      })

      toast.success("Foto profile berhasil diperbarui!")
      setOpen(false)
      clearSelectedImage()
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Gagal mengupload foto profile")
    } finally {
      setIsUploading(false)
    }
  }

  const clearSelectedImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedImage(null)
    setPreviewUrl(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <Avatar className={className}>
            <AvatarImage src={imageUrl || undefined} />
            <AvatarFallback className="text-lg">
              {username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Foto Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            {previewUrl ? (
              <div className="relative">
                <Image 
                  src={previewUrl}
                  alt="Preview"
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px] rounded-full object-cover"
                />
                <button
                  onClick={clearSelectedImage}
                  className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X size={16} />
                </button>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-4">
            {previewUrl ? (
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>
            ) : (
              <div 
                className="relative flex items-center justify-center group cursor-pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                  <Avatar className="w-full h-full transition-opacity group-hover:opacity-75">
                    <AvatarImage 
                      src={imageUrl || undefined} 
                      className="w-full h-full object-cover"
                    />
                    <AvatarFallback className="text-6xl">
                      {username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
