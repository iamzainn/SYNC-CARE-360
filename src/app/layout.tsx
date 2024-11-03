import { Inter } from "next/font/google"
import { Header } from "@/components/layout/header"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
import { Toaster } from "@/components/ui/toaster"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}