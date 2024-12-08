import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher"

export async function PATCH(
  req: Request,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    if (!status || !['CANCELLED'].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 })
    }

    const appointment = await db.onlineAppointment.update({
      where: {
        id: params.appointmentId,
        patientId: session.user.id
      },
      data: {
        status
      },
      include: {
        onlineService: {
          include: {
            doctor: true
          }
        }
      }
    })

    // Notify the doctor
    await pusherServer.trigger(
      `user_${appointment.doctorId}`,
      'appointment-update',
      {
        type: 'APPOINTMENT_UPDATE',
        appointmentId: appointment.id,
        status,
        message: `Appointment ${status.toLowerCase()} by patient`,
        patientName: session.user.name
      }
    )

    // Create notification
    await db.notification.create({
      data: {
        userId: appointment.doctorId,
        userRole: 'DOCTOR',
        type: 'BOOKING_UPDATE',
        title: 'Appointment Status Updated',
        content: `Online appointment has been ${status.toLowerCase()} by ${session.user.name}`,
        data: {
          appointmentId: appointment.id,
          status
        }
      }
    })

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("[APPOINTMENT_STATUS_UPDATE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}