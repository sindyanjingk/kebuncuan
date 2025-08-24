"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import { signIn } from "next-auth/react"
import axios from 'axios'
import { toast } from "sonner"
import { Loader2Icon, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const registerSchema = z.object({
  name: z.string().min(2, { message: "Nama terlalu pendek" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ 
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  })
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: RegisterForm) => {
    console.log("Registering:", data)
    try {
      const response = await axios.post(`/api/register`, {
        username: data.name,
        email: data.email,
        password: data.password
      })
      if (response.status === 200) {
        toast.success(response.data?.message || "Success register user")
        router.push(`/login`)
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.response?.data?.error || "Terjadi kesalahan")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Branding KebunCuan */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">KebunCuan</h1>
          </div>
          <p className="text-sm text-gray-500">Buka toko online UMKM kamu dalam hitungan menit</p>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">Daftar Akun Baru</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input 
              placeholder="Nama lengkap" 
              {...register("name")} 
              className="h-11" 
              autoComplete="name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input 
              type="email"
              placeholder="Email" 
              {...register("email")} 
              className="h-11" 
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Kata sandi" 
              {...register("password")} 
              className="h-11 pr-10" 
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full mt-6 h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            {
              isSubmitting ?
                <Loader2Icon className="animate-spin" /> :
                "Daftar Sekarang"
            }
          </Button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-gray-300 flex-1" />
          <span className="text-sm text-gray-500">atau</span>
          <div className="h-px bg-gray-300 flex-1" />
        </div>

        {/* Google Register */}
        <Button
          variant="outline"
          className="w-full h-11 flex items-center justify-center gap-2 hover:bg-gray-50"
          onClick={() => signIn("google")}
        >
          <FcGoogle size={20} /> Daftar dengan Google
        </Button>

        <p className="text-sm text-center text-gray-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  )
}
