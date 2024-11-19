import { Inter } from "next/font/google"
import { Header } from "@/components/layout/header"
import "./globals.css"

import { headers } from 'next/headers'
import { NextAuthProvider } from "@/providers/next-auth-provider"
import { auth } from "@/auth"
const inter = Inter({ subsets: ["latin"] })
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster"
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await auth()
  console.log("session layout", session?.user)
  // headers() 
  
  return (
    <html lang="en" suppressHydrationWarning >
<NextSSRPlugin
          /**
           * The `extractRouterConfig` will extract **only** the route configs
           * from the router to prevent additional information from being
           * leaked to the client. The data passed to the client is the same
           * as if you were to fetch `/api/uploadthing` directly.
           */
          routerConfig={extractRouterConfig(ourFileRouter)}
        />

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