import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">K</span>
            </div>
            <h1 className="text-base font-semibold">
              Dashboard <span className="text-blue-600">KebunCuan</span>
            </h1>
          </div>
          <Badge className="bg-blue-100 text-blue-700 hidden sm:inline" variant="outline">
            UMKM
          </Badge>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Jika masih ingin tombol link eksternal */}
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://kebuncuan.id"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              KebunCuan Web
            </a>
          </Button> */}
        </div>
      </div>
    </header>
  )
}
