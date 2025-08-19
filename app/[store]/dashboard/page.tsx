
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "./data.json"
import { prisma } from "@/lib/prisma"

type Props = {
  params: {
    store: string
  }
}

export default  async function Page({ params }: Props) {
  const store = params.store
  console.log({ store });
  const selectedStore = await prisma.store.findFirst({
    where : {
      slug : store
    }
  })
  const customers = await prisma.customer.findMany({
    where : {
      storeId : selectedStore?.id
    }
  })
  const orders = await prisma.order.findMany({
    where : {
      product : {
        storeId : selectedStore?.id
      }
    },
    include : {
      product : true
    }
  })
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards customers={customers} orders={orders}/>
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  )
}
