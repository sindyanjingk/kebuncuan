import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { store: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const storeSlug = params.store

    // Verify store ownership
    const store = await prisma.store.findFirst({
      where: {
        slug: storeSlug,
        owner: {
          email: session.user.email
        },
        deletedAt: null // Only allow deleting non-deleted stores
      },
      include: {
        products: {
          where: {
            deletedAt: null
          }
        },
        pages: true,
        settings: true
      }
    })

    if (!store) {
      return NextResponse.json({ 
        error: "Store not found or unauthorized" 
      }, { status: 404 })
    }

    // Soft delete the store
    const deletedStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        deletedAt: new Date()
      }
    })

    return NextResponse.json({ 
      message: "Store deleted successfully",
      deletedStore: {
        id: deletedStore.id,
        name: deletedStore.name,
        slug: deletedStore.slug,
        deletedAt: deletedStore.deletedAt
      }
    })
    
  } catch (error: any) {
    console.error("Error deleting store:", error)
    return NextResponse.json(
      { error: "Failed to delete store" }, 
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { store: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const storeSlug = params.store

    // Verify store ownership
    const store = await prisma.store.findFirst({
      where: {
        slug: storeSlug,
        owner: {
          email: session.user.email
        },
        deletedAt: { not: null } // Only allow restoring deleted stores
      }
    })

    if (!store) {
      return NextResponse.json({ 
        error: "Store not found, unauthorized, or not deleted" 
      }, { status: 404 })
    }

    // Restore the store
    const restoredStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        deletedAt: null
      }
    })

    return NextResponse.json({ 
      message: "Store restored successfully",
      restoredStore: {
        id: restoredStore.id,
        name: restoredStore.name,
        slug: restoredStore.slug,
        deletedAt: restoredStore.deletedAt
      }
    })
    
  } catch (error: any) {
    console.error("Error restoring store:", error)
    return NextResponse.json(
      { error: "Failed to restore store" }, 
      { status: 500 }
    )
  }
}
