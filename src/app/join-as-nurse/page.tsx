import { Metadata } from "next"

import { NurseVerificationForm } from "@/components/nurse-verification/NurseVerificationForm"
import { ServiceBreadcrumb } from "../components/services/service-breadcrumb"

export const metadata: Metadata = {
  title: "Join as Nurse | CareSync360",
  description: "Join CareSync360 as a nursing provider. Complete your verification process and start providing nursing services.",
}

export default function JoinAsNursePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ServiceBreadcrumb 
        items={[
          { label: "HOME", href: "/" },
          { label: "Services", href: "/services" },
          { label: "Join as Nurse", href: "/join-as-nurse" },
        ]} 
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Join CareSync360 as a Nurse
          </h1>
          <p className="text-muted-foreground">
            Select the services you provide to start helping patients on our platform.
          </p>
        </div>
        <NurseVerificationForm />
      </div>
    </main>
  )
} 