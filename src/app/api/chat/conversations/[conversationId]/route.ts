// app/api/chat/conversations/[conversationId]/route.ts
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const messages = await db.message.findMany({
      where: {
        conversationId: params.conversationId,
      },
      include: {
        conversation: {
          include: {
            doctor: true,
            patient: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("[MESSAGES_GET_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}