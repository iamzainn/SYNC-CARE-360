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
import { useNurseVerificationStore } from "@/store/useNurseVerificationStore"
import { useToast } from "@/hooks/use-toast"
import { submitNurseVerification } from "@/lib/actions/nurse-verification"

export function ReviewStep() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  const store = useNurseVerificationStore()
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async () => {
    if (!session?.user || session.user.role !== "NURSE") {
      toast({
        title: "Authentication Required",
        description: "Please login to submit your verification request.",
        variant: "destructive",
      })
      router.push(`/nurse/auth/?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    setIsPending(true)
    try {
      const result = await submitNurseVerification({
        services: store.services,
      })

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
          Please review your selected services carefully before submitting
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Selected Services</CardTitle>
        </CardHeader>
        <CardContent>
          {store.services.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No services selected</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {store.services.map((service, index) => (
                <Badge key={index} variant="secondary">
                  {service}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => store.previousStep()}
        >
          Edit Services
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
            disabled={isPending || store.services.length === 0}
            className="min-w-[120px]"
          >
            {isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> By submitting this application, you confirm that you are qualified to provide 
          the selected services. False information may result in rejection or removal from the platform.
        </p>
      </div>
    </div>
  )
} 