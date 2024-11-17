"use client"

import * as z from "zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { doctorSignUp } from "@/lib/actions/doctor"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { doctorSignUpSchema } from "@/lib/schemas/doctor"
import { Eye, EyeOff } from "lucide-react"



const titles = ["Mr.", "Ms.", "Dr.", "Prof."]
const specializations = [
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedic",
  "Psychiatrist",
  "Gynecologist",
  "Urologist",
  "ENT Specialist",
  "Dentist"
]

const cities = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Peshawar",
  "Quetta",
  "Multan",
  "Faisalabad",
  "Hyderabad",
  "Sialkot"
]

export function DoctorSignUpForm({callbackUrl}: {callbackUrl?: string}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<z.infer<typeof doctorSignUpSchema>>({
    resolver: zodResolver(doctorSignUpSchema),
    defaultValues: {
      title: "",
      name: "",
      phone: "",
      email: "",
      password: "",
      city: "",
      specialization: "",
      gender: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof doctorSignUpSchema>) {
    setIsPending(true)
    try {
      const result = await doctorSignUp(values)
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error
        })
        return
      }

      toast({
        title: "Success!",
        description: "Registration successful! Please login to continue.",
      })

      // Reset form
      form.reset()
      
      // Optionally redirect to login tab
      const params = new URLSearchParams(searchParams.toString())
      params.set('tab', 'login')
      router.push(`/doctor/auth?${params.toString()}`)
      
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select title" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {titles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Dr. John Doe" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="03001234567" disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="doctor@example.com" disabled={isLoading} />
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
                    disabled={isLoading} 
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
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MALE" id="male" />
                    <label htmlFor="male">Male</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="FEMALE" id="female" />
                    <label htmlFor="female">Female</label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-xs text-gray-500 mt-4">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of use
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </div>

        <Button type="submit" className="w-full mt-6" disabled={isPending || isLoading}>
          Sign Up
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/doctor/auth?tab=login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  )
}