import * as z from "zod"

export const nurseSignUpSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  phone: z.string().min(11, {
    message: "Phone number must be at least 11 digits."
  }),
  email: z.string().email({
    message: "Please enter a valid email address."
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  }),
  city: z.string().min(1, {
    message: "Please select your city."
  }),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Please select your gender."
  })
})

export const nurseLoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email."
  }),
  password: z.string().min(1, {
    message: "Please enter your password."
  })
})

export const nurseResetSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email."
  })
})

export const nurseNewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters."
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters."
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"] 
}) 