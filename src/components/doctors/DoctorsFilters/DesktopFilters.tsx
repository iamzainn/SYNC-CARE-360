"use client"

import { Button } from "@/components/ui/button"

import { Loader2 } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"



export function DesktopFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const updateFilter = (key: string, value: string) => {
    setActiveFilter(key) 
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
          disabled={activeFilter === 'gender'}
        >
          {activeFilter === 'gender' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Female Doctors
        </Button>
        <Button
          variant={isActive('fee', 'asc') ? "default" : "outline"}
          onClick={() => updateFilter('fee', 'asc')}
          disabled={activeFilter === 'fee'}
        >
          {activeFilter === 'fee' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Lowest Fee
        </Button>
        <Button
          variant={isActive('experience', '5') ? "default" : "outline"}
          onClick={() => updateFilter('experience', '5')}
          disabled={activeFilter === 'experience'}
        >
          {activeFilter === 'experience' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Most Experienced
        </Button>
        <Button
          variant={isActive('availability', 'today') ? "default" : "outline"}
          onClick={() => updateFilter('availability', 'today')}
          disabled={activeFilter === 'availability'}
        >
          {activeFilter === 'availability' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Available Today
        </Button>
      </div>
    </div>
  )
}