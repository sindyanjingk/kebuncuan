import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { IconCoin, IconShoppingBag, IconBuildingStore, IconUserCircle } from "@tabler/icons-react"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ProfileForm } from "@/components/profile/profile-form"
import { AvatarUpload } from "@/components/profile/avatar-upload"

interface Props {
  params: { store: string }
}

export default async function ProfilePage({ params }: Props) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect("/login")
  }

  // Get user data with stores and balance
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { stores: true }
  })

  if (!user) {
    redirect("/login")
  }

  // Verify user owns this store
  const store = user.stores.find(s => s.slug === params.store)
  if (!store) {
    redirect("/")
  }

  // Get total orders for this store only
  const orders = await prisma.order.findMany({
    where: {
      product: {
        storeId: store.id
      }
    },
    include: {
      product: true
    }
  })

  return (
    <div className="container max-w-6xl py-10 px-4">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <AvatarUpload
            username={user.username}
            imageUrl={user.imageUrl}
            className="h-20 w-20"
          />
          <div>
            <h1 className="text-2xl font-semibold">{user.username}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Separator />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo</CardTitle>
              <IconCoin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rp {user.balance.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground">
                +0 bulan ini
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toko</CardTitle>
              <IconBuildingStore className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.stores.length}</div>
              <p className="text-xs text-muted-foreground">
                Total toko yang dimiliki
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <IconShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">
                Total orders di toko ini
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Member Sejak</CardTitle>
              <IconUserCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.createdAt.getFullYear()}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.createdAt.toLocaleDateString("id-ID", { month: "long" })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form in Client Component */}
        <ProfileForm user={user} />

        {/* Store List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Toko</CardTitle>
          </CardHeader>
          <CardContent>
            {user.stores.length === 0 ? (
              <p className="text-muted-foreground">Belum ada toko</p>
            ) : (
              <div className="grid gap-4">
                {user.stores.map((store) => (
                  <Link href={`/${store.slug}/dashboard`} key={store.id}>
                    <Card>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium">{store.name}</p>
                          <p className="text-sm text-muted-foreground">@{store.slug}</p>
                        </div>
                        <Button variant="ghost">
                          Lihat Dashboard
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
