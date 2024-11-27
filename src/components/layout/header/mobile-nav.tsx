'use client'

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Phone } from "lucide-react"
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

  const renderItems = (items: any[], level: number = 0) => {
    return (
      <Accordion type="single" collapsible>
        {items.map((item) => (
          <AccordionItem value={item.href} key={item.href}>
            {item.items ? (
              <>
                <AccordionTrigger className={`pl-${level * 4}`}>
                  <div className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {item.items && renderItems(item.items, level + 1)}
                </AccordionContent>
              </>
            ) : (
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 p-2 pl-${level * 4 + 4} text-sm text-muted-foreground hover:text-foreground`}
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.title}
              </Link>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="xl:hidden ml-2">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-6">
          <nav className="flex flex-col space-y-2">
            {navigationItems.map((item) => (
              <Accordion type="single" collapsible key={item.href}>
                <AccordionItem value={item.href}>
                  <AccordionTrigger className="flex items-center gap-2">
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    {renderItems(item.items)}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}