"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

interface Store {
  name: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

interface StoreFooterProps {
  store: Store;
}

export function StoreFooter({ store }: StoreFooterProps) {
  const params = useParams();
  const storeSlug = params.slug as string;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:justify-between md:py-0">
        {/* Copyright */}
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {currentYear} {store.name}. All rights reserved.
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6">
          <Link 
            href={`/domain/${storeSlug}/about`}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            About
          </Link>
          <Link 
            href={`/domain/${storeSlug}/contact`}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Contact
          </Link>
          <Link 
            href={`/domain/${storeSlug}/terms`}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Terms
          </Link>
          <Link 
            href={`/domain/${storeSlug}/privacy`}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Privacy
          </Link>
        </nav>

        {/* Social Links */}
        {store.socialLinks && (
          <div className="flex items-center gap-4">
            {store.socialLinks.facebook && (
              <a 
                href={store.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                Facebook
              </a>
            )}
            {store.socialLinks.instagram && (
              <a 
                href={store.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                Instagram
              </a>
            )}
            {store.socialLinks.twitter && (
              <a 
                href={store.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                Twitter
              </a>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
