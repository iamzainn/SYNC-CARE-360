"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DoctorProfile } from "@/types/doctor"
import { PersonalDetailsSection } from "./PersonalDetailsSection"
import { HomeServicesSection } from "./sections/HomeServicesSection"
import { OnlineServicesSection } from "./sections/online-service/OnlineServicesSection"
import { BookingsSection } from "./sections/BookingSection"

interface DoctorDashboardProps {
  initialData: DoctorProfile
}

export function DoctorDashboard({ initialData }: DoctorDashboardProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, Dr. {initialData.name}</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and services</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="home-services">Home Services</TabsTrigger>
          <TabsTrigger value="online-services">Online Appointments</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <PersonalDetailsSection initialData={initialData} />
        </TabsContent>
        <TabsContent value="home-services">
          <HomeServicesSection />
        </TabsContent>
        <TabsContent value="online-services">
          <OnlineServicesSection />
        </TabsContent>
        <TabsContent value="bookings">
          <BookingsSection doctorId={initialData.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}