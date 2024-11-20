import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DoctorCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>

        <Skeleton className="h-9 w-full" />
      </div>
    </Card>
  )
}