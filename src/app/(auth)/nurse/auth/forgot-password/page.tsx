"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Button } from "../../../../../components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../components/ui/form"
import { Input } from "../../../../../components/ui/input"
import { useToast } from "../../../../../hooks/use-toast"
import { nurseResetSchema } from "../../../../../lib/schemas/nurse"

export default function ForgotPasswordPage() {
  const [isPending, setIsPending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof nurseResetSchema>>({
    resolver: zodResolver(nurseResetSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof nurseResetSchema>) {
    setIsPending(true)
    try {
      // For now, just simulate a successful request
      // In the future, implement the actual reset functionality
      setTimeout(() => {
        setEmailSent(true)
        toast({
          title: "Reset email sent",
          description: "Check your inbox for the password reset link",
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

  return (
    <div className="container mx-auto h-screen flex flex-col items-center justify-center max-w-md space-y-6 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we will send you a link to reset your password
        </p>
      </div>

      {emailSent ? (
        <div className="bg-muted p-6 rounded-lg text-center space-y-4 w-full">
          <h2 className="font-medium">Email Sent!</h2>
          <p className="text-sm text-muted-foreground">
            We have sent a password reset link to your email address. Please check your inbox.
          </p>
          <Button asChild className="w-full mt-4">
            <Link href="/nurse/auth">
              Return to login
            </Link>
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="your@email.com" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </Form>
      )}

      <div className="text-center">
        <Link href="/nurse/auth" className="text-sm text-primary hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  )
} 