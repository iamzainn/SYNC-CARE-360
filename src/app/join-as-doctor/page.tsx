import { Metadata } from "next"

import { DoctorVerificationForm } from "@/components/doctor-verification/DoctorVerificationForm"
import { ServiceBreadcrumb } from "../components/services/service-breadcrumb"

export const metadata: Metadata = {
  title: "Join as Doctor | CareSync360",
  description: "Join CareSync360 as a healthcare provider. Complete your verification process and start providing medical services.",
}

export default function JoinAsDoctorPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ServiceBreadcrumb 
        items={[
          { label: "HOME", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Join as Doctor", href: "/join-as-doctor" },
        ]} 
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Join CareSync360 as a Doctor
          </h1>
          <p className="text-muted-foreground">
            Complete the verification process to start providing medical services on our platform.
          </p>
        </div>
        <DoctorVerificationForm />
      </div>
    </main>
  )
}