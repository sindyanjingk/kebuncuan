import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth-helpers"

export async function DELETE(
  request: Request,
  { params }: { params: { store: string, productId: string, imageId: string } }
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

    // Delete image
    const image = await prisma.productImage.delete({
      where: {
        id: params.imageId,
        productId: params.productId
      }
    })

    // Reorder remaining images
    await prisma.productImage.updateMany({
      where: {
        productId: params.productId,
        order: {
          gt: image.order
        }
      },
      data: {
        order: {
          decrement: 1
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PRODUCT_IMAGE_DELETE]", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
