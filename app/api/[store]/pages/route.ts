import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
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
        deletedAt: null, // Only allow access to non-deleted stores
        owner: {
          email: session.user.email
        }
      }
    })

    if (!store) {
      return NextResponse.json({ error: "Store not found or unauthorized" }, { status: 404 })
    }

    // Get all pages for this store
    const pages = await prisma.storePage.findMany({
      where: {
        storeId: store.id
      },
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json({ pages })
    
  } catch (error: any) {
    console.error("Error fetching store pages:", error)
    return NextResponse.json(
      { error: "Failed to fetch pages" }, 
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
    const { title, slug, content, metaTitle, metaDesc, type, isActive } = await req.json()

    // Verify store ownership
    const store = await prisma.store.findFirst({
      where: {
        slug: storeSlug,
        deletedAt: null, // Only allow access to non-deleted stores
        owner: {
          email: session.user.email
        }
      }
    })

    if (!store) {
      return NextResponse.json({ error: "Store not found or unauthorized" }, { status: 404 })
    }

    // Check if slug is unique within the store
    const existingPage = await prisma.storePage.findFirst({
      where: {
        storeId: store.id,
        slug
      }
    })

    if (existingPage) {
      return NextResponse.json({ error: "Slug already exists for this store" }, { status: 400 })
    }

    // Create new page
    const page = await prisma.storePage.create({
      data: {
        storeId: store.id,
        type,
        title,
        slug,
        content,
        metaTitle,
        metaDesc,
        isActive: isActive ?? true,
        order: 0 // Will be updated if needed
      }
    })

    return NextResponse.json({ 
      message: "Page created successfully",
      page 
    })
    
  } catch (error: any) {
    console.error("Error creating store page:", error)
    return NextResponse.json(
      { error: "Failed to create page" }, 
      { status: 500 }
    )
  }
}
