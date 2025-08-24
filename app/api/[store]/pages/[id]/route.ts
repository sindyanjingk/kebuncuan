import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: { store: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { store: storeSlug, id } = params

    // Get page and verify ownership
    const page = await prisma.storePage.findFirst({
      where: {
        id,
        store: {
          slug: storeSlug,
          owner: {
            email: session.user.email
          }
        }
      },
      include: {
        store: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    })

    if (!page) {
      return NextResponse.json({ error: "Page not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ page })
    
  } catch (error: any) {
    console.error("Error fetching store page:", error)
    return NextResponse.json(
      { error: "Failed to fetch page" }, 
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { store: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { store: storeSlug, id } = params
    const { title, slug, content, metaTitle, metaDesc, isActive } = await req.json()

    // Verify page ownership
    const existingPage = await prisma.storePage.findFirst({
      where: {
        id,
        store: {
          slug: storeSlug,
          owner: {
            email: session.user.email
          }
        }
      }
    })

    if (!existingPage) {
      return NextResponse.json({ error: "Page not found or unauthorized" }, { status: 404 })
    }

    // Check if new slug conflicts with other pages (excluding current page)
    if (slug !== existingPage.slug) {
      const conflictingPage = await prisma.storePage.findFirst({
        where: {
          storeId: existingPage.storeId,
          slug,
          id: {
            not: id
          }
        }
      })

      if (conflictingPage) {
        return NextResponse.json({ error: "Slug already exists for this store" }, { status: 400 })
      }
    }

    // Update page
    const updatedPage = await prisma.storePage.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        metaTitle,
        metaDesc,
        isActive
      }
    })

    return NextResponse.json({ 
      message: "Page updated successfully",
      page: updatedPage 
    })
    
  } catch (error: any) {
    console.error("Error updating store page:", error)
    return NextResponse.json(
      { error: "Failed to update page" }, 
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { store: string; id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { store: storeSlug, id } = params

    // Verify page ownership
    const page = await prisma.storePage.findFirst({
      where: {
        id,
        store: {
          slug: storeSlug,
          owner: {
            email: session.user.email
          }
        }
      }
    })

    if (!page) {
      return NextResponse.json({ error: "Page not found or unauthorized" }, { status: 404 })
    }

    // Delete page
    await prisma.storePage.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: "Page deleted successfully" 
    })
    
  } catch (error: any) {
    console.error("Error deleting store page:", error)
    return NextResponse.json(
      { error: "Failed to delete page" }, 
      { status: 500 }
    )
  }
}
