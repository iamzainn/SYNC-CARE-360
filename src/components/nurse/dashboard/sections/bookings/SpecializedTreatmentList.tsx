"use client"

import { useEffect, useState } from "react"
import { getSpecializedTreatmentsForNurse, updateTreatmentStatus } from "@/lib/actions/specialized-treatment"
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
import { CheckCircle, XCircle, CalendarIcon, MapPinIcon, PhoneIcon } from "lucide-react"
import { format } from "date-fns"

interface SpecializedTreatmentListProps {
  nurseId: string
}

export function SpecializedTreatmentList({ 
  nurseId
}: SpecializedTreatmentListProps) {
  const [treatments, setTreatments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null)
  const [statusAction, setStatusAction] = useState<'ACCEPTED' | 'REJECTED' | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTreatments()
  }, [nurseId])

  async function fetchTreatments() {
    try {
      const data = await getSpecializedTreatmentsForNurse(nurseId)
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
        description: `Treatment ${statusAction.toLowerCase()}`
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
    return <div>Loading treatments...</div>
  }

  if (treatments.length === 0) {
    return <div>No specialized treatments found.</div>
  }

  return (
    <>
    <div className="mb-4">
      <h2 className="text-xl font-bold">Treatment Requests</h2>
      <p className="text-muted-foreground">Review and manage incoming treatment requests</p>
    </div>
    
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
                {/* Patient Contact Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Contact:</p>
                    <p className="flex items-center gap-1">
                      <PhoneIcon className="h-3 w-3" />
                      {treatment.patient.phone}
                    </p>
                    <p>{treatment.patient.email}</p>
                  </div>
                  <div>
                    {treatment.scheduledDate && (
                      <>
                        <p className="text-muted-foreground">Appointment:</p>
                        <p className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {format(new Date(treatment.scheduledDate), "PPp")}
                        </p>
                      </>
                    )}
                    <p className="text-muted-foreground mt-2">Payment:</p>
                    <p>Cash on Treatment</p>
                  </div>
                </div>

                {/* Patient Details */}
                {treatment.patientDetails && (
                  <div className="border-t pt-3 space-y-3">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground font-medium">Address:</p>
                        <p className="flex items-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          {treatment.patientDetails.address}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground font-medium">Issue Details:</p>
                        <p>{treatment.patientDetails.issueDetails}</p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground font-medium">Medical Condition:</p>
                        <p>{treatment.patientDetails.medicalCondition}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Treatment Amount */}
                <div className="border-t pt-3 flex justify-between items-center text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium">Treatment Amount:</p>
                    <p>Rs. {treatment.totalAmount}</p>
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
    </>
  )
} 