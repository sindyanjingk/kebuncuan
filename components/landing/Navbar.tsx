"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-green-700">KebunCuan</Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Masuk</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Daftar</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
