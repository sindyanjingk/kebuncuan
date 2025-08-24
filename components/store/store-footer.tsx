import Link from 'next/link'
import StorePageLinks from './store-page-links'

interface StoreFooterProps {
  storeSlug: string
  storeName: string
  storeSettings?: any
}

export default async function StoreFooter({ 
  storeSlug, 
  storeName, 
  storeSettings 
}: StoreFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Store Info */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">{storeName}</h3>
            <p className="text-gray-400 mb-4">
              {storeSettings?.seoConfig?.description || 
               `Platform terpercaya untuk kebutuhan Anda di ${storeName}`}
            </p>
            
            {/* Social Links */}
            {storeSettings?.socialLinks && (
              <div className="flex space-x-4">
                {storeSettings.socialLinks.facebook && (
                  <a 
                    href={storeSettings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">Facebook</span>
                    📘
                  </a>
                )}
                {storeSettings.socialLinks.instagram && (
                  <a 
                    href={storeSettings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">Instagram</span>
                    📷
                  </a>
                )}
                {storeSettings.socialLinks.twitter && (
                  <a 
                    href={storeSettings.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">Twitter</span>
                    🐦
                  </a>
                )}
                {storeSettings.socialLinks.youtube && (
                  <a 
                    href={storeSettings.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">YouTube</span>
                    📺
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Store Pages */}
          <div className="md:col-span-3">
            <StorePageLinks storeSlug={storeSlug} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} {storeName}. Seluruh hak cipta dilindungi.
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <Link 
                href="/syarat-ketentuan" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Syarat & Ketentuan
              </Link>
              <Link 
                href="/kebijakan-privasi" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link 
                href="/hubungi-kami" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}