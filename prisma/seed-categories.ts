import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCategories() {
  console.log('🌱 Seeding categories...')

  const defaultCategories = [
    'Elektronik',
    'Fashion',
    'Makanan & Minuman',
    'Kecantikan',
    'Olahraga',
    'Buku & Pendidikan',
    'Mainan & Anak',
    'Rumah & Tangan',
    'Otomotif',
    'Digital & Software',
    'PPOB',
    'SMM Panel',
    'Voucher Game',
    'Premium Account',
    'Lainnya'
  ]

  for (const categoryName of defaultCategories) {
    try {
      await prisma.category.upsert({
        where: { 
          name_parentId: {
            name: categoryName,
            parentId: null as any
          }
        },
        update: {},
        create: { name: categoryName }
      })
    } catch (error) {
      // If unique constraint fails, try to find existing category
      const existing = await prisma.category.findFirst({
        where: { name: categoryName, parentId: null }
      })
      if (!existing) {
        await prisma.category.create({
          data: { name: categoryName }
        })
      }
    }
  }

  console.log('✅ Categories seeded successfully!')
  console.log(`Created ${defaultCategories.length} categories`)
}

async function main() {
  try {
    await seedCategories()
  } catch (error) {
    console.error('❌ Error seeding categories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default seedCategories
