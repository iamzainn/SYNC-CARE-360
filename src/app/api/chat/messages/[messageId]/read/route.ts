import { auth } from "@/auth"
import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const messageId = params.messageId

    // Create read receipt
    const readReceipt = await db.readReceipt.create({
      data: {
        messageId,
        userId: session.user.id,
        userRole: session.user.role,
      },
      include: {
        message: {
          include: {
            conversation: true,
          },
        },
      },
    })

    // Update message status
    await db.message.update({
      where: { id: messageId },
      data: { status: 'READ' },
    })

    // Update conversation unread count
    await db.conversation.update({
      where: { id: readReceipt.message.conversationId },
      data: {
        unreadCount: {
          decrement: 1,
        },
      },
    })

    // Notify the sender about read receipt
    await pusherServer.trigger(
      `chat_${readReceipt.message.conversationId}`,
      'message-read',
      {
        messageId,
        readBy: session.user.id,
        readAt: readReceipt.readAt,
      }
    )

    return NextResponse.json(readReceipt)
  } catch (error) {
    console.error("[MESSAGE_READ_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}