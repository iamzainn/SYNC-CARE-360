import { Skeleton } from "@/components/ui/skeleton"

export function NavSkeleton() {
  return (
    <div className="flex items-center space-x-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24" />
      ))}
    </div>
  )
}