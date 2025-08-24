
import NextAuth, { type SessionStrategy } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"


export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email }
        })
        if (user && await compare(credentials!.password, user.passwordHash)) {
          return user
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt" as SessionStrategy
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.imageUrl = user.imageUrl
      }
      
      // Handle session update
      if (trigger === "update" && session?.image) {
        token.imageUrl = session.image
      }
      
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.username as string
        session.user.image = token.imageUrl as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login"
  }
}