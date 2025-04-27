"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { nurseNewPasswordSchema } from "@/lib/schemas/nurse"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetComplete, setResetComplete] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get("token")

  const form = useForm<z.infer<typeof nurseNewPasswordSchema>>({
    resolver: zodResolver(nurseNewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof nurseNewPasswordSchema>) {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid reset token. Please try again."
      })
      return
    }

    setIsPending(true)
    try {
      // For now, just simulate a successful request
      // In the future, implement the actual reset functionality with token validation
      setTimeout(() => {
        setResetComplete(true)
        toast({
          title: "Password reset successful",
          description: "Your password has been updated."
        })
      }, 1000)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong! Please try again."
      })
    } finally {
      setIsPending(false)
    }
  }

  if (!token) {
    return (
      <div className="container mx-auto h-screen flex flex-col items-center justify-center max-w-md space-y-6 px-4">
        <div className="bg-muted p-6 rounded-lg text-center space-y-4 w-full">
          <h2 className="font-medium">Invalid Reset Link</h2>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has expired. Please request a new password reset link.
          </p>
          <Button asChild className="w-full mt-4">
            <Link href="/nurse/auth/forgot-password">
              Request New Reset Link
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto h-screen flex flex-col items-center justify-center max-w-md space-y-6 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create New Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter a new password for your account
        </p>
      </div>

      {resetComplete ? (
        <div className="bg-muted p-6 rounded-lg text-center space-y-4 w-full">
          <h2 className="font-medium">Password Reset Complete!</h2>
          <p className="text-sm text-muted-foreground">
            Your password has been successfully updated. You can now login with your new password.
          </p>
          <Button asChild className="w-full mt-4">
            <Link href="/nurse/auth">
              Go to Login
            </Link>
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={showPassword ? "text" : "password"} 
                        disabled={isPending} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        {...field} 
                        type={showConfirmPassword ? "text" : "password"} 
                        disabled={isPending} 
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Updating..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
} 