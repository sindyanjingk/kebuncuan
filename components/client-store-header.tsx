"use client";

import { StoreHeader } from "@/components/store-header";
import { useSession } from "next-auth/react";

interface ClientStoreHeaderProps {
  storeData: any;
  storeSlug: string;
}

export function ClientStoreHeader({ storeData, storeSlug }: ClientStoreHeaderProps) {
  const { data: session, status } = useSession();
  
  // Show header even during loading to prevent layout shift
  return (
    <StoreHeader 
      storeData={storeData} 
      storeSlug={storeSlug} 
      session={session} 
    />
  );
}
