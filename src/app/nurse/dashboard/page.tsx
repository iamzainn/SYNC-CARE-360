import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { NurseDashboardContent } from "@/components/nurse/dashboard/NurseDashboardContent"

export default async function NurseDashboardPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "NURSE") {
    redirect("/nurse/auth")
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      <h1 className="text-3xl font-bold">Nurse Dashboard</h1>
      <p className="text-muted-foreground">
        Manage specialized treatments and patient care
      </p>
      
      <NurseDashboardContent nurseId={session.user.id} />
    </div>
  )
} 