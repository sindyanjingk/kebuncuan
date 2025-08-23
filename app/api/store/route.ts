import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const store = await prisma.store.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                faviconUrl: true,
                ownerId: true
            }
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        return NextResponse.json({ store });
    } catch (error: any) {
        console.error("Error fetching store:", error);
        return NextResponse.json(
            { error: "Failed to fetch store data" }, 
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { name, slug, templateId } = await req.json()
        if (!name || !slug) {
            return NextResponse.json({ error: "Nama dan slug wajib diisi" }, { status: 400 })
        }
        // Cari user berdasarkan email session
        const user = await prisma.user.findUnique({ where: { email: session.user.email } })
        if (!user) {
            return NextResponse.json({ error: `User dengan email ${session.user.email} tidak ditemukan di database` }, { status: 404 })
        }
        // Cek slug unik
        const existing = await prisma.store.findUnique({ where: { slug } })
        if (existing) {
            return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 400 })
        }
        // Buat store
        const store = await prisma.store.create({
            data: {
                name,
                slug,
                ownerId: user.id,
                templateId: templateId || null
            },
        })
        return NextResponse.json({ message: "Toko berhasil dibuat", slug: store.slug })
    } catch (error: any) {
        console.log({ error });
        return NextResponse.json({ message: "Terjadi kesalahan", error: error?.message || String(error) }, { status: 500 })
    }
}
