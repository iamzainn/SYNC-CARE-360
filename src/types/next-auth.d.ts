import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "DOCTOR" | "PATIENT"
      email: string
      name: string
      image?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: "DOCTOR" | "PATIENT"
    email: string
    name: string
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: "DOCTOR" | "PATIENT"
  }
}