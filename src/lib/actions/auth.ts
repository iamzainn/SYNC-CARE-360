"use server"

import { AuthError } from "next-auth"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"
import { signIn,signOut } from "@/auth"


export async function doctorLogin(email: string, password: string) {
  try {
    const doctor = await db.doctor.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!doctor) {
      return { error: "Email not found" }
    }

    const isPasswordValid = await compare(password, doctor.password)

    if (!isPasswordValid) {
      return { error: "Invalid password" }
    }

    await signIn("credentials", {
      email,
      password,
      role: "DOCTOR",
      redirectTo: "/"
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }
        default:
          return { error: "Something went wrong" }
      }
    }
    throw error
  }
}
//logout function
export async function LogoutSession() {
  await signOut()
}