import Image from "next/image"
import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileNav } from "./mobile-nav"
import { DesktopNav } from "./desktop-nav"
import { LoginDropdown } from "./login-dropdown"
import { UserNav } from "./user-nav"
import { auth } from "@/auth"


export async function Header() {

  const session = await auth()
  // console.log("session",session);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center ">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            {/* Logo hidden on mobile */}
            <div className="relative h-8 w-8 hidden md:block">
              <Image
                src="/logo.png"
                alt="Care Sync 360 Logo"
                fill
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

          <div className="hidden lg:flex items-center space-x-4">
          <Button variant="ghost" className="text-primary hover:text-primary/90">
              <Phone className="mr-2 h-4 w-4" />
              042-389-00939
            </Button>
          {session?.user ? (
          <UserNav user={session.user} />
        ): <LoginDropdown />} 

            
            {/* <LoginDropdown /> */}
            <Button 
              className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white" 
              asChild
            >
              <Link href="/join-as-doctor">Join as Doctor</Link>
            </Button>
          </div>
          <div className="flex lg:hidden space-x-2">
            <LoginDropdown />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}