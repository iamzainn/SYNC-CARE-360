import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
  } from "@/components/ui/navigation-menu"
  import { cn } from "@/lib/utils"
  import Link from "next/link"
  import { navigationItems } from "./navigation-items"
  
  export function DesktopNav() {
    return (
      <NavigationMenu>
        <NavigationMenuList className="flex gap-6">
          {navigationItems.map((item) => (
            <NavigationMenuItem key={item.href} className="flex-shrink-0">
              {item.dropdownItems.length > 0 ? (
                <>
                  <NavigationMenuTrigger 
                    className="text-sm font-medium bg-transparent hover:bg-transparent px-2 h-9"
                  >
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4">
                      {item.dropdownItems.map((dropdownItem) => (
                        <li key={dropdownItem.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={dropdownItem.href}
                              className="block select-none rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground"
                            >
                              {dropdownItem.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className={cn(
                    "inline-flex h-9 items-center justify-center rounded-md px-2",
                    "text-sm font-medium transition-colors hover:text-primary",
                    "whitespace-nowrap"
                  )}>
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    )
  }