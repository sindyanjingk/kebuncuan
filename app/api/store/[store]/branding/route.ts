import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(
  request: NextRequest,
  { params }: { params: { store: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { logoUrl, faviconUrl, storeName } = await request.json()
    const storeSlug = params.store

    // Find the store and verify ownership
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug },
      include: { owner: true }
    })

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    if (store.owner.email !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update store with brand assets
    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        logoUrl: logoUrl || null,
        faviconUrl: faviconUrl || null,
        name: storeName || store.name
      }
    })

    return NextResponse.json({ 
      success: true, 
      store: updatedStore 
    })

  } catch (error) {
    console.error("Error updating store branding:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
