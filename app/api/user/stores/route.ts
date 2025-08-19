import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")
  if (!email) {
    return NextResponse.json({ error: "Email diperlukan" }, { status: 400 })
  }
  const user = await prisma.user.findUnique({
    where: { email },
    include: { stores: true },
  })
  if (!user) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
  }
  return NextResponse.json({ stores: user.stores })
}
