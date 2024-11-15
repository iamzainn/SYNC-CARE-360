import { db } from "@/lib/db"
import { hash } from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    // Find doctor with valid reset token
    const doctor = await db.doctor.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!doctor) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await hash(password, 12)

    // Update password and clear reset token
    await db.doctor.update({
      where: { id: doctor.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return NextResponse.json({
      message: "Password has been reset successfully"
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}