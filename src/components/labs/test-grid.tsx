// components/labs/test-grid.tsx

import { Test } from "@/lib/types/lab-test"
import { TestCard } from "./test-card"


interface TestGridProps {
  tests: Test[]
  labId?: string // Optional, only needed when showing tests for a specific lab
}

export function TestGrid({ tests, labId }: TestGridProps) {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tests.map((test) => (
          <TestCard 
            key={test.id} 
            test={test}
            labId={labId}
          />
        ))}
      </div>
      <div className="mt-8 text-center">
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          Find More Tests
        </button>
      </div>
    </div>
  )
}