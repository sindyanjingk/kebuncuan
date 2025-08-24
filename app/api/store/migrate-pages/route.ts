import { NextRequest, NextResponse } from "next/server"
import { ensureStoreHasDefaultPages } from "@/lib/store-pages"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StorePageType } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all stores and ensure they have default pages
    const stores = await prisma.store.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      }
    })

    let totalCreated = 0
    const results = []

    for (const store of stores) {
      try {
        const result = await ensureStoreHasDefaultPages(store.id)
        if (result.success) {
          totalCreated += result.created || 0
          results.push({
            storeId: store.id,
            storeName: store.name,
            slug: store.slug,
            pagesCreated: result.created || 0,
            hadAllPages: result.hasAllPages
          })
        } else {
          results.push({
            storeId: store.id,
            storeName: store.name,
            slug: store.slug,
            error: result.error
          })
        }
      } catch (error) {
        results.push({
          storeId: store.id,
          storeName: store.name,
          slug: store.slug,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      message: `Migration completed successfully`,
      totalStores: stores.length,
      totalPagesCreated: totalCreated,
      results
    })
    
  } catch (error: any) {
    console.error("Migration error:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error.message
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check how many stores don't have all required pages
    const stores = await prisma.store.findMany({
      include: {
        pages: true
      }
    })

    const requiredPageTypes: StorePageType[] = [
      'ABOUT_US', 'FAQ', 'CONTACT_US', 'HELP_CENTER',
      'RETURN_POLICY', 'TERMS_CONDITIONS', 'PRIVACY_POLICY', 'TRACK_ORDER'
    ]

    let storesNeedingPages = 0
    const storeStatus = stores.map(store => {
      const existingPageTypes = store.pages.map(page => page.type)
      const missingPageTypes = requiredPageTypes.filter(
        type => !existingPageTypes.includes(type)
      )
      
      if (missingPageTypes.length > 0) {
        storesNeedingPages++
      }

      return {
        id: store.id,
        name: store.name,
        slug: store.slug,
        totalPages: store.pages.length,
        missingPages: missingPageTypes.length,
        missingPageTypes
      }
    })

    return NextResponse.json({
      totalStores: stores.length,
      storesNeedingPages,
      storesWithAllPages: stores.length - storesNeedingPages,
      needsMigration: storesNeedingPages > 0,
      storeStatus
    })
    
  } catch (error: any) {
    console.error("Check error:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error.message
    }, { status: 500 })
  }
}
