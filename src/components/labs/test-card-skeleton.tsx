// components/labs/test-card-skeleton.tsx
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TestCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="pt-2">
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-9 w-full mt-4" />
      </div>
    </Card>
  )
}