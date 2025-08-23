"use client";

import { BuyButton } from "@/components/buy-button";

interface PurchaseWrapperProps {
  product: {
    id: string;
    name: string;
    price: number;
  };
  disabled?: boolean;
  session: any;
}

export function PurchaseWrapper({ product, disabled, session }: PurchaseWrapperProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div onClick={handleClick}>
      <BuyButton 
        product={product}
        disabled={disabled} 
        session={session} 
      />
    </div>
  );
}
