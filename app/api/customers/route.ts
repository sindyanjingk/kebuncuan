import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url!);
  const store = searchParams.get("store");
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  if (!store) return NextResponse.json({ error: "store param required" }, { status: 400 });

  const selectedStore = await prisma.store.findFirst({
    where : {
      slug : store
    }
  })

  const where = {
    storeId: selectedStore?.id,
    OR: [
      { name: { contains: q, mode: "insensitive" as const } },
      { email: { contains: q, mode: "insensitive" as const } },
      { phone: { contains: q, mode: "insensitive" as const } },
    ],
  };
  const total = await prisma.customer.count({ where });
  const customers = await prisma.customer.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });
  console.log({customers});
  
  return NextResponse.json({ data: customers, total });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { storeId, name, email, phone } = body;
  if (!storeId || !name) return NextResponse.json({ error: "storeId & name required" }, { status: 400 });

  let userId: string | undefined = undefined;
  if (email) {
    // Cek apakah user sudah ada
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Buat user baru dengan password random
      const randomPassword = Math.random().toString(36).slice(-8);
      user = await prisma.user.create({
        data: {
          email,
          username: name,
          passwordHash: randomPassword, // HARUS diganti hash jika ingin login, ini hanya placeholder!
        },
      });
    }
    userId = user.id;
  }

  const customer = await prisma.customer.create({ data: { storeId, name, email, phone, userId } });
  return NextResponse.json(customer);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, name, email, phone } = body;
  if (!id || !name) return NextResponse.json({ error: "id & name required" }, { status: 400 });
  const customer = await prisma.customer.update({ where: { id }, data: { name, email, phone } });
  return NextResponse.json(customer);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url!);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await prisma.customer.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
