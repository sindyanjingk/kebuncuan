import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAndCreateStoreSettings() {
  console.log('🔍 Checking store settings...')

  // Check for store 'toko-baju'
  const store = await prisma.store.findUnique({
    where: { slug: 'toko-baju' },
    include: {
      settings: true,
      template: true
    }
  })

  if (!store) {
    console.log('❌ Store "toko-baju" not found! Creating it...')
    
    // Create a test store
    const newStore = await prisma.store.create({
      data: {
        name: 'Toko Baju Fashion',
        slug: 'toko-baju',
        ownerId: 'user-1', // You may need to adjust this to an actual user ID
        templateId: 'fashion-elegance', // Use fashion template
        logoUrl: '/images/logo-toko-baju.png',
        settings: {
          create: {
            primaryColor: '#6366F1',
            secondaryColor: '#8B5CF6',
            accentColor: '#A855F7',
            fontFamily: 'Inter',
            socialLinks: {
              facebook: 'https://facebook.com/tokobaju',
              instagram: 'https://instagram.com/tokobaju',
              twitter: 'https://twitter.com/tokobaju'
            },
            seoConfig: {
              title: 'Toko Baju Fashion - Fashion Terkini',
              description: 'Toko fashion online terpercaya dengan koleksi pakaian trendy dan berkualitas'
            },
            contactInfo: {
              phone: '+62812345678',
              email: 'info@tokobaju.com',
              address: 'Jakarta, Indonesia'
            }
          }
        }
      },
      include: {
        settings: true,
        template: true
      }
    })
    
    console.log('✅ Store created:', newStore.name)
    return newStore
  }

  console.log('📋 Store found:', store.name)
  console.log('   - Has settings:', !!store.settings)
  console.log('   - Has template:', !!store.template)

  // Create settings if missing
  if (!store.settings) {
    console.log('🔧 Creating default settings...')
    
    const settings = await prisma.storeSetting.create({
      data: {
        storeId: store.id,
        primaryColor: '#6366F1',
        secondaryColor: '#8B5CF6',
        accentColor: '#A855F7',
        fontFamily: 'Inter',
        socialLinks: {
          facebook: 'https://facebook.com/tokobaju',
          instagram: 'https://instagram.com/tokobaju',
          twitter: 'https://twitter.com/tokobaju'
        },
        seoConfig: {
          title: 'Toko Baju Fashion - Fashion Terkini',
          description: 'Toko fashion online terpercaya dengan koleksi pakaian trendy dan berkualitas'
        },
        contactInfo: {
          phone: '+62812345678',
          email: 'info@tokobaju.com',
          address: 'Jakarta, Indonesia'
        }
      }
    })
    
    console.log('✅ Settings created for store')
  }

  // Assign template if missing
  if (!store.template) {
    console.log('🎨 Assigning template...')
    
    await prisma.store.update({
      where: { id: store.id },
      data: { templateId: 'fashion-elegance' }
    })
    
    console.log('✅ Template assigned')
  }

  // Check final state
  const finalStore = await prisma.store.findUnique({
    where: { slug: 'toko-baju' },
    include: {
      settings: true,
      template: true
    }
  })

  console.log('\n📊 Final Status:')
  console.log('   - Store:', finalStore?.name)
  console.log('   - Settings:', !!finalStore?.settings)
  console.log('   - Template:', finalStore?.template?.name || 'None')
  
  return finalStore
}

async function main() {
  try {
    await checkAndCreateStoreSettings()
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default checkAndCreateStoreSettings
