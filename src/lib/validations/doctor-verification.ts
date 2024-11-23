import * as z from 'zod'

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]

export const basicInformationSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string()
    .regex(/^03\d{9}$/, "Phone number must start with '03' and be 11 digits long"),
  cnic: z.string()
    .regex(/^\d{5}-\d{7}-\d{1}$/, "CNIC must be in format: XXXXX-XXXXXXX-X"),
  
})

export const professionalInformationSchema = z.object({
  pmcNumber: z.string()
    .min(5, "PMC number is required")
    .regex(/^[A-Z0-9-]+$/i, "Invalid PMC number format"),
  graduationYear: z.number()
    .min(1950, "Invalid graduation year")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  medicalSchool: z.string().min(3, "Medical school name is required"),
  specialization: z.array(z.string())
    .min(1, "At least one specialization is required"),
  expertise: z.array(z.string())
    .min(1, "At least one area of expertise is required"),
  experienceYears: z.number()
    .min(0, "Experience years cannot be negative")
    .max(60, "Please enter a valid experience duration")
})

export const documentUploadSchema = z.object({
  profilePhoto: z.string().min(1, "Profile photo is required"),
  degreeImage: z.string().min(1, "Degree image is required"),
  pmcImage: z.string().min(1, "PMC certificate image is required"),
  cnicImage: z.string().min(1, "CNIC image is required")
})

// File validation helper
export const validateFile = (file: File) => {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "File must be .jpg, .jpeg, .png, or .pdf"
  }
  if (file.size > 5 * 1024 * 1024) { // 5MB
    return "File size must be less than 5MB"
  }
  return null
}