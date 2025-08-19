"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
})

export default function LoginPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const [loginError, setLoginError] = useState("")
  const onSubmit = async (data: any) => {
    setLoginError("")
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    })
    if (result && result.ok) {
      // Cek toko user
      const res = await fetch(`/api/user/stores?email=${encodeURIComponent(data.email)}`)
      if (res.ok) {
        const json = await res.json()
        if (json.stores && json.stores.length > 0) {
          // Redirect ke dashboard toko pertama
          router.push(`/${json.stores[0].slug}/dashboard`)
        } else {
          // Redirect ke onboarding
          router.push("/onboarding")
        }
      } else {
        setLoginError("Gagal cek toko user")
      }
    } else if (result && result.error) {
      setLoginError("Login gagal: " + result.error)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        {/* Branding KebunCuan */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-700">KebunCuan</h1>
          <p className="text-sm text-neutral-500 mt-1">Platform UMKM naik kelas</p>
        </div>

        <h2 className="text-lg font-semibold text-neutral-800 mb-4 text-center">Masuk ke Akun</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {loginError && <p className="text-red-500 text-sm mb-2">{loginError}</p>}
          <div>
            <Input placeholder="Email" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Input type="password" placeholder="Kata sandi" {...register("password")} />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white">
            Masuk
          </Button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-2 my-6">
          <div className="h-px bg-neutral-300 flex-1" />
          <span className="text-sm text-neutral-500">atau</span>
          <div className="h-px bg-neutral-300 flex-1" />
        </div>

        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => signIn("google")}
        >
          <FcGoogle size={20} /> Masuk dengan Google
        </Button>

        <p className="text-sm text-center text-neutral-500 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-green-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  )
}
