import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get store settings
export async function GET(
  req: NextRequest,
  { params }: { params: { store: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { store: storeSlug } = params

    // Find the store and verify ownership
    const store = await prisma.store.findFirst({
      where: {
        slug: storeSlug,
        deletedAt: null, // Only allow access to non-deleted stores
        owner: {
          email: session.user.email
        }
      },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        faviconUrl: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        phone: true
      }
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found or unauthorized' }, { status: 404 })
    }

    return NextResponse.json({ store })
  } catch (error) {
    console.error('Error fetching store settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update store settings
export async function PUT(
  req: NextRequest,
  { params }: { params: { store: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { store: storeSlug } = params
    const body = await req.json()
    const { name, logoUrl, faviconUrl, address, city, province, postalCode, phone } = body

    // Find the store and verify ownership
    const store = await prisma.store.findFirst({
      where: {
        slug: storeSlug,
        deletedAt: null, // Only allow updates to non-deleted stores
        owner: {
          email: session.user.email
        }
      }
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found or unauthorized' }, { status: 404 })
    }

    // Update store data
    const updatedStore = await prisma.store.update({
      where: { id: store.id },
      data: {
        ...(name && { name }),
        ...(logoUrl !== undefined && { logoUrl: logoUrl || null }),
        ...(faviconUrl !== undefined && { faviconUrl: faviconUrl || null }),
        ...(address !== undefined && { address: address || null }),
        ...(city !== undefined && { city: city || null }),
        ...(province !== undefined && { province: province || null }),
        ...(postalCode !== undefined && { postalCode: postalCode || null }),
        ...(phone !== undefined && { phone: phone || null }),
      },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        faviconUrl: true,
        address: true,
        city: true,
        province: true,
        postalCode: true,
        phone: true
      }
    })

    return NextResponse.json({ 
      message: 'Store settings updated successfully',
      store: updatedStore 
    })
  } catch (error) {
    console.error('Error updating store settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
