import { DashboardLoadingSkeleton } from "@/components/dashboard/loading-skeleton"

export default function PatientDashboardLoading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DashboardLoadingSkeleton />
    </div>
  )
} 