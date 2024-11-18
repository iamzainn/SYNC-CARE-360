import * as z from "zod"

export const personalDetailsSchema = z.object({
  phone: z.string()
    .regex(/^03\d{9}$/, "Phone number must start with '03' and be 11 digits"),
  currentCity: z.string().min(2, "City name must be at least 2 characters"),
  profilePhoto: z.string().optional().nullable()
})

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>