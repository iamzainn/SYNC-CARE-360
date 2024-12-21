// app/tests/page.tsx
"use client"

import { useEffect, useState } from "react"

import { TestGrid } from "@/components/labs/test-grid"
import { tests } from "@/libdata/labs"
import { ServiceBreadcrumb } from "../components/services/service-breadcrumb"
import { TestFilters } from "@/components/labs/test-filters"
import { TestGridLoading } from "@/components/labs/test-grid-loading"


// Get unique categories from tests
const categories = Array.from(
  new Set(tests.map(test => test.category))
)

export default function TestsPage() {
  const [filteredTests, setFilteredTests] = useState(tests)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (term: string) => {
    setIsLoading(true)
    setSearchTerm(term)
    
    setTimeout(() => {
      filterTests(term, selectedCategory)
      setIsLoading(false)
    }, 500)
  }

  const handleCategoryChange = (category: string) => {
    setIsLoading(true)
    setSelectedCategory(category)
    
    setTimeout(() => {
      filterTests(searchTerm, category)
      setIsLoading(false)
    }, 500)
  }

  

  const filterTests = (term: string, category: string) => {
    let filtered = [...tests]

    if (term) {
      const searchLower = term.toLowerCase()
      filtered = filtered.filter(test => 
        test.name.toLowerCase().includes(searchLower) ||
        test.knownAs.toLowerCase().includes(searchLower)
      )
    }

    if (category) {
      filtered = filtered.filter(test => 
        test.category === category
      )
    }

    setFilteredTests(filtered)
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tests", href: "/tests" }
  ]

  return (
    <div>
      <ServiceBreadcrumb items={breadcrumbItems} />
      
      <div className="py-6">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">Laboratory Tests</h1>
          <p className="text-gray-600 mt-2">
            Browse our comprehensive range of diagnostic tests
          </p>
        </div>
      </div>

      <TestFilters
        categories={categories}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
      />

      {isLoading ? <TestGridLoading /> : <TestGrid tests={filteredTests} />}
    </div>
  )
}