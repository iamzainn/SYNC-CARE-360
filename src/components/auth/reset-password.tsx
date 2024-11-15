// components/auth/reset-password-form.tsx
"use client"


import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/types/reset-password"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function ResetPasswordForm() {
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: ResetPasswordFormData) {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Reset token is missing",
      })
      return
    }

    setIsPending(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      toast({
        title: "Success!",
        description: "Your password has been reset successfully.",
      })

      router.push('/doctor/auth?tab=login')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="w-full max-w-[450px] p-6">
      <CardHeader className="space-y-1 flex flex-col items-center mb-4">
        <Image
          src="/logo.png"
          alt="Care Sync 360"
          width={50}
          height={50}
          className="mb-2"
        />
        <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
        <p className="text-sm text-muted-foreground text-center">
          Enter your new password below
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              Reset Password
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
