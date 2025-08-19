"use client";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "next-auth";

export function StoreAuthStatus({ session }: { session: Session | null }) {

    if (session?.user) {
        const name = session.user.name || session.user.email || "User";
        const avatarUrl = session.user.image || undefined;
        const fallback = name[0]?.toUpperCase() || "U";
        return (
            <div className="flex items-center gap-4 bg-gradient-to-r from-green-100 to-green-50 border border-green-200 rounded-xl px-4 py-2 shadow-sm animate-fade-in">
                <Avatar className="w-10 h-10 ring-2 ring-green-400">
                    {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={name} />
                    ) : (
                        <AvatarFallback className="bg-green-200 text-green-800 font-bold">{fallback}</AvatarFallback>
                    )}
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-bold text-green-800 text-base leading-tight">{name}</span>
                </div>
                <Button
                    size="sm"
                    variant="destructive"
                    className="ml-4 transition-transform hover:scale-105 shadow-md"
                    onClick={() => signOut({ callbackUrl: window.location.href })}
                >
                    Logout
                </Button>
            </div>
        );
    }

    return null;
}
