import React, { useState } from 'react'


import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { LoginModal } from "@/components/auth-modals"
import { StoreRegisterModal } from "@/components/store-register-modal"
import { StoreAuthStatus } from "@/components/store-auth-status"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BuyButton } from '@/components/buy-button'

export default async function Page({ params }: { params: { slug: string } }) {
  const store = await prisma.store.findUnique({
    where: { slug: params.slug },
    include: { products: { include: { category: true } } },
  });
  if (!store) return notFound();

  const session = await getServerSession(authOptions)

  return (
    <main className="flex flex-col items-center min-h-screen py-10 px-4 bg-gradient-to-br from-green-50 to-white">
      <div className="w-full max-w-3xl flex flex-col items-center mb-10">
        <h1 className="text-4xl font-extrabold text-green-700 mb-2 drop-shadow">{store.name}</h1>
        <p className="text-muted-foreground mb-4">Toko: {store.slug}</p>
        {session ?
          <StoreAuthStatus session={session} /> :
          <div className="flex gap-4 mt-2">
            <LoginModal />
            <StoreRegisterModal />
          </div>
        }
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {store.products.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">Belum ada produk</div>
        ) : (
          store.products.map((product) => (
            <div key={product.id} className="flex flex-col">
              <div className="rounded-2xl border bg-white/80 shadow-lg hover:shadow-2xl transition p-6 flex flex-col h-full group">
                <div className="font-bold text-lg mb-1 group-hover:text-green-700 transition">{product.name}</div>
                <div className="text-xs text-muted-foreground mb-2">{product.category?.name || '-'}</div>
                <div className="font-extrabold text-green-700 text-xl mb-2">Rp {product.price.toLocaleString('id-ID')}</div>
                <div className="flex-1 text-sm mb-3 text-gray-700">{product.description}</div>
                <div className="mt-auto flex gap-2 items-center">
                  <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{product.active ? 'Aktif' : 'Nonaktif'}</span>
                  <BuyButton productId={product.id} disabled={!product.active} session={session} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}