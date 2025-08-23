"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

interface Store {
  name: string;
  logo?: string;
}

interface StoreHeaderProps {
  store: Store;
}

export function StoreHeader({ store }: StoreHeaderProps) {
  const params = useParams();
  const storeSlug = params.store as string;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo & Store Name */}
        <Link href={`/domain/${storeSlug}`} className="flex items-center gap-2">
          {store.logo ? (
            <Image
              src={store.logo}
              alt={store.name}
              width={32}
              height={32}
              className="rounded-sm"
            />
          ) : (
            <div className="w-8 h-8 bg-primary/20 rounded-sm flex items-center justify-center text-primary font-semibold">
              {store.name.charAt(0)}
            </div>
          )}
          <span className="font-semibold">{store.name}</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 mx-6">
          <Link 
            href={`/domain/${storeSlug}/products`}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Products
          </Link>
          <Link 
            href={`/domain/${storeSlug}/categories`}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Categories
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href={`/domain/${storeSlug}/cart`}>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          <Link href={`/domain/${storeSlug}/account`}>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
