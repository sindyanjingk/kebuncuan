import { prisma } from "@/lib/prisma"
import { CustomizationForm } from "./customization-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  params: {
    store: string
  }
}

export default async function CustomizePage({ params }: Props) {
  const store = await prisma.store.findFirst({
    where: {
      slug: params.store
    },
    include: {
      template: {
        include: {
          heroConfig: true,
          featuresConfig: true,
          socialProofConfig: {
            include: {
              testimonials: true
            }
          }
        }
      }
    }
  })

  if (!store) {
    return <div>Store tidak ditemukan</div>
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Customize Landing Page</h1>
              <p className="text-gray-600 mt-2">
                Sesuaikan tampilan halaman utama toko Anda sesuai brand dan preferensi
              </p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>🎨 Pengaturan Tampilan</CardTitle>
                  <CardDescription>
                    Customize warna, teks, dan komponen yang ingin ditampilkan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CustomizationForm store={store} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
