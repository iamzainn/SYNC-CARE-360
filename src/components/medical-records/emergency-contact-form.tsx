// components/medical-records/emergency-contact-form.tsx
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
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { emergencyContactSchema } from "@/lib/validations/medical-record"
import { useMedicalRecordStore } from "@/store/useMedicalRecordStore"
import { z } from "zod"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { ReviewStep } from "../data-management/review-step"
import { createMedicalRecord } from "@/lib/actions/medical-record"

type EmergencyContactValues = z.infer<typeof emergencyContactSchema>

export function EmergencyContactForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const store = useMedicalRecordStore()
  const [isPending, setIsPending] = useState(false)
  const [showReview, setShowReview] = useState(false)


  const form = useForm({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      emergencyContactName: store.emergencyContactName || "",
      emergencyContactPhone: store.emergencyContactPhone || "",
      consentToStore: store.consentToStore || false,
    },
  })
  const handleReview = async (data: EmergencyContactValues) => {
    // Save emergency contact data first
    Object.entries(data).forEach(([key, value]) => {
      store.updateField(key as keyof typeof data, value)
    })
    setShowReview(true)
  }

  const handleSubmit = async () => {
    if (!session?.user || session.user.role !== "PATIENT") {
      toast({
        title: "Authentication Required",
        description: "Please login as a patient to submit your medical records.",
        variant: "destructive",
      })
      router.push(`/patient/auth/?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    setIsPending(true)
    try {
      // Prepare complete form data from store
      const formData = {
        firstName: store.firstName,
        lastName: store.lastName,
        dateOfBirth: store.dateOfBirth as Date,
        gender: store.gender as "MALE" | "FEMALE",
        email: store.email,
        phoneNumber: store.phoneNumber,
        medicalConditions: store.medicalConditions,
        allergies: store.allergies,
        currentMedications: store.currentMedications,
        height: store.height,
        weight: store.weight,
        bloodType: store.bloodType,
        bloodPressure: store.bloodPressure,
        heartRate: store.heartRate,
        medicalReportUrl: store.medicalReportUrl,
        emergencyContactName: store.emergencyContactName,
        emergencyContactPhone: store.emergencyContactPhone,
        consentToStore: store.consentToStore,
      }

      const result = await createMedicalRecord(formData)

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Success!",
        description: "Your medical records have been saved successfully.",
      })

      // Reset form and store
      store.resetForm()
      router.push('/')
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save medical records",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  if (showReview) {
    return (
      <div className="space-y-6">
        <ReviewStep 
          onEdit={() => setShowReview(false)}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleReview)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emergency Contact Name */}
          <FormField
            control={form.control}
            name="emergencyContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter contact name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Emergency Contact Phone */}
          <FormField
            control={form.control}
            name="emergencyContactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="03XXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Consent Checkbox */}
        <FormField
          control={form.control}
          name="consentToStore"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <div className="flex items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Consent to Store Data</FormLabel>
                  <FormDescription>
                    Care Sync 360 collects emergency contact information to ensure that, in case 
                    of a medical emergency, we can quickly reach someone who can assist and make 
                    decisions on your behalf if needed. Your safety and well-being are our top priority.
                  </FormDescription>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => store.previousStep()}
          >
            Previous
          </Button>
          <Button type="submit" disabled={isPending}>
            Review Information
          </Button>
        </div>
      </form>
    </Form>
  )
}