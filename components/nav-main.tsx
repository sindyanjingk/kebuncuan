"use client"

import {
  IconCirclePlusFilled,
  IconMail,
  IconBox,
  IconLayoutDashboard,
  IconUsers,
  IconFileInvoice,
  IconReportAnalytics,
  IconPalette,
} from "@tabler/icons-react"

import { useParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import clsx from "clsx"


export function NavMain() {
  const params = useParams();
  const pathname = usePathname();
  // Gunakan params.store sesuai dynamic route folder
  const storeSlug = params.store as string;

  const items = [
    {
      title: "Dashboard",
      url: `/${storeSlug}/dashboard`,
      icon: IconLayoutDashboard,
    },
    {
      title: "Produk",
      url: `/${storeSlug}/dashboard/products`,
      icon: IconBox,
    },
    {
      title: "Pesanan",
      url: `/${storeSlug}/dashboard/orders`,
      icon: IconFileInvoice,
    },
    {
      title: "Pelanggan",
      url: `/${storeSlug}/dashboard/customers`,
      icon: IconUsers,
    },
    {
      title: "Laporan",
      url: `/${storeSlug}/dashboard/reports`,
      icon: IconReportAnalytics,
    },
    {
      title: "Customize",
      url: `/${storeSlug}/dashboard/customize`,
      icon: IconPalette,
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Tombol Quick Create */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {/* <SidebarMenuButton
              tooltip="Tambah"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Tambah</span>
            </SidebarMenuButton> */}
            {/* <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button> */}
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Navigasi Utama */}
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname.startsWith(item.url)

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={clsx(
                    "duration-150 ease-in-out",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
