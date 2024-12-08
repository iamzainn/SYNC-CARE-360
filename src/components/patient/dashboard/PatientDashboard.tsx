// components/patient/dashboard/PatientDashboard.tsx
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import { PatientProfile } from "@/types/patient"
import { HomeServiceBookingsSection } from "./sections/HomeServiceBookingsSection"
import { OnlineAppointmentsSection } from "./sections/online-service/OnlineAppointmentsSection"

interface PatientDashboardProps {
  initialData: PatientProfile
}

export function PatientDashboard({ initialData }: PatientDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {initialData.name}</h1>
          <p className="text-muted-foreground mt-1">Manage your bookings and appointments</p>
        </div>
      </div>

      <Tabs defaultValue="home-services" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="home-services">Home Services</TabsTrigger>
          <TabsTrigger value="online-appointments">Online Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="home-services">
          <HomeServiceBookingsSection patientId={initialData.id} />
        </TabsContent>
        <TabsContent value="online-appointments">
          <OnlineAppointmentsSection patientId={initialData.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}