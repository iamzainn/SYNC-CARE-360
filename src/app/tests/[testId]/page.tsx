import { notFound } from "next/navigation"

import { TestDetails } from "@/components/labs/test-details"
import { LabPricing } from "@/components/labs/lab-pricing"
import { LabsLayout } from "@/components/layouts/labs-layout"
import { tests } from "@/libdata/labs"
import { ServiceBreadcrumb } from "@/app/components/services/service-breadcrumb"


interface TestPageProps {
  params: {
    testId: string
  }
}

export default function TestPage({ params }: TestPageProps) {
  const test = tests.find(t => t.id === params.testId)
  
  if (!test) {
    notFound()
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tests", href: "/tests" },
    { label: test.name, href: `/tests/${test.id}` }
  ]

  return (
    <LabsLayout>
      <ServiceBreadcrumb items={breadcrumbItems} />
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TestDetails test={test} />
          </div>
          <div>
            <LabPricing test={test} />
          </div>
        </div>
      </div>
    </LabsLayout>
  )
}