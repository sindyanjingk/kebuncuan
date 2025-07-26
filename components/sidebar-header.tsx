"use client"

import { useRouter } from "next/navigation"
import { IconChevronDown, IconBuildingStore, IconExternalLink } from "@tabler/icons-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

type Store = {
    id: string
    name: string
}

const stores: Store[] = [
    { id: "kebuncuan", name: "Toko Sayur Rina" },
    { id: "warungbudi", name: "Warung Pak Budi" },
]

export function SidebarHeader() {
    const router = useRouter()
    const currentStore = stores[0] // TODO: Replace with global state or param

    const handleStoreChange = (store: Store) => {
        router.push(`/${store.id}/dashboard`)
    }

    const handleNewStore = () => {
        router.push("/new-store")
    }

    return (
        <div className="flex items-center justify-between border-b px-4 py-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex w-full items-center justify-between px-2 py-1.5 text-sm font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <IconBuildingStore className="size-4" />
                            {currentStore.name}
                        </div>
                        <IconChevronDown className="size-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64">
                    {stores.map((store) => (
                        <DropdownMenuItem
                            key={store.id}
                            className="flex items-center justify-between"
                            onClick={() => handleStoreChange(store)}
                        >
                            <span>{store.name}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(`https://${store.id}.kebuncuan.com`, "_blank")
                                }}
                            >
                                <IconExternalLink className="size-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-primary font-medium"
                        onClick={handleNewStore}
                    >
                        + Tambah Toko Baru
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
