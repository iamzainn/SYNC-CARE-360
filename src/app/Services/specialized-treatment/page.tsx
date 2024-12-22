
// app/Services/specialized-treatment/page.tsx


import { ServiceBreadcrumb } from "@/app/components/services/service-breadcrumb";
import { ServiceHero } from "@/components/services/specialized-treatment/hero";
import { HowItWorks } from "@/components/services/specialized-treatment/how-it-works";
import { TreatmentRequestForm } from "@/components/services/treatment-request-form";



export default function SpecializedTreatmentPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ServiceBreadcrumb
        items={[
          { label: "HOME", href: "/" },
          { label: "Services", href: "/Services/specialized-treatment" },
          { label: "Specialized Medical Treatment", href: "/Services/specialized-treatment" },
        ]}
      />
      <ServiceHero 
     
      />
      <HowItWorks
        
      />
      <TreatmentRequestForm />
    </main>
  )
}
