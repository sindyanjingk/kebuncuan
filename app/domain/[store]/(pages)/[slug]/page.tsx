import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface StorePageProps {
  params: {
    store: string
    slug: string
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { store: storeSlug, slug } = params

  // Get store and page data
  const page = await prisma.storePage.findFirst({
    where: {
      slug,
      isActive: true,
      store: {
        slug: storeSlug
      }
    },
    include: {
      store: {
        include: {
          settings: true
        }
      }
    }
  })

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Content */}
      <main className="container mx-auto py-8">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </main>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: StorePageProps) {
  const { store: storeSlug, slug } = params
  
  const page = await prisma.storePage.findFirst({
    where: {
      slug,
      isActive: true,
      store: {
        slug: storeSlug
      }
    },
    include: {
      store: true
    }
  })

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    }
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || `${page.title} - ${page.store.name}`,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDesc || `${page.title} - ${page.store.name}`,
      siteName: page.store.name,
    },
  }
}
