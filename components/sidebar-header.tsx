"use client"

import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { IconChevronDown, IconBuildingStore, IconExternalLink } from "@tabler/icons-react"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Session } from "next-auth"

type Store = {
    id: string
    name: string
    slug: string
}


export function SidebarHeader({session} : {session : Session | null}) {
    const router = useRouter()
    const params = useParams()
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(true)

    // Ambil data toko user
    useEffect(() => {
        if (session?.user?.email) {
            fetch(`/api/user/stores?email=${encodeURIComponent(session.user.email)}`)
                .then(res => res.json())
                .then(data => {
                    setStores(data.stores || [])
                    setLoading(false)
                })
        }
    }, [session?.user?.email])

    // Tentukan toko aktif dari params
    const currentStore = stores.find(s => s.slug === params.store) || stores[0]

    const handleStoreChange = (store: Store) => {
        router.push(`/${store.slug}/dashboard`)
    }

    const handleNewStore = () => {
        router.push("/onboarding")
    }

    return (
        <div className="flex items-center justify-between border-b px-4 py-3">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex w-full items-center justify-between px-2 py-1.5 text-sm font-medium"
                        disabled={loading || stores.length === 0}
                    >
                        <div className="flex items-center gap-2">
                            <IconBuildingStore className="size-4" />
                            {currentStore ? currentStore.name : "Pilih Toko"}
                            <span className="ml-2 text-xs text-muted-foreground">({stores.length} toko)</span>
                        </div>
                        <IconChevronDown className="size-4 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-72 p-2">
                    <div className="mb-2 text-xs text-muted-foreground px-2">Pilih Toko</div>
                    {stores.map((store) => (
                        <DropdownMenuItem
                            key={store.id}
                            className={`flex items-center justify-between rounded-md transition-colors cursor-pointer px-3 py-2 ${currentStore && store.slug === currentStore.slug ? 'bg-primary/10 font-bold' : 'hover:bg-primary/10'}`}
                            onClick={() => handleStoreChange(store)}
                        >
                            <div className="flex items-center gap-2">
                                <IconBuildingStore className="size-4 text-primary" />
                                <span className="font-medium">{store.name}</span>
                                {currentStore && store.slug === currentStore.slug && <span className="ml-1 text-xs text-primary">(aktif)</span>}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-transparent"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(`http://${store.slug}.${process.env.NEXT_PUBLIC_HOST_DOMAIN}`, "_blank")
                                }}
                            >
                                <IconExternalLink className="size-4 text-muted-foreground" />
                            </Button>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem
                        className="text-primary font-semibold rounded-md bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer px-3 py-2"
                        onClick={handleNewStore}
                    >
                        + Tambah Toko Baru
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
