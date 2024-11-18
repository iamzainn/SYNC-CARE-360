import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { compare } from "bcryptjs"
import { JWT } from "next-auth/jwt"


export const {
  auth,
  signIn,
  signOut,
  handlers
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/',
  },
  trustHost: true,
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" } // Add role to differentiate
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null
        }
    
        const email = credentials.email.toString().toLowerCase()
        const role = credentials.role
    
        if (role === 'DOCTOR') {
          const doctor = await db.doctor.findUnique({
            where: { email }
          })
    
          if (!doctor || !doctor.password) return null
    
          const isPasswordValid = await compare(
            credentials.password as string,
            doctor.password
          )
    
          if (!isPasswordValid) return null
    
          return {
            id: doctor.id,
            email: doctor.email,
            name: doctor.name,
            role: "DOCTOR",
            image: "/default-avatar.png",
            isVerifiedDoctor: doctor.isVerifiedDoctor
            
            
          }
        } else {
          const patient = await db.patient.findUnique({
            where: { email }
          })
    
          if (!patient || !patient.password) return null
    
          const isPasswordValid = await compare(
            credentials.password as string,
            patient.password
          )
    
          if (!isPasswordValid) return null
    
          return {
            id: patient.id,
            email: patient.email,
            name: patient.name,
            role: "PATIENT",
            image: "/default-avatar.png",
            isVerifiedDoctor:false
          }
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }): Promise<JWT> {
      if (trigger === "update" && session?.name) {
        token.name = session.name
      }
      
      if (user) {
        token.id = user.id as string
        token.role = user.role
        token.email = user.email as string
        token.name = user.name as string
        token.picture = user.image as string
        token.isVerifiedDoctor = user.isVerifiedDoctor
        
        

      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          role: token.role,
          email: token.email,
          name: token.name,
          image: token.picture,
          emailVerified: "no",
          isVerifiedDoctor: token.isVerifiedDoctor   }
      }
    }
  }
})