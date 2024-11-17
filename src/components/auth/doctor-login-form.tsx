"use client"
import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react" // Change this import
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export function DoctorLoginForm({callbackUrl}:{callbackUrl:string}) {
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true)
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        role: "DOCTOR",
        redirect: false,
      })
      
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error
        })
        return
      }

      // Update session
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
          href="/doctor/auth/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        Login
      </Button>
      <p className="text-sm text-center text-muted-foreground">
        Donot have an account?{" "}
        <Link href="/doctor/auth?tab=signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  </Form>
  )
}