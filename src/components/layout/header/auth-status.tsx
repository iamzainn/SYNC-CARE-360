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

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return status === "authenticated" && session?.user ? (
    <UserNav user={session.user} />
  ) : (
    <LoginDropdown></LoginDropdown>
  )
}