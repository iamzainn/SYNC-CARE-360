// components/doctor-verification/ReviewStep.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDoctorVerificationStore } from "@/store/useDoctorVerificationStore"
import { useToast } from "@/hooks/use-toast"
import { submitDoctorVerification } from "@/lib/actions/doctor-verification"

interface ReviewSectionProps {
  title: string
  data: Record<string, any>
}

const ReviewSection = ({ title, data }: ReviewSectionProps) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="grid gap-4">
      {Object.entries(data).map(([key, value]) => {
        // Skip null or empty values
        if (value === null || value === "" || value === undefined) return null;
        
        // Format key from camelCase to Title Case
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());

        return (
          <div key={key} className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">
              {formattedKey}
            </span>
            {Array.isArray(value) ? (
              <div className="flex flex-wrap gap-2">
                {value.map((item, index) => (
                  <Badge key={index} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            ) : key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') ? (
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Document Uploaded</Badge>
                <a
                  href={value as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View
                </a>
              </div>
            ) : (
              <span className="text-sm">{value}</span>
            )}
          </div>
        );
      })}
    </CardContent>
  </Card>
);

export function ReviewStep() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const store = useDoctorVerificationStore()
  const [isPending, setIsPending] = useState(false)

  const basicInfo = {
    fullName: store.fullName,
    email: store.email,
    phoneNumber: store.phoneNumber,
    cnic: store.cnic,
    
  }

  const professionalInfo = {
    pmcNumber: store.pmcNumber,
    graduationYear: store.graduationYear,
    medicalSchool: store.medicalSchool,
    specialization: store.specialization,
    expertise: store.expertise,
    experienceYears: store.experienceYears,
  }

  const documents = {
    profilePhoto: store.profilePhoto as string,
    degreeImage: store.degreeImage as string,
    pmcImage: store.pmcImage  as string,
    cnicImage: store.cnicImage as string,
  }

  const handleSubmit = async () => {
    if (!session?.user || session.user.role !== "DOCTOR") {
      toast({
        title: "Authentication Required",
        description: "Please login to submit your verification request.",
        variant: "destructive",
      })
      router.push(`/doctor/auth/?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    setIsPending(true)
    try {
      // Prepare complete form data from store
      const formData = {
        ...basicInfo,
        ...professionalInfo,
        ...documents,
      }

      const result = await submitDoctorVerification(formData)

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: "Verification Request Submitted",
        description: "We'll review your application and get back to you soon.",
      })

      // Reset form and store
      store.resetForm()
      router.push('/verification-pending') 
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit verification request",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Review Your Information</h2>
        <p className="text-muted-foreground">
          Please review your information carefully before submitting
        </p>
      </div>

      <ReviewSection title="Basic Information" data={basicInfo} />
      <ReviewSection title="Professional Information" data={professionalInfo} />
      <ReviewSection title="Uploaded Documents" data={documents} />

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => store.previousStep()}
        >
          Edit Information
        </Button>
        <div className="space-x-4">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              if (confirm("Are you sure you want to cancel? All progress will be lost.")) {
                store.resetForm()
                router.push('/')
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="min-w-[120px]"
          >
            {isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> By submitting this application, you confirm that all 
          provided information is accurate and true. False information may result in 
          rejection or removal from the platform.
        </p>
      </div>
    </div>
  )
}


