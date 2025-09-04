
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { username, email, password, slug } = await req.json();
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Simpan user baru
    const user = await prisma.user.create({
      data: { username, email, passwordHash: hashedPassword },
    });

    // Jika slug ada, tambahkan ke tabel customer
    if (slug) {
      const store = await prisma.store.findUnique({ where: { slug } });
      if (store) {
        await prisma.customer.create({
          data: {
            storeId: store.id,
            userId: user.id,
            name : username,
            email,
          },
        });
      }
    }

    return NextResponse.json({ message: "Registrasi berhasil", user: { id: user.id, name: user.username, email: user.email } });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
