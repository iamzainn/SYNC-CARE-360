// components/doctor/dashboard/sections/PersonalDetailsSection.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil } from "lucide-react"
import { UploadDropzone } from "@/utils/uploadthing"
import { useToast } from "@/hooks/use-toast"
import { PersonalDetailsFormValues, personalDetailsSchema } from "@/lib/validations/doctor"
import { DoctorProfile } from "@/types/doctor"
import { updateDoctorProfile } from "@/lib/actions/doctor"

interface PersonalDetailsSectionProps {
  initialData: DoctorProfile
}

export function PersonalDetailsSection({ initialData }: PersonalDetailsSectionProps) {
  const { toast } = useToast()
  const [isPending, setIsPending] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const form = useForm({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      phone: initialData.phone,
      currentCity: initialData.currentCity,
      profilePhoto: initialData.profilePhoto || "",
    },
  })
  
  async function onSubmit(data: PersonalDetailsFormValues) {
    setIsPending(true)
    try {
    
      const response = await updateDoctorProfile(data)
    
    if (response.error) {
      throw new Error(response.error)
    }
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Personal Details</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Details
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Photo */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={initialData.profilePhoto || ""} />
            <AvatarFallback>
              {initialData.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <div className="flex-1 max-w-xs">
              <UploadDropzone
                endpoint="profilePhoto"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    form.setValue("profilePhoto", res[0].url)
                    toast({ title: "Photo uploaded" })
                  }
                }}
                onUploadError={(error: Error) => {
                  toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                  })
                }}
              />
            </div>
          )}
        </div>

        {/* Non-editable Information */}
        <div className="grid gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium mb-2">Professional Information</h3>
            <div className="grid gap-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Experience:</span>
                <span className="ml-2 font-medium">{initialData.experienceYears} years</span>
              </div>
              
              {/* Specializations */}
              <div>
                <span className="text-sm text-muted-foreground">Specializations:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {initialData.specialization.map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Expertise */}
              <div>
                <span className="text-sm text-muted-foreground">Areas of Expertise:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {initialData.expertise.map((exp) => (
                    <Badge key={exp} variant="outline" className="bg-blue-50">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Form */}
        {isEditing ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="03XXXXXXXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current City</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Phone:</span>
                <p className="font-medium">{initialData.phone}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">City:</span>
                <p className="font-medium">{initialData.currentCity}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}