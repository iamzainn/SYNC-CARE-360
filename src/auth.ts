// src/auth.ts
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { compare } from "bcryptjs"

export const {
  auth,
  signIn,
  signOut,
  handlers,

} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  
  pages: {
    signIn: '/',
    error: '/',
    signOut: '/',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const doctor = await db.doctor.findUnique({
          where: { email: credentials.email.toString().toLowerCase() }
        })

        if (!doctor || !doctor.password) {
          throw new Error("Email not found")
        }

        const isPasswordValid = await compare(credentials.password as string, doctor.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: doctor.id,
          email: doctor.email,
          name: doctor.name,
          role: "DOCTOR" as const,
          image: "/default-avatar.png"
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = user.role
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          role: token.role as "DOCTOR" | "PATIENT",
          email: token.email as string,
          name: token.name as string,
          image: token.picture as string,
          emailVerified: null
        }
      }
      return session
    }
  }
})