// src/components/nurse/dashboard/NurseDashboardContent.tsx

import { BookingsSection } from "./sections/BookingsSection"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpecializedServicesSection } from "./sections/specialized-service/SpecializedServicesSection"
import { NurseProfileSection } from "./sections/NurseProfileSection"

interface NurseDashboardContentProps {
  nurseId: string
  nurseName?: string
}

export function NurseDashboardContent({ nurseId, nurseName = "Nurse" }: NurseDashboardContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {nurseName}</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and services</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="specialized-services">Specialized Services</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <NurseProfileSection nurseId={nurseId} nurseName={nurseName} />
        </TabsContent>
        <TabsContent value="specialized-services">
          <SpecializedServicesSection />
        </TabsContent>
        <TabsContent value="bookings">
          <BookingsSection nurseId={nurseId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}