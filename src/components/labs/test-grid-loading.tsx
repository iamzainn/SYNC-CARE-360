// components/labs/test-grid-loading.tsx
import { TestCardSkeleton } from "./test-card-skeleton"

export function TestGridLoading() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <TestCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}