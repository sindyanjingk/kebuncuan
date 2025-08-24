import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { store: string } }
) {
  try {
    const body = await request.json()
    const { store: storeSlug } = params

    // Find the store
    const store = await prisma.store.findFirst({
      where: { 
        slug: storeSlug,
        deletedAt: null // Only allow customization of non-deleted stores
      },
      include: { template: true }
    })

    if (!store) {
      return NextResponse.json({ error: 'Store tidak ditemukan' }, { status: 404 })
    }

    // Update or create store settings
    await prisma.storeSetting.upsert({
      where: { storeId: store.id },
      update: {
        customization: body
      },
      create: {
        storeId: store.id,
        customization: body
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving customization:', error)
    return NextResponse.json(
      { error: 'Gagal menyimpan pengaturan' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { store: string } }
) {
  try {
    const { store: storeSlug } = params

    // Find the store with settings
    const store = await prisma.store.findFirst({
      where: { 
        slug: storeSlug,
        deletedAt: null // Only allow access to non-deleted stores
      },
      include: {
        settings: true
      }
    })

    if (!store) {
      return NextResponse.json({ error: 'Store tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({
      customization: store.settings?.customization || null
    })
  } catch (error) {
    console.error('Error fetching customization:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil pengaturan' },
      { status: 500 }
    )
  }
}
