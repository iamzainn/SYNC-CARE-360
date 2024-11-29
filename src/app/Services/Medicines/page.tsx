

import { HowItWorks } from "@/app/components/services/how-it-works";
import { MedicineOrderForm } from "@/app/components/services/Medicine-order-form";
import { ServiceBreadcrumb } from "@/app/components/services/service-breadcrumb";
import { ServiceHero } from "@/app/components/services/service-hero";



export default function MedicinePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ServiceBreadcrumb 
        items={[
          { label: "HOME", href: "/" },
          { label: "Services", href: "/Services/Medicines" },
          { label: "Medicines", href: "/Services/Medicines" },
        ]} 
      />
      <ServiceHero />
      <HowItWorks />
      <MedicineOrderForm/>
    </main>
  )
}