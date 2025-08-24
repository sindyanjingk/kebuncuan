import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDefaultStoreSettings } from "@/lib/store-settings"
import { createDefaultStorePages } from "@/lib/store-pages"

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');
        const includeSettings = searchParams.get('includeSettings') === 'true';

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        const store = await prisma.store.findUnique({
            where: { 
                slug,
                deletedAt: null // Only return non-deleted stores
            },
            select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                faviconUrl: true,
                ownerId: true,
                settings: includeSettings
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
        // Buat store dengan default settings
        const defaultSettings = getDefaultStoreSettings({ storeName: name })
        
        const store = await prisma.store.create({
            data: {
                name,
                slug,
                ownerId: user.id,
                templateId: templateId || 'clean-minimal', // Default template
                settings: {
                    create: defaultSettings
                }
            },
            include: {
                settings: true,
                template: true
            }
        })

        // Create default pages for the store
        const pagesResult = await createDefaultStorePages(store.id, store.name)
        
        return NextResponse.json({ 
            message: "Toko berhasil dibuat", 
            slug: store.slug,
            store: {
                id: store.id,
                name: store.name,
                slug: store.slug,
                hasSettings: !!store.settings,
                template: store.template?.name,
                defaultPagesCreated: pagesResult.success ? pagesResult.created : 0
            }
        })
    } catch (error: any) {
        console.log({ error });
        return NextResponse.json({ message: "Terjadi kesalahan", error: error?.message || String(error) }, { status: 500 })
    }
}
