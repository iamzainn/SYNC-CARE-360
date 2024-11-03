import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Button } from "@/components/ui/button"
  import Link from "next/link"
  
  export function LoginDropdown() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Login/SignUp</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild>
            <Link href="/patient/auth" className="cursor-pointer">
              Patient
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/doctor/auth" className="cursor-pointer">
              Doctor
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  