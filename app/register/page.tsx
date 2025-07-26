"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import { signIn } from "next-auth/react"

const registerSchema = z.object({
  name: z.string().min(2, { message: "Nama terlalu pendek" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
})

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data: any) => {
    console.log("Registering:", data)
    // Kirim data ke backend: /api/register
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        {/* Branding KebunCuan */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-700">KebunCuan</h1>
          <p className="text-sm text-neutral-500 mt-1">Buka toko online UMKM kamu dalam hitungan menit</p>
        </div>

        <h2 className="text-lg font-semibold text-neutral-800 mb-4 text-center">Daftar Akun Baru</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input placeholder="Nama lengkap" {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Input placeholder="Email" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Input type="password" placeholder="Kata sandi" {...register("password")} />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
            Daftar
          </Button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-2 my-6">
          <div className="h-px bg-neutral-300 flex-1" />
          <span className="text-sm text-neutral-500">atau</span>
          <div className="h-px bg-neutral-300 flex-1" />
        </div>

        {/* Google Register */}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => signIn("google")}
        >
          <FcGoogle size={20} /> Daftar dengan Google
        </Button>

        <p className="text-sm text-center text-neutral-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-green-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  )
}
