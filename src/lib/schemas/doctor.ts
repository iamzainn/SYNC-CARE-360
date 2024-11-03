import { z } from "zod";

export const doctorSignUpSchema = z.object({
    title: z.string().min(1, "Title is required"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^\d{11}$/, "Invalid phone number format"),
    email: z.string().email("Invalid email format"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    city: z.string().min(1, "City is required"),
    specialization: z.string().min(1, "Specialization is required"),
    gender: z.enum(["MALE", "FEMALE"], {
      required_error: "Please select your gender",
    }),
  })