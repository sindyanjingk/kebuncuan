"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

const storeSchema = z.object({
  name: z.string().min(2, { message: "Nama toko terlalu pendek" }),
  slug: z.string().min(2, { message: "Slug toko terlalu pendek" }).regex(/^[a-z0-9-]+$/, { message: "Slug hanya boleh huruf kecil, angka, dan strip" })
})

export default function OnboardingPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(storeSchema) })

  const onSubmit = async (data: any) => {
    const res = await fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      const { slug } = await res.json()
      router.push(`/${slug}/dashboard`)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">KebunCuan</h1>
          </div>
          <p className="text-sm text-gray-500">Langkah terakhir - buat toko online Anda</p>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">Buat Toko Baru</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Nama Toko" {...register("name")} className="h-11"/>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Input placeholder="Slug (alamat unik, misal: tokorina)" {...register("slug")} className="h-11"/>
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full mt-6 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            {isSubmitting ? "Membuat Toko..." : "Buat Toko Sekarang"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            💡 <strong>Tips:</strong> Slug akan menjadi alamat toko Anda, contoh: namatoko.kebuncuan.com
          </p>
        </div>
      </div>
    </main>
  )
}
