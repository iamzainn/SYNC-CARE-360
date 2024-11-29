
import { ServiceBreadcrumb } from "@/app/components/services/service-breadcrumb"
import { DataManagementForm } from "@/components/data-management/data-management-form"

export default function DataManagementPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <ServiceBreadcrumb 
        items={[
          { label: "HOME", href: "/" },
          { label: "Services", href: "/Services/DataManagement" },
          { label: "Data Management", href: "/Services/DataManagement" },
        ]} 
      />
      <DataManagementForm />
    </main>
  )
}