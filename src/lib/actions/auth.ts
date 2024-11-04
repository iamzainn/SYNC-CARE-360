"use server"

import { AuthError } from "next-auth"

import { signIn,signOut } from "@/auth"


export async function doctorLogin(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }
        default:
          return { error: "Something went wrong" }
      }
    }
    throw error
  }
}
//logout function
export async function LogoutAction() {
  await signOut()
}