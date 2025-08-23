import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: List products with filtering, search, sort, and pagination

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const store = searchParams.get("store");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";
  const category = searchParams.get("category") || undefined;

  if (!store) return NextResponse.json({ products: [], total: 0 });

  const where: any = {
    store: { slug: store },
    deletedAt: null, // Only show non-deleted products
    ...(search && { name: { contains: search, mode: "insensitive" } }),
    ...(category && { categoryId: category }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true, images : { orderBy: { order: 'asc' } } },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total });
}

// POST: Create product
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const { name, description, price, modalPrice, productType, categoryId, storeSlug, images = [] } = body;
    
    // Find store by slug
    const store = await prisma.store.findUnique({ 
      where: { slug: storeSlug }
    });
    
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    // Create product with its images
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        modalPrice: Number(modalPrice || 0),
        productType: productType || 'DIGITAL',
        categoryId,
        storeId: store.id,
        active: true,
        images: {
          createMany: {
            data: images.map((imageUrl: string, index: number) => ({
              url: imageUrl,
              order: index
            }))
          }
        }
      },
      include: {
        category: true,
        images: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_CREATE]", error);
    return NextResponse.json(
      { error: "Failed to create product" }, 
      { status: 500 }
    );
  }
}

// PUT: Update product
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const body = await req.json();
    const { id, name, description, price, modalPrice, productType, categoryId, images = [] } = body;

    // Delete existing images first
    await prisma.productImage.deleteMany({
      where: { productId: id }
    });

    // Update product with new images
    const product = await prisma.product.update({
      where: { 
        id,
        deletedAt: null // Only update non-deleted products
      },
      data: {
        name,
        description,
        price: Number(price),
        modalPrice: Number(modalPrice || 0),
        productType: productType || 'DIGITAL',
        categoryId,
        images: {
          createMany: {
            data: images.map((imageUrl: string, index: number) => ({
              url: imageUrl,
              order: index
            }))
          }
        }
      },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } }
      }
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_UPDATE]", error);
    return NextResponse.json(
      { error: "Failed to update product" }, 
      { status: 500 }
    );
  }
}

// DELETE: Soft delete product
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { id } = await req.json();
    
    // Soft delete the product by setting deletedAt
    const product = await prisma.product.update({
      where: { 
        id,
        deletedAt: null // Only delete non-deleted products
      },
      data: {
        deletedAt: new Date()
      }
    });
    
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete product" }, 
      { status: 500 }
    );
  }
}
