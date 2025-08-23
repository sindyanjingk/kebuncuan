"use client"

import Head from "next/head"
import { useEffect } from "react"

interface TenantHeadProps {
  store: {
    name: string
    faviconUrl?: string | null
    logoUrl?: string | null
  }
}

export function TenantHead({ store }: TenantHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = store.name || "Toko Online"
    
    // Update favicon if available
    if (store.faviconUrl) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.getElementsByTagName('head')[0].appendChild(link)
      }
      link.href = store.faviconUrl
    }
  }, [store.name, store.faviconUrl])

  return null
}
