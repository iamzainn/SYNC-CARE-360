"use server"

import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { doctorSignUpSchema } from "@/lib/schemas/doctor"
import { Prisma } from "@prisma/client"
import { z } from "zod"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { PersonalDetailsFormValues, personalDetailsSchema } from "../validations/doctor"

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


export async function getDoctorProfile() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const doctorData = await db.doctor.findUnique({
    where: { id: session.user.id },
    include: {
      verification: true, // Include verification data
    }
  })

  if (!doctorData) throw new Error("Doctor not found")

    // console.log("doctorData", doctorData)

  const doctorProfile = {
    id: doctorData.id,
    name: doctorData.name,
    email: doctorData.email,
    phone: doctorData.phone,
    currentCity: doctorData.verification?.currentCity || "",
    profilePhoto: doctorData.verification?.profilePhoto || null,
    specialization: doctorData.verification?.specialization || [],
    experienceYears: doctorData.verification?.experienceYears || 0,
    expertise: doctorData.verification?.expertise || []
  }

  // console.log("doctorProfile", doctorProfile)

  return doctorProfile
}


export async function updateDoctorProfile(formData: PersonalDetailsFormValues) {
  try {
    const session = await auth()
    if (!session?.user) throw new Error("Unauthorized")

    const validatedFields = personalDetailsSchema.parse(formData)

    // Update doctor's basic info
    await db.doctor.update({
      where: { id: session.user.id },
      data: {
        phone: validatedFields.phone,
        city: validatedFields.currentCity,
      },
    })

    // Update profile photo in verification table if provided
    if (validatedFields.profilePhoto) {
      await db.doctorVerification.update({
        where: { doctorId: session.user.id },
        data: {
          profilePhoto: validatedFields.profilePhoto,
          currentCity: validatedFields.currentCity,
          phoneNumber: validatedFields.phone  
          
        },
      })
    }

    revalidatePath("/doctor/dashboard")
    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update profile"
    }
  }
}