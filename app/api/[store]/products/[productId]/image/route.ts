import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { put } from "@vercel/blob"
import { getAuthUser } from "@/lib/auth-helpers"

// Route segment config for file uploads
export const maxDuration = 60 // 60 seconds timeout for file uploads

export async function POST(
  request: Request,
  { params }: { params: { store: string, productId: string } }
) {
  try {
    // Get authenticated user
    const user = await getAuthUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Verify store ownership
    const store = await prisma.store.findFirst({
      where: {
        slug: params.store,
        ownerId: user.id
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      )
    }

    // Verify product exists and belongs to store
    const product = await prisma.product.findFirst({
      where: {
        id: params.productId,
        storeId: store.id
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Max size 4MB
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 4MB" },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const order = parseInt(formData.get("order") as string) || 0
    const blob = await put(
      `product-${product.id}-${Date.now()}.${file.type.split("/")[1]}`, 
      file, 
      { access: "public" }
    )

    // Create new product image
    const productImage = await prisma.productImage.create({
      data: {
        url: blob.url,
        productId: product.id,
        order
      }
    })

    return NextResponse.json(productImage)
  } catch (error) {
    console.error("[PRODUCT_IMAGE_UPLOAD]", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
