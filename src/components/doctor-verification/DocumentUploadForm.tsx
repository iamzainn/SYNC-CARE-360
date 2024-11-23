"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { documentUploadSchema } from "@/lib/validations/doctor-verification"
import { useDoctorVerificationStore } from "@/store/useDoctorVerificationStore"
import { UploadDropzone } from "@/utils/uploadthing"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod"

type DocumentUploadValues = z.infer<typeof documentUploadSchema>

interface UploadedFile {
  url: string;
  name: string;
}

interface FileSection {
  fieldName: keyof DocumentUploadValues;
  label: string;
  description: string;
  endpoint: "profilePhoto" | "degreeDoc" | "pmcDoc" | "cnicDoc";
}

const fileSections: FileSection[] = [
  {
    fieldName: "profilePhoto",
    label: "Profile Photo",
    description: "Upload a recent passport-sized photograph",
    endpoint: "profilePhoto"
  },
  {
    fieldName: "degreeImage",
    label: "Medical Degree",
    description: "Upload your MBBS or equivalent degree certificate",
    endpoint: "degreeDoc"
  },
  {
    fieldName: "pmcImage",
    label: "PMC Registration",
    description: "Upload your PMC registration certificate",
    endpoint: "pmcDoc"
  },
  {
    fieldName: "cnicImage",
    label: "CNIC",
    description: "Upload both sides of your CNIC",
    endpoint: "cnicDoc"
  }
];

export function DocumentUploadForm() {
  const { toast } = useToast()
  const store = useDoctorVerificationStore()
  const [isPending, setIsPending] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({})

  const form = useForm<DocumentUploadValues>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      profilePhoto: store.profilePhoto || "",
      degreeImage: store.degreeImage || "",
      pmcImage: store.pmcImage || "",
      cnicImage: store.cnicImage || "",
    },
  })

  const handleFileRemove = (fieldName: keyof DocumentUploadValues) => {
    form.setValue(fieldName, "")
    const newUploadedFiles = { ...uploadedFiles }
    delete newUploadedFiles[fieldName]
    setUploadedFiles(newUploadedFiles)
  }

  async function onSubmit(data: DocumentUploadValues) {
    setIsPending(true)
    try {
      Object.entries(data).forEach(([key, value]) => {
        store.updateField(key as keyof DocumentUploadValues, value)
      })
     console.log("here");
      store.nextStep()
      store.currentStep+=1
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save document information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fileSections.map((section) => (
          <FormField
            key={section.fieldName}
            control={form.control}
            name={section.fieldName}
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>{section.label}</FormLabel>
                <FormDescription>{section.description}</FormDescription>
                <FormControl>
                  <div className="space-y-4">
                    {!field.value ? (
                      <UploadDropzone
                        endpoint={section.endpoint}
                        onClientUploadComplete={(res) => {
                          if (res && res[0]) {
                            const file = res[0]
                            setUploadedFiles(prev => ({
                              ...prev,
                              [section.fieldName]: {
                                url: file.url,
                                name: file.name
                              }
                            }))
                            field.onChange(file.url)
                            toast({
                              title: "Success",
                              description: "File uploaded successfully",
                            })
                          }
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            title: "Error",
                            description: error.message || "Failed to upload file",
                            variant: "destructive",
                          })
                        }}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 ut-uploading:cursor-not-allowed"
                      />
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-medium">
                            {uploadedFiles[section.fieldName]?.name || "File uploaded"}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileRemove(section.fieldName)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Accepted formats: PDF, JPG, PNG (Max size: 1MB)
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-between pt-4">
        <Button
            type="button"
            variant="outline"
            onClick={() => store.previousStep()}
          >
            Previous
          </Button>
          <Button 
            type="submit" 
            disabled={isPending || !form.formState.isValid}
          >
            Review Application
          </Button>
        </div>
      </form>
    </Form>
  )
}