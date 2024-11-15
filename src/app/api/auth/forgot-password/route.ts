
import { ResetPasswordEmail } from "@/components/auth/ResetPasswordTemplate"
import  {db} from "@/lib/db"
import { resend } from "@/lib/email/resend"

import crypto from "crypto"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

   
    const doctor = await db.doctor.findUnique({
      where: { email: email.toLowerCase() }
    })

    // If no doctor found, return success anyway for security
    if (!doctor) {
      return NextResponse.json({
        message: "If an account exists with this email, you will receive password reset instructions."
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await db.doctor.update({
      where: { email: doctor.email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Generate reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/doctor/auth/reset-password?token=${resetToken}`

    // Send email
    const r= await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'malikbashr3@gmail.com',
      subject: 'Reset Your Care Sync 360 Password',
      react: ResetPasswordEmail({
        doctorName: doctor.name,
        resetLink
      }) as React.ReactElement
    })

    console.log("response from resend", r)

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



