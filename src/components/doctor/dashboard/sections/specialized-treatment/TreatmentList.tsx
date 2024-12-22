// components/doctor/dashboard/sections/specialized-treatment/TreatmentList.tsx
"use client"

import { useEffect, useState } from "react"
import { getSpecializedTreatments, updateTreatmentStatus } from "@/lib/actions/specialized-treatment"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, FileText, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface TreatmentListProps {
  doctorId: string
  onSelectTreatment: (treatment: any) => void
}

export function TreatmentList({ doctorId, onSelectTreatment }: TreatmentListProps) {
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
      
      fetchTreatments()
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
    return <TreatmentListSkeleton />
  }

  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <div className="space-y-4">
        {treatments.map((treatment) => (
          <Card key={treatment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{treatment.patient.name}</CardTitle>
                  <CardDescription>
                    Requested on: {format(new Date(treatment.createdAt), "PPp")}
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
                        onClick={() => onSelectTreatment(treatment)}
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

function TreatmentListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <Skeleton className="h-9 w-28" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}