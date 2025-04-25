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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ClipboardList, MessageSquare, CheckCircle, XCircle, CalendarIcon } from "lucide-react"
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
  const [showMedicalRecord, setShowMedicalRecord] = useState(false)
  const [selectedMedicalRecord, setSelectedMedicalRecord] = useState<any>(null)
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

  const handleViewMedicalRecord = (treatment: any) => {
    if (treatment.patientMedicalRecord) {
      setSelectedMedicalRecord(treatment.patientMedicalRecord)
      setShowMedicalRecord(true)
    } else {
      toast({
        variant: "destructive",
        title: "No medical record",
        description: "This treatment request doesn't have an associated medical record"
      })
    }
  }

  if (isLoading) {
    return <div>Loading requests...</div>
  }

  if (treatments.length === 0) {
    return <div>No specialized treatment requests found.</div>
  }

  return (
    <>
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
                    {treatment.scheduledDate && (
                      <>
                        <p className="text-muted-foreground">Appointment:</p>
                        <p className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {format(new Date(treatment.scheduledDate), "PPp")}
                        </p>
                      </>
                    )}
                    <p className="text-muted-foreground mt-2">Payment Status:</p>
                    <Badge variant={treatment.paymentStatus === 'COMPLETED' ? "default" : "outline"}>
                      {treatment.paymentStatus}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMedicalRecord(treatment)}
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      Medical Record
                    </Button>
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

    {/* Medical Record Detail Dialog */}
    <Dialog open={showMedicalRecord} onOpenChange={setShowMedicalRecord}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Medical Record</DialogTitle>
          <DialogDescription>
            Medical information shared by the patient
          </DialogDescription>
        </DialogHeader>

        {selectedMedicalRecord && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-base">Personal Information</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedMedicalRecord.firstName} {selectedMedicalRecord.lastName}</p>
                  <p><span className="font-medium">Date of Birth:</span> {format(new Date(selectedMedicalRecord.dateOfBirth), "PPP")}</p>
                  <p><span className="font-medium">Gender:</span> {selectedMedicalRecord.gender}</p>
                  <p><span className="font-medium">Contact:</span> {selectedMedicalRecord.phoneNumber}</p>
                  <p><span className="font-medium">Email:</span> {selectedMedicalRecord.email}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-base">Emergency Contact</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {selectedMedicalRecord.emergencyContactName}</p>
                  <p><span className="font-medium">Phone:</span> {selectedMedicalRecord.emergencyContactPhone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-base">Health Metrics</h3>
                <div className="mt-2 space-y-2 text-sm">
                  {selectedMedicalRecord.height && (
                    <p><span className="font-medium">Height:</span> {selectedMedicalRecord.height} ft</p>
                  )}
                  {selectedMedicalRecord.weight && (
                    <p><span className="font-medium">Weight:</span> {selectedMedicalRecord.weight} kg</p>
                  )}
                  {selectedMedicalRecord.bloodType && (
                    <p><span className="font-medium">Blood Type:</span> {selectedMedicalRecord.bloodType.replace('_', ' ').replace('POSITIVE', '+').replace('NEGATIVE', '-')}</p>
                  )}
                  {selectedMedicalRecord.bloodPressure && (
                    <p><span className="font-medium">Blood Pressure:</span> {selectedMedicalRecord.bloodPressure.systolic}/{selectedMedicalRecord.bloodPressure.diastolic} mmHg</p>
                  )}
                  {selectedMedicalRecord.heartRate && (
                    <p><span className="font-medium">Heart Rate:</span> {selectedMedicalRecord.heartRate} bpm</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-base">Medical Conditions</h3>
                <div className="mt-2">
                  {selectedMedicalRecord.medicalConditions && selectedMedicalRecord.medicalConditions.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {selectedMedicalRecord.medicalConditions.map((condition: string, index: number) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No medical conditions reported</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-base">Allergies</h3>
                <div className="mt-2">
                  {selectedMedicalRecord.allergies && selectedMedicalRecord.allergies.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {selectedMedicalRecord.allergies.map((allergy: string, index: number) => (
                        <li key={index}>{allergy}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No allergies reported</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-base">Current Medications</h3>
                <div className="mt-2">
                  {selectedMedicalRecord.currentMedications && selectedMedicalRecord.currentMedications.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {selectedMedicalRecord.currentMedications.map((medication: string, index: number) => (
                        <li key={index}>{medication}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No current medications reported</p>
                  )}
                </div>
              </div>

              {selectedMedicalRecord.medicalReportUrl && (
                <div>
                  <h3 className="font-medium text-base">Medical Report</h3>
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(selectedMedicalRecord.medicalReportUrl, '_blank')}
                    >
                      View Medical Report
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}