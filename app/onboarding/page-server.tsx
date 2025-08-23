import { prisma } from "@/lib/prisma"
import OnboardingClient from "./onboarding-client"

interface Template {
  id: string
  name: string
  description: string
  category: string
  previewImage?: string
  thumbnailImage?: string
  isActive: boolean
  _count: {
    stores: number
  }
}

async function getTemplates(): Promise<Template[]> {
  try {
    const templates = await prisma.template.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: {
            stores: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return templates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      previewImage: template.previewImage || undefined,
      thumbnailImage: template.thumbnailImage || undefined,
      isActive: template.isActive,
      _count: {
        stores: template._count.stores
      }
    }))
  } catch (error) {
    console.error('Error fetching templates:', error)
    return []
  }
}

export default async function OnboardingPage() {
  const templates = await getTemplates()
  
  return <OnboardingClient initialTemplates={templates} />
}
