import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { store: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { templateId } = await request.json()
    const storeSlug = params.store

    // Verify store ownership
    const store = await prisma.store.findFirst({
      where: {
        slug: storeSlug,
        owner: {
          email: session.user.email
        }
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found or unauthorized' },
        { status: 404 }
      )
    }

    // Verify template exists and is active
    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        isActive: true
      }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found or inactive' },
        { status: 404 }
      )
    }

    // Update store template
    const updatedStore = await prisma.store.update({
      where: {
        id: store.id
      },
      data: {
        templateId: templateId
      },
      include: {
        template: true
      }
    })

    return NextResponse.json({ 
      store: updatedStore,
      message: 'Template updated successfully'
    })
  } catch (error) {
    console.error('Error updating template:', error)
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    )
  }
}
