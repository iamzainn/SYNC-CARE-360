import { auth } from "@/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { conversationId, content } = body

    if (!conversationId || !content) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Create new message
    const message = await db.message.create({
      data: {
        conversationId,
        content,
        senderId: session.user.id,
        senderRole: session.user.role,
      },
      include: {
        conversation: {
          include: {
            doctor: true,
            patient: true,
          }
        }
      }
    })

    // Update conversation's lastMessageAt
    await db.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    })

    // Trigger Pusher event for real-time update
    await pusherServer.trigger(
      `chat_${conversationId}`,
      'new-message',
      message
    )

    // Notify other participant
    const otherParticipantId = session.user.role === 'DOCTOR' 
      ? message.conversation.patientId 
      : message.conversation.doctorId

    await pusherServer.trigger(
      `user_${otherParticipantId}`,
      'new-notification',
      {
        type: 'NEW_MESSAGE',
        conversationId,
        message: content,
        senderName: session.user.name
      }
    )

    return NextResponse.json(message)
  } catch (error) {
    console.error("[CHAT_SEND_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}