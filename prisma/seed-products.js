const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedProducts() {
  console.log('Starting to seed products with images...');

  // Get the first store (user) to associate products with
  const store = await prisma.user.findFirst();
  
  if (!store) {
    console.log('No store found. Please create a user/store first.');
    return;
  }

  console.log(`Found store: ${store.email}, creating products...`);

  const productsData = [
    {
      name: 'Smartphone',
      price: 699,
      emoji: '📱',
      description: 'Latest smartphone with amazing features',
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'Laptop',
      price: 1299,
      emoji: '💻',
      description: 'High-performance laptop for work and gaming',
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      ]
    },
    {
      name: 'Wireless Earbuds',
      price: 199,
      emoji: '🎧',
      description: 'Premium wireless earbuds with noise cancellation',
      images: [
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
      ]
    }
  ];

  for (const productData of productsData) {
    console.log(`Creating product: ${productData.name}`);
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        price: productData.price,
        emoji: productData.emoji,
        description: productData.description,
        userId: store.id,
      },
    });

    // Create product images
    for (let i = 0; i < productData.images.length; i++) {
      await prisma.productImage.create({
        data: {
          url: productData.images[i],
          order: i,
          productId: product.id,
        },
      });
    }

    console.log(`✅ Created product: ${productData.name} with ${productData.images.length} images`);
  }

  console.log('✅ All products seeded successfully!');
}

seedProducts()
  .catch((e) => {
    console.error('Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
