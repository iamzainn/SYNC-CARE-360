import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function OnlineServiceSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center space-x-4">
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Fee Section Skeleton */}
          <div className="rounded-lg border p-4">
            <div className="h-5 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Time Slots Skeleton */}
          <div className="rounded-lg border p-4">
            <div className="h-5 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((j) => (
                      <div 
                        key={j}
                        className="h-8 w-32 bg-gray-200 rounded animate-pulse" 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}