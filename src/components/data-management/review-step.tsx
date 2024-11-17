"use client"

import { Button } from "@/components/ui/button"
import { useMedicalRecordStore } from "@/store/useMedicalRecordStore"
import { format } from "date-fns"
import { Loader2 } from "lucide-react";

interface ReviewStepProps {
  onEdit: () => void;
  onSubmit: () => Promise<void>;
  isPending: boolean;
}

export function ReviewStep({ onEdit, onSubmit, isPending }: ReviewStepProps) {
  const store = useMedicalRecordStore()

  const formatBloodType = (type: string | null) => {
    if (!type) return "Not specified"
    return type.replace("_", "+").replace("POSITIVE", "+").replace("NEGATIVE", "-")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Review Your Information</h3>
        {isPending && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </div>
        )}
      </div>

      {/* Required Information */}
      <section className="space-y-3">
        <h4 className="font-medium text-blue-600">Personal Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Full Name</p>
            <p>{store.firstName} {store.lastName}</p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p>{store.dateOfBirth ? format(store.dateOfBirth, 'PP') : 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Gender</p>
            <p>{store.gender || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Contact</p>
            <p>{store.email}<br />{store.phoneNumber}</p>
          </div>
        </div>
      </section>

      {/* Medical Information */}
      <section className="space-y-3">
        <h4 className="font-medium text-blue-600">Medical Information</h4>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">Medical Conditions</p>
            <p>{store.medicalConditions?.length 
              ? store.medicalConditions.join(", ") 
              : "None specified"}</p>
          </div>
          <div>
            <p className="text-gray-500">Allergies</p>
            <p>{store.allergies?.length 
              ? store.allergies.join(", ") 
              : "None specified"}</p>
          </div>
          <div>
            <p className="text-gray-500">Current Medications</p>
            <p>{store.currentMedications?.length 
              ? store.currentMedications.join(", ") 
              : "None specified"}</p>
          </div>
        </div>
      </section>

      {/* Health Metrics */}
      <section className="space-y-3">
        <h4 className="font-medium text-blue-600">Health Metrics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Height</p>
            <p>{store.height ? `${store.height} ft` : 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Weight</p>
            <p>{store.weight ? `${store.weight} kg` : 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Blood Type</p>
            <p>{formatBloodType(store.bloodType)}</p>
          </div>
          <div>
            <p className="text-gray-500">Blood Pressure</p>
            <p>{store.bloodPressure?.systolic && store.bloodPressure?.diastolic 
              ? `${store.bloodPressure.systolic}/${store.bloodPressure.diastolic}`
              : 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-500">Heart Rate</p>
            <p>{store.heartRate ? `${store.heartRate} bpm` : 'Not specified'}</p>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="space-y-3">
        <h4 className="font-medium text-blue-600">Emergency Contact</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p>{store.emergencyContactName}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p>{store.emergencyContactPhone}</p>
          </div>
        </div>
      </section>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          disabled={isPending}
        >
          Edit Information
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Confirm & Submit"
          )}
        </Button>
      </div>
    </div>
  )
}