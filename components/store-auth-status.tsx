"use client";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "next-auth";
import { ShoppingCart, LogOut } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

export function StoreAuthStatus({ session, storeSlug }: { session: Session | null, storeSlug: string }) {
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    if (session?.user) {
        const name = session.user.name || session.user.email || "User";
        const avatarUrl = session.user.image || undefined;
        const fallback = name[0]?.toUpperCase() || "U";
        return (
            <div className="flex items-center gap-4 bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 rounded-xl px-4 py-2 shadow-sm animate-fade-in">
                <Avatar className="w-10 h-10 ring-2 ring-blue-400">
                    <AvatarImage src={avatarUrl} alt={session.user.name || ""} />
                    {session.user.name && 
                        <AvatarFallback className="bg-blue-200 text-blue-800 font-bold">{fallback}</AvatarFallback>
                    }
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-bold text-blue-800 text-base leading-tight">{name}</span>
                </div>
                
                {/* Cart Button */}
                <Link href={`/cart`}>
                    <Button
                        size="sm"
                        variant="outline"
                        className="ml-2 transition-transform hover:scale-105 shadow-md relative"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {totalItems > 99 ? '99+' : totalItems}
                            </span>
                        )}
                    </Button>
                </Link>
                
                {/* Logout Icon Button */}
                <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2 transition-transform hover:scale-105 shadow-md p-2"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    title="Logout"
                >
                    <LogOut className="w-4 h-4" />
                </Button>
            </div>
        );
    }

    return null;
}
