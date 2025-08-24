"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Nama terlalu pendek" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
  confirmPassword: z.string().min(6, { message: "Konfirmasi password diperlukan" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak sama",
  path: ["confirmPassword"],
});

interface Store {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

interface RegisterClientProps {
  store: Store;
}

export function RegisterClient({ store }: RegisterClientProps) {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const [registerError, setRegisterError] = useState("");

  const onSubmit = async (data: any) => {
    setRegisterError("");
    
    try {
      const response = await axios.post('/api/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        toast.success("Akun berhasil dibuat! Silakan login.");
        router.push(`/login`);
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        setRegisterError(error.response.data.error || "Terjadi kesalahan");
      } else {
        setRegisterError("Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: `/` });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 pt-24">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Store Branding */}
        <div className="text-center mb-6">
          {store.logoUrl ? (
            <div className="flex justify-center mb-4">
              <Image
                src={store.logoUrl}
                alt={`${store.name} logo`}
                width={60}
                height={60}
                className="rounded-lg"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">{store.name.charAt(0)}</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
          <p className="text-gray-600 mt-1">Buat akun baru</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Nama lengkap"
              {...register("name")}
              className={errors.name ? "border-red-500" : ""}
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
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Konfirmasi Password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {registerError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{registerError}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                Mendaftar...
              </>
            ) : (
              "Daftar"
            )}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-4"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle className="w-5 h-5 mr-2" />
            Daftar dengan Google
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Sudah punya akun?{" "}
            <Link 
              href={`/login`}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
