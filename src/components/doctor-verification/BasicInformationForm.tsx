// components/doctor-verification/BasicInformationForm.tsx
"use client"

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

import { basicInformationSchema } from "@/lib/validations/doctor-verification"
import { useDoctorVerificationStore } from "@/store/useDoctorVerificationStore"
import { z } from "zod"

type BasicInformationValues = z.infer<typeof basicInformationSchema>




export function BasicInformationForm() {
  const store = useDoctorVerificationStore()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<BasicInformationValues>({
    resolver: zodResolver(basicInformationSchema),
    defaultValues: {
      fullName: store.fullName,
      email: store.email,
      phoneNumber: store.phoneNumber,
      cnic: store.cnic,
     
    },
  })

  async function onSubmit(data: BasicInformationValues) {
    setIsPending(true)
    try {
      Object.entries(data).forEach(([key, value]) => {
        store.updateField(key as keyof typeof data, value)
      })
      store.nextStep()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Dr. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="doctor@example.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="03XXXXXXXXX"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* CNIC */}
        <FormField
          control={form.control}
          name="cnic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNIC Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="XXXXX-XXXXXXX-X"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        
        
        

        <Button
          type="submit"
          className="w-full md:w-auto"
          disabled={isPending}
        >
          Next Step
        </Button>
      </form>
    </Form>
  )
}


