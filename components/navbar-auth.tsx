"use client";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart, LogOut } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface NavbarAuthProps {
  session: Session | null;
  storeSlug: string;
}

export function NavbarAuth({ session, storeSlug }: NavbarAuthProps) {
    const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  
  const handleLogout = () => {
    import("next-auth/react").then(({ signOut }) => {
      signOut({ callbackUrl: "/" });
    });
  };

  return (
    <div className="flex items-center gap-3">
      {session ? (
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <Link href={`/cart`} className="relative">
            <Button variant="ghost" size="sm" className="text-white hover:text-purple-200">
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </Link>
          
          {/* User Name */}
          <span className="text-white/90 text-sm font-medium">
            {session.user?.name || session.user?.email?.split('@')[0] || 'User'}
          </span>
          
          {/* Logout Icon Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs bg-white/10 border-white/20 text-white hover:bg-white/20 p-2"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link href={`/login`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20 px-4 py-2 rounded-full font-medium transition-all duration-200"
            >
              Login
            </Button>
          </Link>
          <Link href={`/register`}>
            <Button 
              size="sm" 
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-lg"
            >
              Register
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
