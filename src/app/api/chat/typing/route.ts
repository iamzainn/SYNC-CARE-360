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
    const { conversationId, isTyping } = body

    if (!conversationId) {
      return new NextResponse("Conversation ID is required", { status: 400 })
    }

    // Update typing indicator in database
    await db.typingIndicator.upsert({
      where: {
        conversationId_userId: {
          conversationId,
          userId: session.user.id,
        },
      },
      update: {
        isTyping,
        lastTypedAt: new Date(),
      },
      create: {
        conversationId,
        userId: session.user.id,
        userRole: session.user.role,
        isTyping,
      },
    })

    // Get the conversation to find other participant
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      select: {
        doctorId: true,
        patientId: true,
      },
    })

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 })
    }

    // Trigger real-time typing indicator update
    await pusherServer.trigger(
      `chat_${conversationId}`,
      'typing-indicator',
      {
        userId: session.user.id,
        isTyping,
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[TYPING_INDICATOR_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
