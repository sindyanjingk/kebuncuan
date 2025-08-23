import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/templates - Get all available templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isPremium = searchParams.get('premium')

    const where: any = {
      isActive: true
    }

    if (category && category !== 'ALL') {
      where.category = category
    }

    if (isPremium !== null) {
      where.isPremium = isPremium === 'true'
    }

    const templates = await prisma.template.findMany({
      where,
      include: {
        heroConfig: true,
        featuresConfig: {
          orderBy: { order: 'asc' }
        },
        socialProofConfig: {
          include: {
            testimonials: {
              where: { isActive: true },
              orderBy: { order: 'asc' }
            }
          }
        },
        _count: {
          select: {
            stores: true
          }
        }
      },
      orderBy: [
        { isPremium: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      templates
    })

  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create new template (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (you can modify this logic)
    const isAdmin = session.user.email === 'admin@kebuncuan.com'
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      category,
      description,
      previewImage,
      thumbnailImage,
      isPremium,
      price,
      features,
      config,
      heroConfig,
      featuresConfig,
      socialProofConfig
    } = body

    const template = await prisma.template.create({
      data: {
        name,
        category,
        description,
        previewImage,
        thumbnailImage,
        isPremium: isPremium || false,
        price: price || 0,
        features,
        config,
        heroConfig: heroConfig ? {
          create: heroConfig
        } : undefined,
        featuresConfig: featuresConfig ? {
          create: featuresConfig
        } : undefined,
        socialProofConfig: socialProofConfig ? {
          create: {
            ...socialProofConfig,
            testimonials: socialProofConfig.testimonials ? {
              create: socialProofConfig.testimonials
            } : undefined
          }
        } : undefined
      },
      include: {
        heroConfig: true,
        featuresConfig: true,
        socialProofConfig: {
          include: {
            testimonials: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      template
    })

  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
