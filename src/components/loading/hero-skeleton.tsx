import { Skeleton } from "../ui/skeleton";

export function HeroSkeleton() {
    return (
      <div className="relative w-full h-[400px] overflow-hidden rounded-3xl mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mb-12">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-4 text-center">
            <Skeleton className="h-12 w-[300px] mx-auto" />
            <Skeleton className="h-6 w-[200px] mx-auto" />
            <Skeleton className="h-10 w-[150px] mx-auto" />
          </div>
        </div>
      </div>
    )
  }