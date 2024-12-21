import { auth } from "@/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export const dynamic='force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get("patientId")

    if (!patientId) {
      return new NextResponse("Patient ID is required", { status: 400 })
    }

    const appointments = await db.onlineAppointment.findMany({
      where: {
        patientId: patientId
      },
      include: {
        onlineService: {
          include: {
            doctor: {
              select: {
                id: true,
                name: true,
                email: true,
                specialization: true,
                isVerifiedDoctor: true
              }
            }
          }
        }
      },
      orderBy: [
        {
          appointmentDate: 'desc'
        },
        {
          createdAt: 'desc'
        }
      ]
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("[ONLINE_APPOINTMENTS_GET_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}