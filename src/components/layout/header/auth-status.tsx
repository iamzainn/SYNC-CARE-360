"use client"


import { useSession } from "next-auth/react"

import { UserNav } from "./user-nav"
import { LoginDropdown } from "./login-dropdown"


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