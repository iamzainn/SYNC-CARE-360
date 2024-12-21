// app/labs/[labId]/page.tsx
import { notFound } from "next/navigation"

import { LabHeader } from "@/components/labs/lab-header"
import { TestGrid } from "@/components/labs/test-grid"
import { LabsLayout } from "@/components/layouts/labs-layout"
import { labs, tests } from "@/libdata/labs"
import { ServiceBreadcrumb } from "@/app/components/services/service-breadcrumb"


interface LabPageProps {
  params: {
    labId: string
  }
}

export default function LabPage({ params }: LabPageProps) {
  const lab = labs.find(l => l.id === params.labId)
  
  if (!lab) {
    notFound()
  }

  const labTests = tests.filter(test => 
    test.labPricing.some(pricing => pricing.labId === lab.id)
  )

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Labs", href: "/labs" },
    { label: lab.name, href: `/labs/${lab.id}` }
  ]

  return (
    <LabsLayout>
      <ServiceBreadcrumb items={breadcrumbItems} />
      <LabHeader lab={lab} />
      <TestGrid tests={labTests} labId={lab.id} />
    </LabsLayout>
  )
}