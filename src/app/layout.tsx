import { Inter } from "next/font/google"
import { Header } from "@/components/layout/header"
import "./globals.css"

import { headers } from 'next/headers'
import { NextAuthProvider } from "@/providers/next-auth-provider"
import { auth } from "@/auth"
const inter = Inter({ subsets: ["latin"] })
import { Toaster } from "@/components/ui/toaster"
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await auth()
  console.log("session layout", session)
  headers() 
  
  return (
    <html lang="en" suppressHydrationWarning >

      <body className={inter.className}>
    
      <NextAuthProvider session={session}>
      <Header />
        <main>{children}</main>
        <Toaster />

      </NextAuthProvider>
        
       
      </body>
    </html>
  )
}