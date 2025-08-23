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
