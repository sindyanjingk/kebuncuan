import { PrismaClient, ProductType } from '@prisma/client';

const prisma = new PrismaClient();

async function seedProducts() {
  try {
    // Find a store to add products to
    const store = await prisma.store.findFirst();
    if (!store) {
      console.log('No stores found. Please create a store first.');
      return;
    }

    // Find or create a category
    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'Umum'
        }
      });
    }

    // Sample products with new pricing and type structure
    const sampleProducts = [
      {
        name: 'Baju Kaos Premium',
        description: 'Kaos cotton combed 30s berkualitas tinggi',
        price: 150000,
        modalPrice: 75000,
        productType: ProductType.PHYSICAL,
        categoryId: category.id,
        storeId: store.id,
        active: true
      },
      {
        name: 'E-Book Digital Marketing',
        description: 'Panduan lengkap digital marketing untuk pemula',
        price: 50000,
        modalPrice: 10000,
        productType: ProductType.DIGITAL,
        categoryId: category.id,
        storeId: store.id,
        active: true
      },
      {
        name: 'Pulsa Telkomsel 50k',
        description: 'Pulsa elektronik Telkomsel nominal 50 ribu',
        price: 51000,
        modalPrice: 49500,
        productType: ProductType.PPOB,
        categoryId: category.id,
        storeId: store.id,
        active: true
      },
      {
        name: 'Followers Instagram 1000',
        description: 'Tambah followers Instagram real dan aktif',
        price: 25000,
        modalPrice: 15000,
        productType: ProductType.SMM,
        categoryId: category.id,
        storeId: store.id,
        active: true
      }
    ];

    for (const productData of sampleProducts) {
      await prisma.product.create({
        data: productData
      });
      console.log(`Created product: ${productData.name}`);
    }

    console.log('✅ Sample products created successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProducts();
