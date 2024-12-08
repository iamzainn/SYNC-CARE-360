import { Metadata } from "next"
import { getDoctorProfile } from "@/lib/actions/doctor"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { DoctorDashboard } from "@/components/doctor/dashboard/DoctorDashboard"
export const metadata: Metadata = {
  title: "Doctor Dashboard | CareSync360",
  description: "Manage your professional profile and services"
}

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  if (!session.user.isVerifiedDoctor) {
    redirect("/join-as-doctor")
  }

  try {
    const doctorProfile = await getDoctorProfile()
    // console.log(doctorProfile)
    
    return (
      <main className="min-h-screen bg-gray-50">
        <DoctorDashboard initialData={doctorProfile} />
      </main>
    )
  } catch (error) {
    redirect("/error")
  }
}