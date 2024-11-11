"use server"

import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { patientSignUpSchema } from "@/lib/schemas/patient"
import { Prisma } from "@prisma/client"
import { z } from "zod"

export async function patientSignUp(data: z.infer<typeof patientSignUpSchema>) {
  try {
    const validatedFields = patientSignUpSchema.safeParse(data)
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" }
    }

    const { email, password } = validatedFields.data

    // Check if email exists
    const existingPatient = await db.patient.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingPatient) {
      return { error: "Email already registered! Please login." }
    }

    const hashedPassword = await hash(password, 10)
    
    const newPatient = await db.patient.create({
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
        return { error: "A patient with this email or phone number already exists." }
      }
    }
    console.error("Sign up error:", error)
    return { error: "Something went wrong during registration." }
  }
}