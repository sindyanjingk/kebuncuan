"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
})

interface Store {
  id: string
  name: string
  slug: string
  logoUrl?: string | null
  faviconUrl?: string | null
}

export default function TenantLoginPage() {
  const router = useRouter()
  const params = useParams()
  const storeSlug = params.store as string
  
  const [store, setStore] = useState<Store | null>(null)
  const [isLoadingStore, setIsLoadingStore] = useState(true)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const [loginError, setLoginError] = useState("")

  // Load store data
  useEffect(() => {
    const loadStore = async () => {
      try {
        const response = await fetch(`/api/store?slug=${storeSlug}`)
        if (response.ok) {
          const data = await response.json()
          setStore(data.store || null)
        }
      } catch (error) {
        console.error('Error loading store:', error)
      } finally {
        setIsLoadingStore(false)
      }
    }

    loadStore()
  }, [storeSlug])
  
  const onSubmit = async (data: any) => {
    setLoginError("")
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    })
    if (result && result.ok) {
      // Redirect back to the store home page
      router.push(`/`)
    } else if (result && result.error) {
      setLoginError("Login gagal: " + result.error)
    }
  }

  if (isLoadingStore) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!store) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            <p className="text-red-600">Toko tidak ditemukan</p>
            <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
              Kembali ke beranda
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Store Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {store.logoUrl ? (
              <div className="relative w-12 h-12">
                <Image
                  src={store.logoUrl}
                  alt={`${store.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">{store.name.charAt(0)}</span>
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
          </div>
          <p className="text-sm text-gray-500">Login untuk berbelanja</p>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">Masuk ke Akun</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {loginError && <p className="text-red-500 text-sm mb-2 bg-red-50 p-3 rounded-lg border border-red-200">{loginError}</p>}
          <div>
            <Input placeholder="Email" {...register("email")} className="h-11" />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Input type="password" placeholder="Kata sandi" {...register("password")} className="h-11" />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full mt-6 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            {isSubmitting ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-gray-300 flex-1" />
          <span className="text-sm text-gray-500">atau</span>
          <div className="h-px bg-gray-300 flex-1" />
        </div>

        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full h-11 flex items-center justify-center gap-2 hover:bg-gray-50"
          onClick={() => signIn("google")}
        >
          <FcGoogle size={20} /> Masuk dengan Google
        </Button>

        <p className="text-sm text-center text-gray-500 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline font-semibold">
            Daftar di sini
          </Link>
        </p>
        
        <p className="text-sm text-center text-gray-400 mt-4">
          <Link href="/" className="hover:underline">
            ← Kembali ke {store.name}
          </Link>
        </p>
      </div>
    </main>
  )
}
