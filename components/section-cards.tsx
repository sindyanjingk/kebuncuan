import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 xl:grid-cols-4 lg:px-6">
      {/* Total Penjualan */}
      <Card>
        <CardHeader>
          <CardDescription>Total Penjualan</CardDescription>
          <CardTitle className="text-2xl font-semibold">Rp 12.500.000</CardTitle>
          <CardContent>
            <Badge variant="outline" className="text-green-600">
              <IconTrendingUp className="mr-1 size-4" /> +18.2%
            </Badge>
          </CardContent>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
          <span>Meningkat dibanding bulan lalu</span>
        </CardFooter>
      </Card>

      {/* Jumlah UMKM */}
      <Card>
        <CardHeader>
          <CardDescription>UMKM Terdaftar</CardDescription>
          <CardTitle className="text-2xl font-semibold">234</CardTitle>
          <CardContent>
            <Badge variant="outline" className="text-green-600">
              <IconTrendingUp className="mr-1 size-4" /> +6 UMKM
            </Badge>
          </CardContent>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
          <span>Dalam 30 hari terakhir</span>
        </CardFooter>
      </Card>

      {/* Produk Terjual */}
      <Card>
        <CardHeader>
          <CardDescription>Produk Terjual</CardDescription>
          <CardTitle className="text-2xl font-semibold">4.328</CardTitle>
          <CardContent>
            <Badge variant="outline" className="text-green-600">
              <IconTrendingUp className="mr-1 size-4" /> +9.5%
            </Badge>
          </CardContent>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
          <span>Dalam 6 bulan terakhir</span>
        </CardFooter>
      </Card>

      {/* Pelanggan Baru */}
      <Card>
        <CardHeader>
          <CardDescription>Pelanggan Baru</CardDescription>
          <CardTitle className="text-2xl font-semibold">1.203</CardTitle>
          <CardContent>
            <Badge variant="outline" className="text-red-600">
              <IconTrendingDown className="mr-1 size-4" /> -4.3%
            </Badge>
          </CardContent>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm text-muted-foreground">
          <span>Perlu strategi promosi ulang</span>
        </CardFooter>
      </Card>
    </div>
  )
}
