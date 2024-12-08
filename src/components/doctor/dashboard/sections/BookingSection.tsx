"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { HomeServiceBookingList } from "./bookings/HomeServiceBookingList"
import { OnlineBookingList } from "./bookings/OnlineBookingList"
import { ChatWindow } from "./bookings/ChatWindow"


interface BookingsSectionProps {
  doctorId: string
}

export function BookingsSection({ doctorId }: BookingsSectionProps) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="p-6">
          <Tabs defaultValue="home-services" className="space-y-4">
            <TabsList>
              <TabsTrigger value="home-services">Home Service Bookings</TabsTrigger>
              <TabsTrigger value="online">Online Consultations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="home-services">
              <HomeServiceBookingList 
                doctorId={doctorId}
                onSelectBooking={(booking) => {
                  setSelectedBooking(booking)
                  setIsChatOpen(true)
                }}
              />
            </TabsContent>
            
            <TabsContent value="online">
              <OnlineBookingList 
                doctorId={doctorId}
                onSelectBooking={(booking) => {
                  setSelectedBooking(booking)
                  setIsChatOpen(true)
                }}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="p-6 h-[calc(100vh-240px)] flex flex-col">
          {isChatOpen && selectedBooking ? (
            <ChatWindow
              booking={selectedBooking}
              doctorId={doctorId}
              onClose={() => {
                setIsChatOpen(false)
                setSelectedBooking(null)
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a booking to start chatting
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}