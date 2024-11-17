"use client"

import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"

import { useToast } from "@/hooks/use-toast"

import { patientLoginSchema } from "@/lib/schemas/patient"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export function PatientLoginForm({callbackUrl}: {callbackUrl?: string}) {

  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  // const callbackUrl = searchParams.get('callbackUrl')

  const form = useForm<z.infer<typeof patientLoginSchema>>({
    resolver: zodResolver(patientLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof patientLoginSchema>) {
    setIsPending(true)
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        role: "PATIENT",
        redirect: false,
      })
      
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid email or password"
        })
        return
      }

      await update()
      toast({
        title: "Success!",
        description: "Logged in successfully.",
      })
      router.push(callbackUrl || '/')
      router.refresh()
      
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
        <div className="flex items-center justify-end">
          <Link 
            href="/patient/auth/forgot-password"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          Login
        </Button>
      </form>
    </Form>
  )
}