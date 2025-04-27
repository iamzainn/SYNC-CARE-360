"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { LogOut, User, Layout } from "lucide-react"
// import { LogoutAction } from "@/lib/actions/auth"
import { useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"


interface UserNavProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()
  const { data: session } = useSession()

  const handleSignOut = async () => {
    try {
      await signOut({
        redirect: false
      })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const renderDashboardLink = () => {
    if (!session?.user?.role) return null

    if (session.user.role === 'DOCTOR') {
      return (
        <DropdownMenuItem asChild>
          <Link href="/doctor/dashboard">
            <Layout className="mr-2 h-4 w-4" />
            <span>Doctor Dashboard</span>
          </Link>
        </DropdownMenuItem>
      )
    }
    
    if (session.user.role === 'PATIENT') {
      return (
        <DropdownMenuItem asChild>
          <Link href="/patient/dashboard">
            <Layout className="mr-2 h-4 w-4" />
            <span>Patient Dashboard</span>
          </Link>
        </DropdownMenuItem>
      )
    }
    
    if (session.user.role === 'NURSE') {
      return (
        <DropdownMenuItem asChild>
          <Link href="/nurse/dashboard">
            <Layout className="mr-2 h-4 w-4" />
            <span>Nurse Dashboard</span>
          </Link>
        </DropdownMenuItem>
      )
    }
    
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={user.image || "/default-avatar.png"} alt={user.name || "User avatar"} />
          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.role && (
              <p className="text-xs leading-none text-muted-foreground mt-1">
                Role: {user.role}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {renderDashboardLink()}
          <DropdownMenuItem asChild>
            <Link href={`/${session?.user?.role?.toLowerCase() || 'user'}/profile`}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
        className="text-red-600 cursor-pointer"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Sign Out</span>
      </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}