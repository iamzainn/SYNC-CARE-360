
import { DoctorsSection } from "@/components/services/doctors-section"
import { ServiceBenefits } from "@/components/services/service-benefits"
import { ServiceHowItWorks } from "@/components/services/service-how-it-works"
import { ServiceFAQ } from "@/components/services/service-faq"
import { ServiceBreadcrumb } from "@/app/components/services/service-breadcrumb"
import { ServiceHero } from "@/app/components/services/service-hero"

interface HomeServicesPageProps {
  params: {
    city: string
  }
}

export default function HomeServicesPage({ params }: HomeServicesPageProps) {
  const breadcrumbItems = [
    { label: "HOME", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Home Services", href: "/services/home-services" },
    { label: params.city, href: `/services/home-services/${params.city}` }
  ]

  return (
    <main className="min-h-screen bg-background">
      <ServiceBreadcrumb items={breadcrumbItems} />
      <ServiceHero />
      <DoctorsSection />
      <ServiceBenefits />
      <ServiceHowItWorks />
      <ServiceFAQ />
    </main>
  )
}