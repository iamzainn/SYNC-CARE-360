// components/patient/dashboard/sections/online-service/OnlineAppointmentsSection.tsx
"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ChatWindow } from "../ChatWindow"
import { OnlineAppointmentCard } from "./OnlineAppointmentCard"
import { Loader2 } from "lucide-react"

interface OnlineAppointmentsSectionProps {
  patientId: string
}

export function OnlineAppointmentsSection({ patientId }: OnlineAppointmentsSectionProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/patient/appointments/online?patientId=${patientId}`)
        if (!res.ok) throw new Error('Failed to fetch appointments')
        const data = await res.json()
        setAppointments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch appointments')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
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
          {appointments.map((appointment) => (
            <OnlineAppointmentCard
              key={appointment.id}
              appointment={appointment}
              onChatClick={() => {
                setSelectedAppointment(appointment)
                setIsChatOpen(true)
              }}
              onStatusUpdate={(updatedAppointment) => {
                setAppointments(prevAppointments => 
                  prevAppointments.map(a => 
                    a.id === updatedAppointment.id ? updatedAppointment : a
                  )
                )
              }}
            />
          ))}
          {appointments.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              No online appointments found
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card className="p-6 h-[calc(100vh-240px)] flex flex-col">
          {isChatOpen && selectedAppointment ? (
            <ChatWindow
              booking={selectedAppointment}
              patientId={patientId}
              onClose={() => {
                setIsChatOpen(false)
                setSelectedAppointment(null)
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select an appointment to start chatting with the doctor
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}