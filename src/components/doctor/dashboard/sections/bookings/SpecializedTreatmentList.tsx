// components/doctor/dashboard/sections/bookings/SpecializedTreatmentList.tsx
"use client"

import { useEffect, useState } from "react"
import { getSpecializedTreatments, updateTreatmentStatus } from "@/lib/actions/specialized-treatment"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { FileText, MessageSquare, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"

interface SpecializedTreatmentListProps {
  doctorId: string
  onSelectBooking: (booking: any) => void
}

export function SpecializedTreatmentList({ 
  doctorId, 
  onSelectBooking 
}: SpecializedTreatmentListProps) {
  const [treatments, setTreatments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null)
  const [statusAction, setStatusAction] = useState<'ACCEPTED' | 'REJECTED' | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTreatments()
  }, [doctorId])

  async function fetchTreatments() {
    try {
      const data = await getSpecializedTreatments(doctorId)
      setTreatments(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch treatment requests"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedTreatment || !statusAction) return

    try {
      await updateTreatmentStatus(selectedTreatment.id, statusAction)
      
      toast({
        title: "Status Updated",
        description: `Treatment request ${statusAction.toLowerCase()}`
      })
      
      await fetchTreatments()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status"
      })
    } finally {
      setSelectedTreatment(null)
      setStatusAction(null)
    }
  }

  if (isLoading) {
    return <div>Loading requests...</div>
  }

  if (treatments.length === 0) {
    return <div>No specialized treatment requests found.</div>
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-4">
        {treatments.map((treatment) => (
          <Card key={treatment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{treatment.patient.name}</CardTitle>
                  <CardDescription>
                    Requested: {format(new Date(treatment.createdAt), "PPp")}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    treatment.status === 'ACCEPTED' ? "default" :
                    treatment.status === 'REJECTED' ? "destructive" :
                    "secondary"
                  }
                >
                  {treatment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Contact:</p>
                    <p>{treatment.patient.phone}</p>
                    <p>{treatment.patient.email}</p>
                  </div>
                  <div>
                    {treatment.treatmentDetails && (
                      <>
                        <p className="text-muted-foreground">Treatment Details:</p>
                        <p className="line-clamp-2">{treatment.treatmentDetails}</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    {treatment.prescriptionUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(treatment.prescriptionUrl, '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Prescription
                      </Button>
                    )}
                    {treatment.status === 'ACCEPTED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectBooking(treatment)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    )}
                  </div>

                  {treatment.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setSelectedTreatment(treatment)
                          setStatusAction('ACCEPTED')
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedTreatment(treatment)
                          setStatusAction('REJECTED')
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog 
        open={!!selectedTreatment && !!statusAction}
        onOpenChange={() => {
          setSelectedTreatment(null)
          setStatusAction(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {statusAction?.toLowerCase()} this treatment request?
              {statusAction === 'ACCEPTED' && " You'll be able to chat with the patient after accepting."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusUpdate}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollArea>
  )
}