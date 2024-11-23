'use server'

import { db } from "@/lib/db"
import { 
  AppointmentStatus, 
  AppointmentType, 
  VisitType 
} from "@prisma/client"


interface CreateOnlineBookingParams {
  patientId: string
  doctorId: string
  onlineServiceId: string
  slot: {
    id: string
    dayOfWeek: string
    startTime: string
    endTime: string
    date: Date
  }
  appointmentType: AppointmentType
  visitType: VisitType
  amount: number
}

export async function createOnlineBooking({
  patientId,
  doctorId,
  onlineServiceId,
  slot,
  appointmentType,
  visitType,
  amount
}: CreateOnlineBookingParams) {
  try {
    // Start a transaction
    const result = await db.$transaction(async (tx) => {
      // Create the appointment
      const appointment = await tx.onlineAppointment.create({
        data: {
          patientId,
          doctorId,
          onlineServiceId,
          appointmentDate: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          appointmentType,
          visitType,
          status: AppointmentStatus.PENDING,
          amount
        },
        include: {
          patient: true,
          onlineService: {
            include: {
              doctor: true
            }
          }
        }
      })

      // Mark the slot as reserved
      await tx.onlineServiceSlot.update({
        where: { id: slot.id },
        data: { isReserved: true }
      })

      return appointment
    })

    return { appointment: result }
  } catch (error) {
    console.error('Online booking creation error:', error)
    throw new Error('Failed to create online booking')
  }
}

interface UpdateOnlinePaymentParams {
  appointmentId: string
  stripePaymentId: string
}

export async function updateOnlinePaymentStatus({
  appointmentId,
  stripePaymentId
}: UpdateOnlinePaymentParams) {
  try {
    const updatedAppointment = await db.onlineAppointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CONFIRMED,
        stripePaymentId ,
        updatedAt: new Date()
      }
    })

    return { success: true, appointment: updatedAppointment }
  } catch (error) {
    console.error('Online payment status update error:', error)
    throw new Error('Failed to update payment status')
  }
}

// Function to check slot availability
export async function checkSlotAvailability(slotId: string) {
  try {
    const slot = await db.onlineServiceSlot.findUnique({
      where: { id: slotId }
    })

    return {
      available: slot && !slot.isReserved,
      slot
    }
  } catch (error) {
    console.error('Slot availability check error:', error)
    throw new Error('Failed to check slot availability')
  }
}

// Function to update slot status
export async function updateOnlineSlotStatus(slotId: string, isReserved: boolean) {
  try {
    const updatedSlot = await db.onlineServiceSlot.update({
      where: { id: slotId },
      data: { isReserved }
    })

    return { success: true, slot: updatedSlot }
  } catch (error) {
    console.error('Slot status update error:', error)
    throw new Error('Failed to update slot status')
  }
}