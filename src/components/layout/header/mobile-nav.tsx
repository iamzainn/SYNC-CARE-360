'use client'

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { navigationItems } from "./navigation-items"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="ml-auto lg:hidden" // Moved to right
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-[300px] sm:w-[400px]"
        onPointerDownOutside={() => setOpen(false)} // Close on outside click
      >
        <nav className="flex flex-col space-y-4">
          {navigationItems.map((item) => (
            <div key={item.href}>
              {item.dropdownItems.length > 0 ? (
                <Accordion type="single" collapsible>
                  <AccordionItem value={item.href}>
                    <AccordionTrigger className="text-base py-2">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-2 pl-4">
                        {item.dropdownItems.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            onClick={() => setOpen(false)}
                            className="py-2 text-sm text-muted-foreground hover:text-foreground"
                          >
                            {dropdownItem.title}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-base hover:text-primary"
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}