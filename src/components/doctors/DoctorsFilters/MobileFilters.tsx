"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileFilters() {
  const [open, setOpen] = useState(false)
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
    setOpen(false)
  }

  const isActive = (key: string, value: string) => searchParams.get(key) === value

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filter Doctors</SheetTitle>
        </SheetHeader>
        <Accordion type="single" collapsible className="w-full mt-4">
          <AccordionItem value="gender">
            <AccordionTrigger>Gender</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => updateFilter('gender', 'FEMALE')}
                  className={cn(isActive('gender', 'FEMALE') && "bg-primary text-white")}
                >
                  Female Doctors
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateFilter('gender', 'MALE')}
                  className={cn(isActive('gender', 'MALE') && "bg-primary text-white")}
                >
                  Male Doctors
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="fee">
            <AccordionTrigger>Consultation Fee</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => updateFilter('fee', 'asc')}
                  className={cn(isActive('fee', 'asc') && "bg-primary text-white")}
                >
                  Lowest First
                </Button>
                <Button
                  variant="outline"
                  onClick={() => updateFilter('fee', 'desc')}
                  className={cn(isActive('fee', 'desc') && "bg-primary text-white")}
                >
                  Highest First
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="experience">
            <AccordionTrigger>Experience</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-2">
                {[5, 10, 15].map((years) => (
                  <Button
                    key={years}
                    variant="outline"
                    onClick={() => updateFilter('experience', years.toString())}
                    className={cn(isActive('experience', years.toString()) && "bg-primary text-white")}
                  >
                    {years}+ Years
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  )
}
