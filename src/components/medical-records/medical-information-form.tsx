// components/medical-records/medical-information-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { medicalInformationSchema } from "@/lib/validations/medical-record"
import { useMedicalRecordStore } from "@/store/useMedicalRecordStore"
import { Badge } from "@/components/ui/badge"
import { z } from "zod"

type MedicalInformationValues = z.infer<typeof medicalInformationSchema>

export function MedicalInformationForm() {
  const store = useMedicalRecordStore()
  const [isPending, setIsPending] = useState(false)
  const [newCondition, setNewCondition] = useState("")
  const [newAllergy, setNewAllergy] = useState("")
  const [newMedication, setNewMedication] = useState("")

  const form = useForm<MedicalInformationValues>({
    resolver: zodResolver(medicalInformationSchema),
    defaultValues: {
      medicalConditions: store.medicalConditions || [],
      allergies: store.allergies || [],
      currentMedications: store.currentMedications || [],
    },
  })

  const addItem = (
    field: "medicalConditions" | "allergies" | "currentMedications",
    value: string,
    setValue: (value: string) => void
  ) => {
    if (value.trim()) {
      const currentValues = form.getValues(field) || []
      form.setValue(field, [...currentValues, value.trim()])
      setValue("")
    }
  }

  const removeItem = (
    field: "medicalConditions" | "allergies" | "currentMedications",
    index: number
  ) => {
    const currentValues = form.getValues(field) || []
    form.setValue(
      field,
      currentValues.filter((_, i) => i !== index)
    )
  }

  async function onSubmit(data: MedicalInformationValues) {
    setIsPending(true)
    try {
      Object.entries(data).forEach(([key, value]) => {
        store.updateField(key as keyof typeof data, value)
      })
      store.nextStep()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Medical Conditions */}
        <FormField
          control={form.control}
          name="medicalConditions"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel>Current Medical Conditions</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="e.g., diabetes, hypertension"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addItem("medicalConditions", newCondition, setNewCondition)
                      }
                    }}
                  />
                </FormControl>
                <Button
                  type="button"
                  onClick={() => addItem("medicalConditions", newCondition, setNewCondition)}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {field.value?.map((condition, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 space-x-2"
                  >
                    <span>{condition}</span>
                    <button
                      type="button"
                      onClick={() => removeItem("medicalConditions", index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Allergies */}
        <FormField
          control={form.control}
          name="allergies"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel>Allergies</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="e.g., penicillin, peanuts"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addItem("allergies", newAllergy, setNewAllergy)
                      }
                    }}
                  />
                </FormControl>
                <Button
                  type="button"
                  onClick={() => addItem("allergies", newAllergy, setNewAllergy)}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {field.value?.map((allergy, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 space-x-2"
                  >
                    <span>{allergy}</span>
                    <button
                      type="button"
                      onClick={() => removeItem("allergies", index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Current Medications */}
        <FormField
          control={form.control}
          name="currentMedications"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel>Current Medications</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="e.g., aspirin 81mg daily"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addItem("currentMedications", newMedication, setNewMedication)
                      }
                    }}
                  />
                </FormControl>
                <Button
                  type="button"
                  onClick={() => addItem("currentMedications", newMedication, setNewMedication)}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {field.value?.map((medication, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 space-x-2"
                  >
                    <span>{medication}</span>
                    <button
                      type="button"
                      onClick={() => removeItem("currentMedications", index)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => store.previousStep()}
          >
            Previous
          </Button>
          <Button type="submit" disabled={isPending}>
            Next Step
          </Button>
        </div>
      </form>
    </Form>
  )
}