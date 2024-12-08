"use client"

import { Button } from "@/components/ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"


export function DesktopFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const isActive = (key: string, value: string) => searchParams.get(key) === value

  return (
    <div className="w-full max-w-[1000px] mx-auto px-4">
      <div className="hidden md:flex items-center gap-3 overflow-x-auto pb-4">
        <Button
          variant={isActive('gender', 'FEMALE') ? "default" : "outline"}
          onClick={() => updateFilter('gender', 'FEMALE')}
        >
          Female Doctors
        </Button>
        <Button
          variant={isActive('fee', 'asc') ? "default" : "outline"}
          onClick={() => updateFilter('fee', 'asc')}
        >
          Lowest Fee
        </Button>
        <Button
          variant={isActive('experience', '5') ? "default" : "outline"}
          onClick={() => updateFilter('experience', '5')}
        >
          Most Experienced
        </Button>
        <Button
          variant={isActive('availability', 'today') ? "default" : "outline"}
          onClick={() => updateFilter('availability', 'today')}
        >
          Available Today
        </Button>
      </div>
    </div>
  )
}