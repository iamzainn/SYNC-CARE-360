// components/doctor/dashboard/sections/bookings/OnlineBookingList.tsx
"use client"

import { useEffect, useState } from "react"
import { getOnlineBookings } from "@/lib/actions/booking"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { format } from "date-fns"
import { MessageSquare, Video } from "lucide-react"

interface OnlineBookingListProps {
  doctorId: string
  onSelectBooking: (booking: any) => void
}

export function OnlineBookingList({
  doctorId,
  onSelectBooking
}: OnlineBookingListProps) {
  const [bookings, setBookings] = useState([] as any)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getOnlineBookings(doctorId)
        setBookings(data)
      } catch (error) {
        console.error("Error fetching online bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [doctorId])

  if (isLoading) {
    return <div>Loading online consultations...</div>
  }

  if (bookings.length === 0) {
    return <div>No online consultations found.</div>
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking: any) => (
        <Card key={booking.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {booking.patient.name}
                </CardTitle>
                <CardDescription>
                  Appointment: {format(new Date(booking.appointmentDate), "PPP")}
                  <br />
                  Time: {booking.startTime} - {booking.endTime}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectBooking(booking)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                {booking.status === "CONFIRMED" && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      // Handle video call
                    }}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Start Call
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Contact:</p>
                <p>{booking.patient.phone}</p>
                <p>{booking.patient.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type:</p>
                <p className="capitalize">{booking.appointmentType}</p>
                <p className="text-muted-foreground">Status:</p>
                <p className="capitalize">{booking.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}