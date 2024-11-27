'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import Link from "next/link"
import { hasSubItems, navigationItems } from "./navigation-items"

export function DesktopNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuTrigger>
              <div className="flex items-center gap-2">
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.title}
              </div>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4">
                {item.items?.map((location) => (
                  <li key={location.href} className="relative">
                    {hasSubItems(location) ? (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Link
                            href={location.href}
                            className="flex items-center gap-2 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            {location.icon && <location.icon className="h-4 w-4" />}
                            <span className="text-sm font-medium">{location.title}</span>
                          </Link>
                        </HoverCardTrigger>
                        <HoverCardContent 
                          className="w-[200px]" 
                          side="right" 
                          align="start"
                          sideOffset={10}
                        >
                          <ul className="space-y-2">
                            {location.items.map((subItem) => (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className="flex items-center gap-2 p-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                                >
                                  {subItem.icon && <subItem.icon className="h-4 w-4" />}
                                  {subItem.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </HoverCardContent>
                      </HoverCard>
                    ) : (
                      <Link
                        href={location.href}
                        className="flex items-center gap-2 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        {location.icon && <location.icon className="h-4 w-4" />}
                        <span className="text-sm font-medium">{location.title}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}