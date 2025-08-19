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
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Buat Toko Baru</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Nama Toko" {...register("name")}/>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Input placeholder="Slug (alamat unik, misal: tokorina)" {...register("slug")}/>
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
            Buat Toko
          </Button>
        </form>
      </div>
    </main>
  )
}
