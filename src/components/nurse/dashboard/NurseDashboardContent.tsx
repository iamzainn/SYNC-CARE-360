// src/components/nurse/dashboard/NurseDashboardContent.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingsSection } from "./sections/BookingsSection"
import { User, CalendarDays, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpecializedServicesSection } from "./sections/specialized-service/SpecializedServicesSection"

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

      <Tabs defaultValue="specialized-services" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="specialized-services">Specialized Services</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>
        
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