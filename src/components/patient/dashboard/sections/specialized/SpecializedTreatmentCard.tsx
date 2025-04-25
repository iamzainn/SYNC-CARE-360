"use client"

import { format } from "date-fns"
import { CalendarIcon, Clock, CreditCard, User, BadgeInfo } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SpecializedTreatmentStatus, PaymentStatus } from "@prisma/client"

interface SpecializedTreatmentCardProps {
  treatment: {
    id: string
    status: SpecializedTreatmentStatus
    createdAt: string | Date
    scheduledDate?: string | Date | null
    paymentStatus: PaymentStatus
    amount?: number
    serviceCharge?: number
    totalAmount?: number
    doctor: {
      id: string
      name: string
      specialization: string
      email: string
      phone: string
    }
    slot?: {
      startTime: string
      endTime: string
    }
  }
  onStatusUpdate: (treatment: any) => void
}

export function SpecializedTreatmentCard({ 
  treatment,
  onStatusUpdate 
}: SpecializedTreatmentCardProps) {
  const statusColor: Record<SpecializedTreatmentStatus, string> = {
    PENDING: "bg-yellow-50 border-yellow-200 text-yellow-800",
    ACCEPTED: "bg-green-50 border-green-200 text-green-800",
    REJECTED: "bg-red-50 border-red-200 text-red-800",
    COMPLETED: "bg-blue-50 border-blue-200 text-blue-800"
  }

  const statusText: Record<SpecializedTreatmentStatus, string> = {
    PENDING: "Pending approval",
    ACCEPTED: "Accepted by doctor",
    REJECTED: "Rejected by doctor",
    COMPLETED: "Treatment completed"
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Specialized Treatment Request</CardTitle>
            <CardDescription>
              Requested on {format(new Date(treatment.createdAt), "PPP")}
            </CardDescription>
          </div>
          <Badge className={statusColor[treatment.status] || "bg-gray-50 border-gray-200"}>
            {statusText[treatment.status] || treatment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Info */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <User className="h-4 w-4" /> Doctor Information
            </h4>
            <div className="rounded-md border bg-slate-50 p-3">
              <p className="font-medium">{treatment.doctor.name}</p>
              <p className="text-muted-foreground text-sm">{treatment.doctor.specialization}</p>
              <div className="mt-2 text-sm">
                <p>Email: {treatment.doctor.email}</p>
                <p>Phone: {treatment.doctor.phone}</p>
              </div>
            </div>
          </div>

          {/* Appointment Info */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <BadgeInfo className="h-4 w-4" /> Appointment Details
            </h4>
            <div className="rounded-md border p-3">
              <div className="space-y-2">
                {treatment.scheduledDate ? (
                  <p className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4" />
                    {format(new Date(treatment.scheduledDate), "PPP")}
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm">No appointment scheduled yet</p>
                )}
                
                {treatment.slot && (
                  <p className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    {treatment.slot.startTime} - {treatment.slot.endTime}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Payment Info */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Payment Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground">Treatment Fee</p>
              <p className="font-medium">Rs. {treatment.amount || 0}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground">Service Charge</p>
              <p className="font-medium">Rs. {treatment.serviceCharge || 0}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground">Total Amount</p>
              <p className="font-medium">Rs. {treatment.totalAmount || 0}</p>
            </div>
          </div>

          <div className="flex justify-between mt-4 items-center">
            <Badge variant={treatment.paymentStatus === "COMPLETED" ? "default" : "outline"}>
              Payment: {treatment.paymentStatus}
            </Badge>
            
            <div>
              {(treatment.status === "REJECTED" && treatment.paymentStatus === "COMPLETED") && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    window.location.href = "/Services/specialized-treatment";
                  }}
                >
                  Request New Treatment
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 