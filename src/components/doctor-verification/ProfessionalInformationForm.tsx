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
import { Badge } from "@/components/ui/badge"
import { professionalInformationSchema } from "@/lib/validations/doctor-verification"
import { useDoctorVerificationStore } from "@/store/useDoctorVerificationStore"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { EXPERTISE_AREAS, SPECIALIZATIONS } from "@/lib/constants/medical-specialties"

type ProfessionalInformationValues = z.infer<typeof professionalInformationSchema>

export function ProfessionalInformationForm() {
  const store = useDoctorVerificationStore()
  const [isPending, setIsPending] = useState(false)


  const form = useForm<ProfessionalInformationValues>({
    resolver: zodResolver(professionalInformationSchema),
    defaultValues: {
      pmcNumber: store.pmcNumber,
      graduationYear: store.graduationYear || undefined,
      medicalSchool: store.medicalSchool,
      specialization: store.specialization || [],
      expertise: store.expertise || [],
      
      experienceYears: store.experienceYears || undefined,
    },
  })

 

  const removeItem = (
    field: "specialization" | "expertise",
    index: number
  ) => {
    const currentValues = form.getValues(field) || []
    form.setValue(
      field,
      currentValues.filter((_, i) => i !== index)
    )
  }

  async function onSubmit(data: ProfessionalInformationValues) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PMC Number */}
          <FormField
            control={form.control}
            name="pmcNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PMC Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter PMC number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Graduation Year */}
          <FormField
            control={form.control}
            name="graduationYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graduation Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="YYYY"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Medical School */}
        <FormField
          control={form.control}
          name="medicalSchool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Medical School</FormLabel>
              <FormControl>
                <Input placeholder="Enter medical school name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Specializations */}
        <FormField
  control={form.control}
  name="specialization"
  render={({ field }) => (
    <FormItem className="space-y-4">
      <FormLabel>Specializations</FormLabel>
      <div className="flex gap-2">
        <FormControl>
          <Select
            onValueChange={(value) => {
              if (value && !field.value.includes(value)) {
                form.setValue("specialization", [...field.value, value]);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent>
              {SPECIALIZATIONS.map((spec) => (
                <SelectItem 
                  key={spec} 
                  value={spec}
                  disabled={field.value.includes(spec)}
                >
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </div>
      <div className="flex flex-wrap gap-2">
        {field.value?.map((spec, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="px-3 py-1 space-x-2"
          >
            <span>{spec}</span>
            <button
              type="button"
              onClick={() => removeItem("specialization", index)}
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

        {/* Areas of Expertise */}
        <FormField
  control={form.control}
  name="expertise"
  render={({ field }) => (
    <FormItem className="space-y-4">
      <FormLabel>Areas of Expertise</FormLabel>
      <div className="flex gap-2">
        <FormControl>
          <Select
            onValueChange={(value) => {
              if (value && !field.value.includes(value)) {
                form.setValue("expertise", [...field.value, value]);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select expertise" />
            </SelectTrigger>
            <SelectContent>
              {EXPERTISE_AREAS.map((exp) => (
                <SelectItem 
                  key={exp} 
                  value={exp}
                  disabled={field.value.includes(exp)}
                >
                  {exp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      </div>
      <div className="flex flex-wrap gap-2">
        {field.value?.map((exp, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="px-3 py-1 space-x-2"
          >
            <span>{exp}</span>
            <button
              type="button"
              onClick={() => removeItem("expertise", index)}
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

        {/* Years of Experience */}
        <FormField
          control={form.control}
          name="experienceYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter years of experience"
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