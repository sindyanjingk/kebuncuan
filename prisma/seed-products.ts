import { prisma } from '../lib/prisma.js'

async function seedProductsWithImages() {
  console.log('🌱 Seeding products with images...')

  // Find first store
  const store = await prisma.store.findFirst()
  if (!store) {
    console.log('❌ No store found')
    return
  }

  // Find or create category
  let category = await prisma.category.findFirst({
    where: { name: 'Electronics' }
  })

  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Electronics'
      }
    })
  }

  // Sample product images (using unsplash for demo)
  const sampleProducts = [
    {
      name: 'Smartphone Premium X1',
      description: 'Smartphone flagship dengan kamera 108MP, layar AMOLED 6.7", dan prosesor terbaru. Cocok untuk fotografi dan gaming.',
      price: 8999000,
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=300&fit=crop'
      ]
    },
    {
      name: 'Laptop Gaming ROG',
      description: 'Laptop gaming dengan RTX 4060, RAM 16GB, dan SSD 1TB. Performa maksimal untuk gaming dan content creation.',
      price: 15999000,
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop'
      ]
    },
    {
      name: 'Wireless Earbuds Pro',
      description: 'Earbuds wireless dengan Active Noise Cancellation, battery life 30 jam, dan kualitas audio Hi-Fi.',
      price: 1299000,
      images: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop'
      ]
    }
  ]

  for (const productData of sampleProducts) {
    // Create product
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        active: true,
        categoryId: category.id,
        storeId: store.id
      }
    })

    // Add images
    for (let i = 0; i < productData.images.length; i++) {
      await prisma.productImage.create({
        data: {
          url: productData.images[i],
          productId: product.id,
          order: i
        }
      })
    }

    console.log(`✅ Created product: ${product.name} with ${productData.images.length} images`)
  }

  console.log('🎉 Products with images seeded successfully!')
}

seedProductsWithImages()
  .catch((e) => {
    console.error('❌ Error seeding products:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
