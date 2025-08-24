import Link from 'next/link'
import { getStorePages } from '@/lib/store-pages'

interface StorePageLinksProps {
  storeSlug: string
  className?: string
}

export default async function StorePageLinks({ storeSlug, className = "" }: StorePageLinksProps) {
  // Only get active pages for footer display
  const result = await getStorePages(storeSlug, true) // activeOnly = true
  
  if (!result.success || !result.pages || result.pages.length === 0) {
    return null
  }

  const pages = result.pages

  // Group pages by category for better organization
  const pageGroups = {
    info: pages.filter(page => ['ABOUT_US', 'CONTACT_US', 'HELP_CENTER'].includes(page.type)),
    support: pages.filter(page => ['FAQ', 'TRACK_ORDER'].includes(page.type)),
    legal: pages.filter(page => ['TERMS_CONDITIONS', 'PRIVACY_POLICY', 'RETURN_POLICY'].includes(page.type))
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
      {/* Information */}
      {pageGroups.info.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Informasi</h3>
          <ul className="space-y-2">
            {pageGroups.info.map(page => (
              <li key={page.id}>
                <Link 
                  href={`/${page.slug}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Support */}
      {pageGroups.support.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Bantuan</h3>
          <ul className="space-y-2">
            {pageGroups.support.map(page => (
              <li key={page.id}>
                <Link 
                  href={`/${page.slug}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Legal */}
      {pageGroups.legal.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Kebijakan</h3>
          <ul className="space-y-2">
            {pageGroups.legal.map(page => (
              <li key={page.id}>
                <Link 
                  href={`/${page.slug}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Simple version for header menu
export async function StorePageMenu({ storeSlug }: { storeSlug: string }) {
  // Only get active pages for header menu
  const result = await getStorePages(storeSlug, true) // activeOnly = true
  
  if (!result.success || !result.pages || result.pages.length === 0) {
    return null
  }

  // Show only important pages in header
  const importantPages = result.pages.filter(page => 
    ['ABOUT_US', 'CONTACT_US', 'FAQ', 'HELP_CENTER'].includes(page.type)
  )

  // Don't render if no important pages are active
  if (importantPages.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-6">
      {importantPages.map(page => (
        <Link 
          key={page.id}
          href={`/${page.slug}`}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          {page.title}
        </Link>
      ))}
    </div>
  )
}
