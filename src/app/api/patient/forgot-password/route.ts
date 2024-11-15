import { db } from "@/lib/db"
import { resend } from "@/lib/email/resend"
import { ResetPasswordEmail } from "@/components/auth/ResetPasswordTemplate"
import crypto from "crypto"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const patient = await db.patient.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!patient) {
      return NextResponse.json({
        message: "If an account exists with this email, you will receive password reset instructions."
      })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    await db.patient.update({
      where: { email: patient.email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/patient/auth/reset-password?token=${resetToken}`

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: patient.email,
      subject: 'Reset Your Care Sync 360 Password',
      react: ResetPasswordEmail({
        name: patient.name,
        resetLink
      }) as React.ReactElement
    })

    return NextResponse.json({
      message: "If an account exists with this email, you will receive password reset instructions."
    })

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    )
  }
}