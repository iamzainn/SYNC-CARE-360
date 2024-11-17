import * as z from "zod"

export const requiredInformationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.date({
    required_error: "Date of birth is required",
  }),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Please select your gender",
  }),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"),
})

export const medicalInformationSchema = z.object({
  medicalConditions: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
})

export const healthMetricsSchema = z.object({
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  bloodType: z.enum([
    "A_POSITIVE", "A_NEGATIVE",
    "B_POSITIVE", "B_NEGATIVE",
    "O_POSITIVE", "O_NEGATIVE",
    "AB_POSITIVE", "AB_NEGATIVE"
  ]).optional(),
  bloodPressure: z.object({
    systolic: z.number().min(70).max(190).optional(),
    diastolic: z.number().min(40).max(100).optional(),
  }).optional(),
  heartRate: z.number().min(40).max(200).optional(),
})

export const uploadDataSchema = z.object({
  medicalReportUrl: z.string().optional(),
})

export const emergencyContactSchema = z.object({
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"),
  consentToStore: z.boolean().refine((val) => val === true, {
    message: "You must consent to store data",
  }),
})