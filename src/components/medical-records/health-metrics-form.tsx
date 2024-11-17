// components/medical-records/health-metrics-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { healthMetricsSchema } from "@/lib/validations/medical-record"
import { useMedicalRecordStore } from "@/store/useMedicalRecordStore"
import { z } from "zod"

type HealthMetricsValues = z.infer<typeof healthMetricsSchema>

const BLOOD_TYPES = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
] as const

const formatBloodType = (type: string) => {
  return type.replace("_", "+").replace("POSITIVE", "+").replace("NEGATIVE", "-")
}

export function HealthMetricsForm() {
  const store = useMedicalRecordStore()
  const [isPending, setIsPending] = useState(false)

  const form = useForm<HealthMetricsValues>({
    resolver: zodResolver(healthMetricsSchema),
    defaultValues: {
      height: store.height || undefined,
      weight: store.weight || undefined,
      bloodType: store.bloodType  || undefined,
      bloodPressure: {
        systolic: store.bloodPressure.systolic || undefined,
        diastolic: store.bloodPressure.diastolic || undefined
      },
      heartRate: store.heartRate || undefined,
    },
  })

  async function onSubmit(data: HealthMetricsValues) {
    setIsPending(true)
    try {
      Object.entries(data).forEach(([key, value]) => {
        store.updateField(key as keyof typeof data, value as number)
      })
      store.nextStep()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Height */}
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (ft)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="5.8"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Weight */}
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="70"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Blood Type */}
        <FormField
          control={form.control}
          name="bloodType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BLOOD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {formatBloodType(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Blood Pressure */}
        <div className="space-y-4">
          <FormLabel>Blood Pressure</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bloodPressure.systolic"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Systolic"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bloodPressure.diastolic"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Diastolic"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Heart Rate */}
        <FormField
          control={form.control}
          name="heartRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heart Rate (bpm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="70"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
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