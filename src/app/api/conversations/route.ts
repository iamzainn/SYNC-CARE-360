// app/api/conversations/route.ts
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { doctorId, patientId, homeServiceBookingId, onlineAppointmentId } = body

    // First, try to find an existing conversation
    const existingConversation = await db.conversation.findFirst({
      where: {
        doctorId,
        patientId,
        OR: [
          {
            AND: [
              { homeServiceBookingId: homeServiceBookingId ?? null },
              { onlineAppointmentId: null }
            ]
          },
          {
            AND: [
              { homeServiceBookingId: null },
              { onlineAppointmentId: onlineAppointmentId ?? null }
            ]
          }
        ]
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (existingConversation) {
      return NextResponse.json(existingConversation)
    }

    // If no existing conversation, create a new one
    const newConversation = await db.conversation.create({
      data: {
        doctorId,
        patientId,
        ...(homeServiceBookingId && { homeServiceBookingId }),
        ...(onlineAppointmentId && { onlineAppointmentId })
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(newConversation)
  } catch (error) {
    console.error("[CONVERSATION_CREATE_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}