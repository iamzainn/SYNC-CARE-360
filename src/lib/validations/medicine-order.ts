import { z } from "zod"

export const medicineSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
})

// Pharmacy type for dropdown
export const pharmacySchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  metadata: z.object({
    description: z.string(),
    location: z.string(),
    services: z.array(z.string()),
  }).optional(),
})



export const medicineOrderSchema = z.object({
  medicines: z.array(z.string()).default([]),
  prescriptionUrl: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"),
  patientName: z.string().min(1, "Patient name is required"),
  pharmacyName: z.string().optional(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "CARD"]),
  totalAmount: z.number().optional(),
})

export type MedicineOrderForm = z.infer<typeof medicineOrderSchema>