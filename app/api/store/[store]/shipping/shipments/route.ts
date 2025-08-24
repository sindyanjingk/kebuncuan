import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { store: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify store ownership
    const store = await prisma.store.findFirst({
      where: {
        slug: params.store,
        deletedAt: null,
        owner: { email: session.user.email }
      }
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Get shipments with related data
    const shipments = await prisma.shipment.findMany({
      where: {
        order: {
          product: {
            storeId: store.id
          }
        }
      },
      include: {
        order: {
          include: {
            product: {
              select: {
                id: true,
                name: true
              }
            },
            user: {
              select: {
                id: true,
                email: true,
                username: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(shipments)
  } catch (error) {
    console.error('[GET_SHIPMENTS]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
