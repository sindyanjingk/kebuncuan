import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { CartClient } from "./cart-client";

export default async function CartPage({ params }: { params: { store: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect(`/login`);
  }

  // Get store
  const store = await prisma.store.findUnique({
    where: { slug: params.store },
    select: { id: true, name: true, slug: true }
  });

  if (!store) {
    notFound();
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  if (!user) {
    redirect(`/login`);
  }

  // Get cart with products
  const cart = await prisma.cart.findUnique({
    where: {
      userId_storeId: {
        userId: user.id,
        storeId: store.id
      }
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { order: 'asc' }
              },
              category: true
            }
          }
        }
      }
    }
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Keranjang Kosong</h1>
              <p className="text-gray-600 mb-8">
                Sepertinya Anda belum menambahkan item apapun ke keranjang. 
                Mulai berbelanja untuk mengisinya!
              </p>
            </div>
            <Link href={`/products`}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Lanjut Berbelanja
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <CartClient initialCart={cart} storeSlug={params.store} />;
}
