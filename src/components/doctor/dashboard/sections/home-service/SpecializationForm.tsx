"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { HOME_SPECIALIZATIONS } from "@/lib/constants/home-services"
import * as z from "zod"

const specializationSchema = z.object({
  type: z.string(),
  price: z.number().min(100, "Minimum price is Rs. 100")
})

type SpecializationFormValues = z.infer<typeof specializationSchema>

interface HomeServiceSpecializationFormProps {
  initialData?: { type: string; price: number }[]
  onNext: () => void
}

export function HomeServiceSpecializationForm({ 
  initialData = [], 
  onNext 
}: HomeServiceSpecializationFormProps) {
  const [specializations, setSpecializations] = useState(initialData)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<SpecializationFormValues>({
    resolver: zodResolver(specializationSchema),
    defaultValues: {
      type: "",
      price: undefined
    }
  })

  const availableSpecializations = HOME_SPECIALIZATIONS.filter(
    spec => !specializations.find(s => s.type === spec.id)
  )

  const onSubmitSpecialization = (values: SpecializationFormValues) => {
    setSpecializations(prev => [...prev, values])
    form.reset()
  }

  const removeSpecialization = (type: string) => {
    setSpecializations(prev => prev.filter(s => s.type !== type))
  }

  const handleSave = async () => {
    if (specializations.length === 0) {
      return
    }
    setIsPending(true)
    try {
      // Save specializations
      onNext()
    } catch (error) {
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitSpecialization)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={availableSpecializations.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSpecializations.map((spec) => (
                          <SelectItem key={spec.id} value={spec.id}>
                            {spec.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (Rs.)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" variant="outline">Add Service</Button>
          </form>
        </Form>

        <div className="space-y-4">
          <h4 className="font-medium">Added Services</h4>
          <div className="flex flex-wrap gap-2">
            {specializations.map((spec) => {
              const specData = HOME_SPECIALIZATIONS.find(s => s.id === spec.type)
              return (
                <Badge
                  key={spec.type}
                  variant="secondary"
                  className="px-3 py-1 space-x-2"
                >
                  <span>{specData?.label} - Rs.{spec.price}</span>
                  <button
                    type="button"
                    onClick={() => removeSpecialization(spec.type)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          onClick={handleSave}
          disabled={isPending || specializations.length === 0}
        >
          Next: Set Availability
        </Button>
      </div>
    </div>
  )
}