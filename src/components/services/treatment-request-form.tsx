
// components/services/treatment-request-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadDropzone } from "@/utils/uploadthing"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { createTreatmentRequest } from "@/lib/actions/treatment"
import { DoctorList } from "./doctor-list"


interface Doctor {
  id: string
  name: string
  title: string
  specialization: string
  experience: number
  city: string
}

export function TreatmentRequestForm() {
  const [step, setStep] = useState(1)
  const [prescriptionUrl, setPrescriptionUrl] = useState("")
  const [treatmentDetails, setTreatmentDetails] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmitRequest = async () => {
    try {
      setIsLoading(true)
      
      if (!prescriptionUrl && !treatmentDetails) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please either upload a prescription or describe your treatment needs"
        })
        return
      }

      if (!selectedDoctor) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select a doctor"
        })
        return
      }

      const result = await createTreatmentRequest({
        doctorId: selectedDoctor,
        prescriptionUrl,
        treatmentDetails
      })

      if (result.requiresAuth) {
        const returnUrl = encodeURIComponent(window.location.pathname)
        router.push(`/patient/auth?callbackUrl=${returnUrl}`)
        return
      }

      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "Request Submitted",
        description: "Your treatment request has been sent to the doctor"
      })

      // Reset form
      setPrescriptionUrl("")
      setTreatmentDetails("")
      setSelectedDoctor("")
      setStep(1)

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit request. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="p-6">
        <div className="space-y-8">
          {/* Step 1: Treatment Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Step 1: Treatment Details</h3>
              <Tabs defaultValue="upload">
                <TabsList>
                  <TabsTrigger value="upload">Upload Prescription</TabsTrigger>
                  <TabsTrigger value="describe">Describe Treatment</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <div className="mt-4">
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]) {
                          setPrescriptionUrl(res[0].url)
                          toast({
                            title: "Prescription Uploaded",
                            description: "Your prescription has been uploaded successfully"
                          })
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast({
                          variant: "destructive",
                          title: "Error",
                          description: error.message || "Failed to upload prescription"
                        })
                      }}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="describe">
                  <div className="mt-4 space-y-2">
                    <Textarea
                      placeholder="Please describe the treatment you need..."
                      value={treatmentDetails}
                      onChange={(e) => setTreatmentDetails(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              <Button
                onClick={() => setStep(2)}
                disabled={!prescriptionUrl && !treatmentDetails}
              >
                Next: Select Doctor
              </Button>
            </div>
          )}

          {/* Step 2: Doctor Selection */}
          {/* Step 2: Doctor Selection */}
{step === 2 && (
  <div className="space-y-6">
    <h3 className="text-lg font-medium">Step 2: Select Doctor</h3>
    <ScrollArea className="h-[400px] rounded-md border p-4">
      <div className="space-y-4">
        <DoctorList
          selectedDoctor={selectedDoctor}
          onSelect={setSelectedDoctor}
        />
      </div>
    </ScrollArea>
    <div className="flex justify-between">
      <Button
        variant="outline"
        onClick={() => setStep(1)}
      >
        Back
      </Button>
      <Button
        onClick={handleSubmitRequest}
        disabled={!selectedDoctor || isLoading}
      >
        {isLoading ? "Submitting..." : "Submit Request"}
      </Button>
    </div>
  </div>
)}
        </div>
      </Card>
    </section>
  )
}

// Doctor list component

