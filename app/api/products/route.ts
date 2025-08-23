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
    ...(search && { name: { contains: search, mode: "insensitive" } }),
    ...(category && { categoryId: category }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true, images : true },
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
    const { name, description, price, categoryId, storeId, images } = body;
    
    // Find store by slug
    const store = await prisma.store.findUnique({ 
      where: { slug: storeId } // Using storeId as slug from the client
    });
    
    if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

    // Create product with its images
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        categoryId,
        storeId: store.id,
        active: true,
        images: {
          createMany: {
            data: images.map((img: any, idx: number) => ({
              url: img.url,
              order: img.order || idx
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
    const { id, name, description, price, categoryId, storeId, images } = body;

    // Delete existing images first
    await prisma.productImage.deleteMany({
      where: { productId: id }
    });

    // Update product with new images
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        categoryId,
        images: {
          createMany: {
            data: images.map((img: any, idx: number) => ({
              url: img.url,
              order: img.order || idx
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
    console.error("[PRODUCT_UPDATE]", error);
    return NextResponse.json(
      { error: "Failed to update product" }, 
      { status: 500 }
    );
  }
}

// DELETE: Delete product
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { id } = await req.json();
    
    // Delete product images first
    await prisma.productImage.deleteMany({
      where: { productId: id }
    });
    
    // Then delete the product
    await prisma.product.delete({ 
      where: { id } 
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete product" }, 
      { status: 500 }
    );
  }
}
