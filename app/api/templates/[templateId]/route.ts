import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { templateId: string } }
) {
  try {
    const templateId = params.templateId

    const template = await prisma.template.findUnique({
      where: {
        id: templateId,
        isActive: true
      },
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
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error('Error fetching template:', error)
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    )
  }
}
