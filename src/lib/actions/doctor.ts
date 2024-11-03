"use server"

import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { doctorSignUpSchema } from "@/lib/schemas/doctor"
import { Prisma } from "@prisma/client"
import { z } from "zod"

export async function doctorSignUp(data: z.infer<typeof doctorSignUpSchema>) {
  try {
    const validatedFields = doctorSignUpSchema.safeParse(data)
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" }
    }

    const { email, password } = validatedFields.data

    // Check if email exists
    const existingDoctor = await db.doctor.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingDoctor) {
      return { error: "Email already registered! Please login." }
    }

    const hashedPassword = await hash(password, 10)
    
    const newDoctor = await db.doctor.create({
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
        return { error: "A doctor with this email or phone number already exists." }
      }
    }
    console.error("Sign up error:", error)
    return { error: "Something went wrong during registration." }
  }
}