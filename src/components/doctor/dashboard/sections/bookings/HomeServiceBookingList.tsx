// components/doctor/dashboard/sections/bookings/HomeServiceBookingList.tsx
"use client"

import { useEffect, useState } from "react"
import { getHomeServiceBookings } from "@/lib/actions/booking"
import { Button } from "@/components/ui/button"
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card"
import { format } from "date-fns"
import { MessageSquare } from "lucide-react"

interface HomeServiceBookingListProps {
  doctorId: string
  onSelectBooking: (booking: any) => void
}

export function HomeServiceBookingList({ 
  doctorId, 
  onSelectBooking 
}: HomeServiceBookingListProps) {
  const [bookings, setBookings] = useState([] as any)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await getHomeServiceBookings(doctorId)
        setBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [doctorId])

  if (isLoading) {
    return <div>Loading bookings...</div>
  }

  if (bookings.length === 0) {
    return <div>No home service bookings found.</div>
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
                  Scheduled for: {format(new Date(booking.scheduledDate), "PPP")}
                  at {booking.startTime}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectBooking(booking)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </Button>
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
                <p className="text-muted-foreground">Status:</p>
                <p className="capitalize">{booking.status}</p>
                <p className="text-muted-foreground mt-1">Amount:</p>
                <p>${booking.totalAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


