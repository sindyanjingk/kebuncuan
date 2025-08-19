import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/orders?store=slug
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const storeSlug = searchParams.get("store");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  if (!storeSlug) return NextResponse.json({ error: "store param required" }, { status: 400 });

  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const total = await prisma.order.count({ where: { product: { storeId: store.id } } });
  const orders = await prisma.order.findMany({
    where: { product: { storeId: store.id } },
    include: {
      product: true,
      user: true,
      payment: true,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: orders, total });
}

// POST /api/orders
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { productId } = body;
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      productId: product.id,
      status: "PENDING",
      target: user.email,
    },
    include: {
      product: true,
      user: true,
      payment: true,
    },
  });
  return NextResponse.json(order);
}
