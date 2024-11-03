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
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          {navigationItems.map((item) => (
            <NavigationMenuItem key={item.href}>
              {item.dropdownItems.length > 0 ? (
                <>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      {item.dropdownItems.map((dropdownItem) => (
                        <li key={dropdownItem.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={dropdownItem.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">
                                {dropdownItem.title}
                              </div>
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
                    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2",
                    "text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                    "disabled:pointer-events-none disabled:opacity-50"
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