// components/services/service-breadcrumb.tsx
import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href: string
}

interface ServiceBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function ServiceBreadcrumb({ items }: ServiceBreadcrumbProps) {
  return (
    <nav className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            )}
            <Link
              href={item.href}
              className={`hover:text-blue-600 ${
                index === items.length - 1
                  ? "text-gray-600 cursor-default pointer-events-none"
                  : "text-gray-500"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}