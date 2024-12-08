// components/patient/dashboard/sections/online-service/OnlineAppointmentCard.tsx
"use client"

import { useState } from "react"
import { 
  Card, 
  CardHeader,
  CardContent,
  CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Video } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

interface OnlineAppointmentCardProps {
  appointment: any
  onChatClick: () => void
  onStatusUpdate: (updatedAppointment: any) => void
}

export function OnlineAppointmentCard({ 
  appointment, 
  onChatClick, 
  onStatusUpdate 
}: OnlineAppointmentCardProps) {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const isUpcoming = new Date(appointment.appointmentDate) > new Date()
  const isToday = format(new Date(appointment.appointmentDate), 'yyyy-MM-dd') === 
                  format(new Date(), 'yyyy-MM-dd')

  const updateAppointmentStatus = async (status: string) => {
    try {
      setIsUpdating(true)
      const res = await fetch(`/api/patient/appointments/${appointment.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })

      if (!res.ok) throw new Error('Failed to update status')
      
      const updatedAppointment = await res.json()
      onStatusUpdate(updatedAppointment)
      
      toast({
        title: "Appointment updated",
        description: "Your appointment status has been updated successfully."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update appointment status. Please try again."
      })
    } finally {
      setIsUpdating(false)
      setIsCancelDialogOpen(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Dr. {appointment.onlineService.doctor.name}</h3>
            <p className="text-sm text-muted-foreground">
              {appointment.onlineService.doctor.specialization}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onChatClick}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            {isToday && appointment.status === 'CONFIRMED' && (
              <Button
                size="sm"
                onClick={() => {
                  // Handle video call
                  toast({
                    title: "Coming Soon",
                    description: "Video consultation feature will be available soon."
                  })
                }}
              >
                <Video className="h-4 w-4 mr-2" />
                Join Call
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Appointment Date</p>
            <p className="text-sm">
              {format(new Date(appointment.appointmentDate), "PPP")}
            </p>
            <p className="text-sm">
              {appointment.startTime} - {appointment.endTime}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Type</p>
            <Badge variant="outline" className="mt-1">
              {appointment.appointmentType.replace(/_/g, ' ')}
            </Badge>
            <p className="text-sm font-medium mt-2">Status</p>
            <Badge 
              variant="secondary"
              className={`mt-1 ${getStatusBadgeColor(appointment.status)}`}
            >
              {appointment.status}
            </Badge>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium">Payment Details</p>
          <p className="text-sm mt-1">
            Amount: ${appointment.amount}
          </p>
          <p className="text-sm">
            Visit Type: {appointment.visitType.replace(/_/g, ' ')}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {isUpcoming && appointment.status === 'PENDING' && (
          <Button
            variant="destructive"
            onClick={() => setIsCancelDialogOpen(true)}
            disabled={isUpdating}
          >
            Cancel Appointment
          </Button>
        )}
      </CardFooter>

      {/* Cancel Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The doctor will be notified of the cancellation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>No, keep appointment</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => updateAppointmentStatus('CANCELLED')}
              disabled={isUpdating}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isUpdating ? 'Cancelling...' : 'Yes, cancel appointment'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}