import { prisma } from "@/lib/prisma"
import { getDefaultStoreSettings } from "@/lib/store-settings"

/**
 * Ensure all stores have default settings
 * This function checks for stores without settings and creates them
 */
export async function ensureAllStoresHaveSettings() {
  try {
    // Find all stores without settings
    const storesWithoutSettings = await prisma.store.findMany({
      where: {
        settings: null
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    })

    if (storesWithoutSettings.length === 0) {
      console.log('✅ All stores already have settings')
      return { success: true, created: 0 }
    }

    console.log(`🔧 Found ${storesWithoutSettings.length} stores without settings`)
    
    // Create default settings for each store
    let created = 0
    for (const store of storesWithoutSettings) {
      try {
        const defaultSettings = getDefaultStoreSettings({ storeName: store.name })
        
        await prisma.storeSetting.create({
          data: {
            ...defaultSettings,
            storeId: store.id
          }
        })
        
        created++
        console.log(`✅ Created settings for store: ${store.name} (${store.slug})`)
      } catch (error) {
        console.error(`❌ Failed to create settings for store ${store.slug}:`, error)
      }
    }

    console.log(`🎉 Successfully created settings for ${created} stores`)
    return { success: true, created }
    
  } catch (error) {
    console.error('❌ Error ensuring store settings:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Ensure a specific store has settings
 */
export async function ensureStoreHasSettings(storeId: string) {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { settings: true }
    })

    if (!store) {
      throw new Error('Store not found')
    }

    if (store.settings) {
      return { success: true, hasSettings: true }
    }

    // Create default settings
    const defaultSettings = getDefaultStoreSettings({ storeName: store.name })
    
    await prisma.storeSetting.create({
      data: {
        ...defaultSettings,
        storeId: store.id
      }
    })

    console.log(`✅ Created settings for store: ${store.name}`)
    return { success: true, hasSettings: false, created: true }
    
  } catch (error) {
    console.error('❌ Error ensuring store has settings:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
