"use client"

import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { UserNav } from "./user-nav"
import { LoginDropdown } from "./login-dropdown"
import Link from "next/link"

export function AuthStatus() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return
    
    console.log("Session status:", status)
    console.log("Session data:", session)
  }, [session, status])

  // No need for isClient state as useSession handles hydration
  if (status === "loading") {
    return <div>Loading...</div> // Or your loading component
  }

  return (
    <div className="hidden lg:flex items-center space-x-4">
      <Button variant="ghost" className="text-primary hover:text-primary/90">
        <Phone className="mr-2 h-4 w-4" />
        042-389-00939
      </Button>
      
      {status === "authenticated" && session?.user ? (
        <UserNav user={session.user} />
      ) : (
        <>
          <LoginDropdown />
          <Button 
            className="bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white" 
            asChild
          >
            <Link href="/join-as-doctor">Join as Doctor</Link>
          </Button>
        </>
      )}
    </div>
  )
}