
import { CardSkeleton } from "@/components/loading/card-skeleton"
import { HeroSkeleton } from "@/components/loading/hero-skeleton"
import { NavSkeleton } from "@/components/loading/nav-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Loading */}
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <NavSkeleton />
        </div>
      </header>

      {/* Hero Section Loading */}
      <HeroSkeleton />

      {/* Main Content Loading */}
      <main className="container py-8">
        <div className="space-y-4">
          {/* Section Title */}
          <Skeleton className="h-8 w-[200px]" />
          
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Load More Button */}
        <div className="mt-8 flex justify-center">
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </main>
    </div>
  )
}
