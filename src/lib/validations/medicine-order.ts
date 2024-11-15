// lib/validations/medicine-order.ts
import * as z from "zod"



export const medicineOrderSchema = z.object({
  medicines: z.string().optional(),
  prescriptionUrl: z.string().optional(), // Changed from File to string URL
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().regex(/^\d{11}$/, "Phone number must be 11 digits"),
  patientName: z.string().min(1, "Patient name is required"),
  pharmacyName: z.string().optional(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "CARD"]),
})

export type MedicineOrderForm = z.infer<typeof medicineOrderSchema>