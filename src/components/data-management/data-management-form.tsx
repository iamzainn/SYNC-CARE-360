"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMedicalRecordStore } from "@/store/useMedicalRecordStore"
import { cn } from "@/lib/utils"
import { RequiredInformationForm } from "../medical-records/required-information-form"
import { MedicalInformationForm } from "../medical-records/medical-information-form"
import { HealthMetricsForm } from "../medical-records/health-metrics-form"
import { UploadDataForm } from "../medical-records/upload-data-form"
import { EmergencyContactForm } from "../medical-records/emergency-contact-form"
import { useAuthPatient } from "@/hooks/use-auth-patient"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { deleteMedicalRecord } from "@/lib/actions/medical-record"

const steps = [
  {
    id: 1,
    title: "Required Information",
    description: "Personal details and contact information",
  },
  {
    id: 2,
    title: "Medical Information",
    description: "Current conditions and medications",
  },
  {
    id: 3,
    title: "Health Metrics",
    description: "Physical measurements and vital signs",
  },
  {
    id: 4,
    title: "Upload Data",
    description: "Medical reports and documents",
  },
  {
    id: 5,
    title: "Emergency Contact",
    description: "Emergency contact information",
  },
]

export function DataManagementForm() {
  const { currentStep, updateField, resetForm } = useMedicalRecordStore()
  const { user } = useAuthPatient()
  const [existingRecords, setExistingRecords] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchMedicalRecords() {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/patient/medical-records?patientId=${user.id}`)
        const data = await response.json()
        
        if (data.success && data.records?.length > 0) {
          setExistingRecords(data.records)
        }
      } catch (error) {
        console.error("Error fetching medical records:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedicalRecords()
  }, [user])

  // Function to load the selected record data into the Zustand store
  const handleEditRecord = (record: any) => {
    // First reset the form to clear any existing data
    resetForm()
    
    // Store the record ID for editing
    setEditingRecordId(record.id)
    
    // Then update with the record data
    updateField('firstName', record.firstName)
    updateField('lastName', record.lastName)
    updateField('dateOfBirth', record.dateOfBirth ? new Date(record.dateOfBirth) : null)
    updateField('gender', record.gender)
    updateField('email', record.email)
    updateField('phoneNumber', record.phoneNumber)
    updateField('medicalConditions', record.medicalConditions || [])
    updateField('allergies', record.allergies || [])
    updateField('currentMedications', record.currentMedications || [])
    updateField('height', record.height)
    updateField('weight', record.weight)
    updateField('bloodType', record.bloodType)
    
    if (record.bloodPressure) {
      updateField('bloodPressure', {
        systolic: record.bloodPressure.systolic || null, 
        diastolic: record.bloodPressure.diastolic || null
      })
    }
    
    updateField('heartRate', record.heartRate)
    updateField('medicalReportUrl', record.medicalReportUrl)
    updateField('emergencyContactName', record.emergencyContactName)
    updateField('emergencyContactPhone', record.emergencyContactPhone)
    updateField('consentToStore', true)
    
    setIsEditing(true)
    
    toast({
      title: "Record loaded for editing",
      description: "Your medical record has been loaded. You can now make changes."
    })
  }

  // Function to handle record deletion
  const handleDeleteRecord = async (recordId: string) => {
    try {
      setIsDeleting(true)
      setRecordToDelete(recordId)
      
      const result = await deleteMedicalRecord(recordId)
      
      if (result.success) {
        setExistingRecords(existingRecords.filter(record => record.id !== recordId))
        toast({
          title: "Record deleted",
          description: "Your medical record has been successfully deleted."
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to delete record"
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred."
      })
    } finally {
      setIsDeleting(false)
      setRecordToDelete(null)
    }
  }

  // Show existing records or loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </Card>
      </div>
    )
  }

  // If we have existing records and not in editing mode, show them with edit buttons
  if (existingRecords.length > 0 && !isEditing) {
    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Your Medical Records</h2>
        <p className="text-muted-foreground mb-8">
          You already have medical records in our system. You can view them below or choose to edit.
        </p>
        
        <div className="space-y-6">
          {existingRecords.map((record) => (
            <Card key={record.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-lg mb-3">Personal Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {record.firstName} {record.lastName}</p>
                    <p><span className="font-medium">Date of Birth:</span> {new Date(record.dateOfBirth).toLocaleDateString()}</p>
                    <p><span className="font-medium">Gender:</span> {record.gender}</p>
                    <p><span className="font-medium">Email:</span> {record.email}</p>
                    <p><span className="font-medium">Phone:</span> {record.phoneNumber}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-3">Medical Information</h3>
                  <div className="space-y-2">
                    {record.medicalConditions?.length > 0 && (
                      <p><span className="font-medium">Medical Conditions:</span> {record.medicalConditions.join(', ')}</p>
                    )}
                    {record.allergies?.length > 0 && (
                      <p><span className="font-medium">Allergies:</span> {record.allergies.join(', ')}</p>
                    )}
                    {record.currentMedications?.length > 0 && (
                      <p><span className="font-medium">Current Medications:</span> {record.currentMedications.join(', ')}</p>
                    )}
                    <p><span className="font-medium">Health Metrics:</span> 
                      {record.height && `Height: ${record.height} ft, `}
                      {record.weight && `Weight: ${record.weight} kg, `}
                      {record.bloodType && `Blood Type: ${record.bloodType.replace('_', '+').replace('POSITIVE', '+').replace('NEGATIVE', '-')}`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your medical record.
                        If this record is being used in any active treatments, it cannot be deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteRecord(record.id)}
                        className="bg-red-500 hover:bg-red-600"
                        disabled={isDeleting && recordToDelete === record.id}
                      >
                        {isDeleting && recordToDelete === record.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button onClick={() => handleEditRecord(record)}>
                  Edit Record
                </Button>
              </div>
            </Card>
          ))}
          
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Create New Record
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Otherwise show the form (either for new records or editing)
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {isEditing && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Update Medical Record</h2>
          <Button 
            variant="outline" 
            onClick={() => {
              resetForm()
              setIsEditing(false)
              setEditingRecordId(null)
            }}
          >
            Cancel Editing
          </Button>
        </div>
      )}
      
      {/* Steps Header */}
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol className="space-y-4 md:flex md:space-x-4 md:space-y-0">
            {steps.map((step) => (
              <li key={step.id} className="md:flex-1">
                <div
                  className={cn(
                    "group flex flex-col border rounded-lg py-2 px-4 md:pl-4 md:pr-6",
                    currentStep > step.id && "border-blue-600 bg-blue-50",
                    currentStep === step.id && "border-blue-600 bg-white",
                    currentStep < step.id && "border-gray-200 bg-gray-50"
                  )}
                >
                  <span className="text-xs font-medium text-gray-500">
                    Step {step.id}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      currentStep >= step.id
                        ? "text-blue-600"
                        : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </span>
                  <span
                    className={cn(
                      "text-xs",
                      currentStep >= step.id
                        ? "text-blue-700"
                        : "text-gray-500"
                    )}
                  >
                    {step.description}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Form Content */}
      <Card className="max-w-3xl mx-auto p-6">
        {currentStep === 1 && <RequiredInformationForm recordId={editingRecordId} />}
        {currentStep === 2 && <MedicalInformationForm recordId={editingRecordId} />}
        {currentStep === 3 && <HealthMetricsForm recordId={editingRecordId} />}
        {currentStep === 4 && <UploadDataForm recordId={editingRecordId} />}
        {currentStep === 5 && <EmergencyContactForm recordId={editingRecordId} />}

        {/* Form Progress */}
        <div className="mt-8 pt-5">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Step {currentStep} of {steps.length}
          </p>
        </div>
      </Card>
    </div>
  )
}