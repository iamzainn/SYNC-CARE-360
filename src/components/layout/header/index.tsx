import Link from "next/link"
import { DesktopNav } from "./desktop-nav"
import { AuthStatus } from "./auth-status"
import { MobileNav } from "./mobile-nav"
import { LoginDropdown } from "./login-dropdown"
import { headers } from "next/headers"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"

export async function Header() {
  headers()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 mx-auto flex h-16 items-center justify-between">
        {/* Left side - Logo */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <div className="relative h-8 w-8">
            {/* <Image
              src="/logo.png"
              alt="Care Sync 360 Logo"
              width={32}
              height={32}
              className="object-contain"
            /> */}
          </div>
          <span className="font-semibold text-lg whitespace-nowrap">Care Sync 360</span>
        </Link>

        {/* Center - Navigation */}
        <nav className="hidden xl:flex items-center justify-start pl-8 flex-grow">
          <DesktopNav />
        </nav>

        {/* Right side - Action items */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Auth - Always visible */}
          <AuthStatus />

          {/* Join Doctor button - Hidden on smallest screens */}
          <div className="hidden sm:block xl:flex">
            <Button 
              variant="outline"
              className="whitespace-nowrap text-sm font-medium bg-transparent hover:bg-transparent border-none" 
              asChild
            >
              <Link href="/join-as-doctor">Join As Doctor</Link>
            </Button>
          </div>

          {/* Phone number - Only visible on desktop */}
          <div className="hidden xl:flex items-center">
            <Button 
              variant="ghost" 
              className="whitespace-nowrap text-sm font-medium hover:bg-transparent flex items-center space-x-2 px-2"
            >
              <Phone className="h-4 w-4" />
              <span>042-389-00939</span>
            </Button>
          </div>
          
          {/* Mobile menu toggle */}
          <div className="xl:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}