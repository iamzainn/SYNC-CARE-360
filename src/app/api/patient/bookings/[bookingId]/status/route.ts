import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher"

export async function PATCH(
  req: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    if (!status || !['fulfilled', 'cancelled'].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 })
    }

    const booking = await db.homeServiceBooking.update({
      where: {
        id: params.bookingId,
        patientId: session.user.id // Ensure the booking belongs to the patient
      },
      data: {
        status
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Notify the doctor about the status change
    await pusherServer.trigger(
      `user_${booking.doctorId}`,
      'booking-update',
      {
        type: 'BOOKING_UPDATE',
        bookingId: booking.id,
        status,
        message: `Booking ${status} by patient`,
        patientName: session.user.name
      }
    )

    // Create a notification for the doctor
    await db.notification.create({
      data: {
        userId: booking.doctorId,
        userRole: 'DOCTOR',
        type: 'BOOKING_UPDATE',
        title: 'Booking Status Updated',
        content: `Booking has been marked as ${status} by ${session.user.name}`,
        data: {
          bookingId: booking.id,
          status
        }
      }
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error("[BOOKING_STATUS_UPDATE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}