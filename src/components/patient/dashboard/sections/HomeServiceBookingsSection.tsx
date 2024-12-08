// components/patient/dashboard/sections/HomeServiceBookingsSection.tsx
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ChatWindow } from "./ChatWindow"
import { BookingCard } from "./BookingCard"
import { Loader2 } from "lucide-react"

interface HomeServiceBookingsSectionProps {
  patientId: string
}

export function HomeServiceBookingsSection({ patientId }: HomeServiceBookingsSectionProps) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/patient/bookings/home-service?patientId=${patientId}`)
        if (!res.ok) throw new Error('Failed to fetch bookings')
        const data = await res.json()
        setBookings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [patientId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onChatClick={() => {
                setSelectedBooking(booking)
                setIsChatOpen(true)
              }}
              onStatusUpdate={(updatedBooking) => {
                setBookings(prevBookings => 
                  prevBookings.map(b => 
                    b.id === updatedBooking.id ? updatedBooking : b
                  )
                )
              }}
            />
          ))}
          {bookings.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              No home service bookings found
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card className="p-6 h-[calc(100vh-240px)] flex flex-col">
          {isChatOpen && selectedBooking ? (
            <ChatWindow
              booking={selectedBooking}
              patientId={patientId}
              onClose={() => {
                setIsChatOpen(false)
                setSelectedBooking(null)
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a booking to start chatting with the doctor
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}