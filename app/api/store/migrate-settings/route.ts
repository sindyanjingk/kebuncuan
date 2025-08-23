import { NextRequest, NextResponse } from "next/server"
import { ensureAllStoresHaveSettings } from "@/lib/ensure-store-settings"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For now, allow any authenticated user to run this migration
    // In production, you might want to restrict this to admin users only
    const result = await ensureAllStoresHaveSettings()
    
    if (result.success) {
      return NextResponse.json({
        message: `Migration completed successfully`,
        storesUpdated: result.created,
        details: result.created === 0 
          ? "All stores already have settings" 
          : `Created settings for ${result.created} stores`
      })
    } else {
      return NextResponse.json({
        error: "Migration failed",
        details: result.error
      }, { status: 500 })
    }
    
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

    // Check how many stores don't have settings
    const { prisma } = await import("@/lib/prisma")
    
    const storesWithoutSettings = await prisma.store.count({
      where: {
        settings: null
      }
    })

    const totalStores = await prisma.store.count()

    return NextResponse.json({
      totalStores,
      storesWithoutSettings,
      storesWithSettings: totalStores - storesWithoutSettings,
      needsMigration: storesWithoutSettings > 0
    })
    
  } catch (error: any) {
    console.error("Check error:", error)
    return NextResponse.json({
      error: "Internal server error",
      details: error.message
    }, { status: 500 })
  }
}
