// app/(patient)/patient/dashboard/page.tsx
import { Metadata } from "next"
import { getPatientProfile } from "@/lib/actions/patient"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { PatientDashboard } from "@/components/patient/dashboard/PatientDashboard"


export const metadata: Metadata = {
  title: "Patient Dashboard | CareSync360",
  description: "Manage your bookings and appointments"
}

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  if (session.user.role !== "PATIENT") {
    redirect("/")
  }

  try {
    const patientProfile = await getPatientProfile()
    
    return (
      <main className="min-h-screen bg-gray-50">
        <PatientDashboard initialData={patientProfile} />
      </main>
    )
  } catch (error) {
    redirect("/error")
  }
}