import { prisma } from "@/lib/prisma"
import { getDefaultPages } from "@/lib/default-pages"
import { StorePageType } from "@prisma/client"

/**
 * Create default pages for a new store
 */
export async function createDefaultStorePages(storeId: string, storeName: string) {
  try {
    const defaultPages = getDefaultPages(storeName)
    
    const pageTypes: StorePageType[] = [
      'ABOUT_US',
      'FAQ', 
      'CONTACT_US',
      'HELP_CENTER',
      'RETURN_POLICY',
      'TERMS_CONDITIONS',
      'PRIVACY_POLICY',
      'TRACK_ORDER'
    ]

    const pagesToCreate = pageTypes.map((type, index) => {
      const pageData = defaultPages[type]
      if (!pageData) {
        throw new Error(`Default page data not found for type: ${type}`)
      }

      return {
        storeId,
        type,
        title: pageData.title,
        slug: pageData.slug,
        content: pageData.content,
        metaTitle: pageData.metaTitle,
        metaDesc: pageData.metaDesc,
        order: pageData.order,
        isActive: true
      }
    })

    // Create all pages in one transaction
    const createdPages = await prisma.storePage.createMany({
      data: pagesToCreate
    })

    console.log(`✅ Created ${createdPages.count} default pages for store: ${storeName}`)
    return { success: true, created: createdPages.count }
    
  } catch (error) {
    console.error('❌ Error creating default store pages:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Ensure a store has all default pages
 */
export async function ensureStoreHasDefaultPages(storeId: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        pages: true
      }
    })

    if (!store) {
      throw new Error('Store not found')
    }

    // Check which page types are missing
    const existingPageTypes = store.pages.map(page => page.type)
    const requiredPageTypes: StorePageType[] = [
      'ABOUT_US', 'FAQ', 'CONTACT_US', 'HELP_CENTER',
      'RETURN_POLICY', 'TERMS_CONDITIONS', 'PRIVACY_POLICY', 'TRACK_ORDER'
    ]
    
    const missingPageTypes = requiredPageTypes.filter(
      type => !existingPageTypes.includes(type)
    )

    if (missingPageTypes.length === 0) {
      return { success: true, hasAllPages: true, created: 0 }
    }

    // Create missing pages
    const defaultPages = getDefaultPages(store.name)
    const pagesToCreate = missingPageTypes.map(type => {
      const pageData = defaultPages[type]
      return {
        storeId: store.id,
        type,
        title: pageData.title,
        slug: pageData.slug,
        content: pageData.content,
        metaTitle: pageData.metaTitle,
        metaDesc: pageData.metaDesc,
        order: pageData.order,
        isActive: true
      }
    })

    const createdPages = await prisma.storePage.createMany({
      data: pagesToCreate
    })

    console.log(`✅ Created ${createdPages.count} missing pages for store: ${store.name}`)
    return { success: true, hasAllPages: false, created: createdPages.count }
    
  } catch (error) {
    console.error('❌ Error ensuring store has default pages:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Get all pages for a store (for navigation/sitemap)
 */
export async function getStorePages(storeSlug: string, activeOnly = true) {
  try {
    const pages = await prisma.storePage.findMany({
      where: {
        store: {
          slug: storeSlug
        },
        ...(activeOnly && { isActive: true })
      },
      orderBy: {
        order: 'asc'
      },
      select: {
        id: true,
        type: true,
        title: true,
        slug: true,
        order: true,
        isActive: true
      }
    })

    return { success: true, pages }
  } catch (error) {
    console.error('❌ Error getting store pages:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
