
import NextAuth, { type SessionStrategy } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"


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
  pages: {
    signIn: "/auth/login"
  }
}