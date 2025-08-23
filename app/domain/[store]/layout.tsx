"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { Toaster } from "@/components/ui/sonner";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const store = params.store as string;
  const [storeData, setStoreData] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch store data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`/api/store?slug=${store}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch store');
        }
        return res.json();
      })
      .then((data) => {
        setStoreData(data.store);
      })
      .catch((error) => {
        console.error('Error fetching store:', error);
        setError('Failed to load store data');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [store]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !storeData) {
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
      <main className="flex-1">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
