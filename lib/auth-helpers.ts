import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface AuthUser {
  id: string;
  email: string;
}

// Helper to get authenticated user
export async function getAuthUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true }
  })

  return user
}
