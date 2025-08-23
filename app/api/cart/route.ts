import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET: Ambil cart user untuk store tertentu
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const storeSlug = searchParams.get('storeSlug')

    if (!storeSlug) {
      return NextResponse.json({ error: "Store slug is required" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find store
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug }
    })

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
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
                  orderBy: { order: 'asc' },
                  take: 1
                },
                category: true
              }
            }
          }
        }
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          storeId: store.id
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    orderBy: { order: 'asc' },
                    take: 1
                  },
                  category: true
                }
              }
            }
          }
        }
      })
    }

    return NextResponse.json({ cart })
  } catch (error: any) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

// POST: Tambah item ke cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, storeSlug, quantity = 1 } = await req.json()

    if (!productId || !storeSlug) {
      return NextResponse.json({ error: "Product ID and store slug are required" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find store
    const store = await prisma.store.findUnique({
      where: { slug: storeSlug }
    })

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 })
    }

    // Check if product exists and is active
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        storeId: store.id,
        active: true
      }
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found or inactive" }, { status: 404 })
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: {
        userId_storeId: {
          userId: user.id,
          storeId: store.id
        }
      }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          storeId: store.id
        }
      })
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId
        }
      }
    })

    let cartItem
    if (existingItem) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              images: {
                orderBy: { order: 'asc' },
                take: 1
              },
              category: true
            }
          }
        }
      })
    } else {
      // Create new item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        },
        include: {
          product: {
            include: {
              images: {
                orderBy: { order: 'asc' },
                take: 1
              },
              category: true
            }
          }
        }
      })
    }

    return NextResponse.json({ 
      message: "Item added to cart",
      cartItem 
    })
  } catch (error: any) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

// PUT: Update quantity item di cart
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cartItemId, quantity } = await req.json()

    if (!cartItemId || quantity < 0) {
      return NextResponse.json({ error: "Cart item ID and valid quantity are required" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: user.id
        }
      }
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    if (quantity === 0) {
      // Remove item
      await prisma.cartItem.delete({
        where: { id: cartItemId }
      })
      return NextResponse.json({ message: "Item removed from cart" })
    } else {
      // Update quantity
      const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
        include: {
          product: {
            include: {
              images: {
                orderBy: { order: 'asc' },
                take: 1
              },
              category: true
            }
          }
        }
      })
      return NextResponse.json({ 
        message: "Quantity updated",
        cartItem: updatedItem 
      })
    }
  } catch (error: any) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}

// DELETE: Hapus item dari cart
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const cartItemId = searchParams.get('cartItemId')

    if (!cartItemId) {
      return NextResponse.json({ error: "Cart item ID is required" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify cart item belongs to user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: user.id
        }
      }
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    })

    return NextResponse.json({ message: "Item removed from cart" })
  } catch (error: any) {
    console.error("Error deleting cart item:", error)
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 })
  }
}
