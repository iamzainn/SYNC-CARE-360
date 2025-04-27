"use server"

import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { nurseSignUpSchema } from "@/lib/schemas/nurse"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { auth } from "@/auth"

export async function nurseSignUp(data: z.infer<typeof nurseSignUpSchema>) {
  try {
    const validatedFields = nurseSignUpSchema.safeParse(data)
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" }
    }

    const { email, password } = validatedFields.data

    // Check if email exists
    const existingNurse = await db.nurse.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingNurse) {
      return { error: "Email already registered! Please login." }
    }

    const hashedPassword = await hash(password, 10)
    
    const newNurse = await db.nurse.create({
      data: {
        ...validatedFields.data,
        email: email.toLowerCase(),
        password: hashedPassword,
      }
    })

    return { 
      success: true,
      message: "Registration successful! Please login to continue." 
    }

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { error: "A nurse with this email or phone number already exists." }
      }
    }
    console.error("Sign up error:", error)
    return { error: "Something went wrong during registration." }
  }
}

export async function getNurseProfile() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const nurseData = await db.nurse.findUnique({
    where: { id: session.user.id }
  })

  if (!nurseData) throw new Error("Nurse not found")

  const nurseProfile = {
    id: nurseData.id,
    name: nurseData.name,
    email: nurseData.email,
    phone: nurseData.phone,
    currentCity: nurseData.city,
  }

  return nurseProfile
} 