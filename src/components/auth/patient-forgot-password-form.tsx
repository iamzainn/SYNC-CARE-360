"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/types/reset-password"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function PatientForgotPasswordForm() {
    const [isPending, setIsPending] = useState(false)
    const { toast } = useToast()
    const router = useRouter()
  
    const form = useForm<ForgotPasswordFormData>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: {
        email: "",
      },
    })
  
    async function onSubmit(values: ForgotPasswordFormData) {
      setIsPending(true)
      try {
        const response = await fetch('/api/patient/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
  
        const data = await response.json()
  
        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong')
        }
  
        toast({
          title: "Success!",
          description: "If an account exists with this email, you will receive password reset instructions.",
        })
        
        form.reset()
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
        })
      } finally {
        setIsPending(false)
      }
    }
  
    return (
      <Card className="w-full max-w-[450px] p-6">
        <CardHeader className="space-y-1 flex flex-col items-center mb-4">
          <Image
            src="/logo.jpeg"
            alt="Care Sync 360"
            width={120}
            height={120}
            className="mb-2"
          />
          <h2 className="text-2xl font-semibold text-center">Forgot Password</h2>
          <p className="text-sm text-muted-foreground text-center">
            Enter your email address to reset your password
          </p>
        </CardHeader>
        <CardContent>
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
              <Button type="submit" className="w-full" disabled={isPending}>
                Send Reset Instructions
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto font-normal"
                  onClick={() => router.push('/patient/auth?tab=login')}
                >
                  Back to login
                </Button>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    )
  }