"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, Clock, MapPin } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { addEmergencyContact } from "@/lib/actions/emergency"

interface EmergencyDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function EmergencyDialog({ isOpen, onClose }: EmergencyDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const emergencyInfo = {
    phone: "+92-300-1234567",
    email: "emergency@caresync.io",
    hours: "24/7 Emergency Support",
    location: "CareSync Emergency Center, Johar Town, Lahore",
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await addEmergencyContact(phoneNumber)

      if (result.requiresAuth) {
        // Redirect to login with callback
        const currentPath = window.location.pathname
        router.push(`/patient/auth?callbackUrl=${encodeURIComponent(currentPath)}`)
        return
      }

      if (result.success) {
        toast({
          title: "Emergency Contact Added",
          description: "Your emergency contact has been saved successfully.",
        })
        setPhoneNumber("")
        onClose()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save emergency contact. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Emergency Services</DialogTitle>
          <DialogDescription>
            Quick access to emergency services and contact management
          </DialogDescription>
        </DialogHeader>

        {/* Emergency Service Info */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-base">Emergency Contact Information</h4>
          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-blue-600" />
              <span>{emergencyInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-blue-600" />
              <span>{emergencyInfo.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>{emergencyInfo.hours}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span>{emergencyInfo.location}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Emergency Contact Form */}
        <div className="space-y-4">
          <h4 className="font-medium text-base">Add Emergency Contact Number</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter emergency contact number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                pattern="^(\+92|0)?3[0-9]{2}[0-9]{7}$"
                title="Please enter a valid Pakistani phone number"
                required
              />
              <p className="text-xs text-muted-foreground">
                Format: 03XXXXXXXXX or +92XXXXXXXXXX
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Emergency Contact"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}