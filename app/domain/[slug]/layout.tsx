"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { Toaster } from "@/components/ui/sonner";
import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const slug = params.slug as string;
  const [store, setStore] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch store data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`/api/store?slug=${slug}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data || !data.store) {
          throw new Error('Store data not found');
        }
        setStore(data.store);
      })
      .catch((error) => {
        console.error('Error fetching store:', error);
        setError('Failed to load store data');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Store Not Found</h1>
          <p className="text-muted-foreground">{error || 'Unable to load store data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <StoreHeader store={store} />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter store={store} />
      <Toaster />
    </div>
  );
}
