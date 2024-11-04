import Image from "next/image"
import Link from "next/link"
import { MobileNav } from "./mobile-nav"
import { DesktopNav } from "./desktop-nav"
import { AuthStatus } from "./auth-status"
import { headers } from 'next/headers'
import { LoginDropdown } from "./login-dropdown"

export async function Header() {
  // Force dynamic rendering
  headers()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-8 w-8 hidden md:block">
              <Image
                src="/logo.png"
                alt="Care Sync 360 Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl">Care Sync 360</span>
          </Link>
        </div>

        <div className="hidden lg:flex flex-1 justify-center">
          <DesktopNav />
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          <AuthStatus />
          <div className="flex lg:hidden space-x-2">
            <LoginDropdown />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}