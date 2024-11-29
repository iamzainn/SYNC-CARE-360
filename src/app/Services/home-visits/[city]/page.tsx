import { ServiceHero } from "@/app/components/services/HomeServiceServiceHero"
import { ServiceBreadcrumb } from "@/app/components/services/service-breadcrumb"

import { DoctorsSection } from "@/components/services/doctors-section"
import { ServiceBenefits } from "@/components/services/service-benefits"
import { ServiceFAQ } from "@/components/services/service-faq"
import { ServiceHowItWorks } from "@/components/services/service-how-it-works"

interface HomeServicesPageProps {
  params: {
    city: string
  }
}

export default function HomeServicesPage({ params }: HomeServicesPageProps) {
  const { city } = params
  const breadcrumbItems = [
    { label: "HOME", href: "/" },
    { label: "Services", href: `/Services/home-vistis/${city ? city.toLowerCase() : 'lahore'}` },
    { label: "Home Visits", href: `/Services/home-visits/${city ? city.toLowerCase() : 'lahore'}` },
    { label: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(), href: `/services/home-visits/${city ? city.toLowerCase() : 'lahore'}` }
  ]

  return (
    <main className="min-h-screen bg-background">
      <ServiceBreadcrumb items={breadcrumbItems} />
      <ServiceHero city={city}  />
      <DoctorsSection city={city}  />
      <ServiceBenefits />
      <ServiceHowItWorks />
      <ServiceFAQ />
    </main>
  )
}