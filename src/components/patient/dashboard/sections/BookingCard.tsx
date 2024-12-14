// components/patient/dashboard/sections/BookingCard.tsx
"use client"

import { useState } from "react"
import { 
  Card, 
  CardHeader,
  CardContent,
  CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"


interface BookingCardProps {
  booking: any
  onChatClick: () => void
  onStatusUpdate: (updatedBooking: any) => void
}

export function BookingCard({ booking, onChatClick, onStatusUpdate }: BookingCardProps) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateBookingStatus = async (status: string) => {
    try {
      setIsUpdating(true)
      const res = await fetch(`/api/patient/bookings/${booking.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error('Failed to update status')
      
      const updatedBooking = await res.json()
      onStatusUpdate(updatedBooking)
      
      toast({
        title: "Booking updated",
        description: "Your booking status has been updated successfully."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update booking status. Please try again."
      })
    } finally {
      setIsUpdating(false)
      setIsUpdateDialogOpen(false)
      setIsCancelDialogOpen(false)
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Dr. {booking.doctor.name}</h3>
            <p className="text-sm text-muted-foreground">
              {booking.doctor.specialization}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onChatClick}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat with Doctor
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Appointment</p>
            <p className="text-sm">
              {format(new Date(booking.scheduledDate), "PPP")}
            </p>
            <p className="text-sm">
              {booking.startTime} - {booking.endTime}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm capitalize">{booking.status}</p>
            <p className="text-sm font-medium mt-2">Payment</p>
            <p className="text-sm">
              ${booking.totalAmount} - {booking.paymentStatus}
            </p>
          </div>
        </div>

        <div className="mt-4 ">
          <p className="text-sm font-medium">Services Booked</p>
          <div className="mt-1">
            {Object.values(booking.selectedServices).map((service: any, index: number) => (
              <span 
                key={index}
                className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded mr-2 mb-2"
              >
                {service.type}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {booking.status === 'pending' && (
          <>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(true)}
              disabled={isUpdating}
            >
              Cancel Booking
            </Button>
            <Button
              onClick={() => setIsUpdateDialogOpen(true)}
              disabled={isUpdating}
            >
              Mark as Fulfilled
            </Button>
          </>
        )}
      </CardFooter>

      {/* Status Update Dialog */}
      <AlertDialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark Booking as Fulfilled?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the service as completed. Make sure the service has been provided satisfactorily.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updateBookingStatus('fulfilled')}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The doctor will be notified of the cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>No, keep booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updateBookingStatus('cancelled')}
              disabled={isUpdating}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isUpdating ? 'Cancelling...' : 'Yes, cancel booking'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}