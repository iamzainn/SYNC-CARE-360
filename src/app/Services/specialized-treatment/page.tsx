// app/Services/specialized-treatment/page.tsx

import { ServiceBreadcrumb } from "@/app/components/services/service-breadcrumb";
import { ServiceHero } from "@/components/services/specialized-treatment/hero";
import { HowItWorks } from "@/components/services/specialized-treatment/how-it-works";
import { TreatmentRequestForm } from "@/components/services/treatment-request-form";

export const metadata = {
  title: "Specialized Medical Treatment",
  description: "Request specialized medical treatments from qualified nurses",
}

export default function SpecializedTreatmentPage() {
  return (
    <div className="bg-background min-h-screen py-8">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Specialized Medical Treatment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Request specialized medical treatments from qualified nurses
          </p>
        </div>

        <TreatmentRequestForm />
      </div>
    </div>
  )
}
