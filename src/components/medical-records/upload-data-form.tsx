// components/medical-records/upload-data-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { uploadDataSchema } from "@/lib/validations/medical-record"
import { useMedicalRecordStore } from "@/store/useMedicalRecordStore"
import { UploadDropzone } from "@/utils/uploadthing"
import { Badge } from "@/components/ui/badge"
import { z } from "zod"
import{ useToast } from "@/hooks/use-toast"

type UploadDataValues = z.infer<typeof uploadDataSchema>

interface UploadedFile {
  url: string;
  name: string;
}

export function UploadDataForm() {
const toast = useToast()
  const store = useMedicalRecordStore()
  const [isPending, setIsPending] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const form = useForm<UploadDataValues>({
    resolver: zodResolver(uploadDataSchema),
    defaultValues: {
      medicalReportUrl: store.medicalReportUrl || "",
    },
  })

  const handleFileRemove = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    if (uploadedFiles.length === 1) {
      form.setValue('medicalReportUrl', '')
    }
  }

  async function onSubmit(data: UploadDataValues) {
    setIsPending(true)
    try {
      store.updateField('medicalReportUrl', data.medicalReportUrl as string)
      store.nextStep()
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="medicalReportUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Medical Reports</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {uploadedFiles.length === 0 ? (
                    <UploadDropzone
                      endpoint="medicalRecords"
                      onClientUploadComplete={(res) => {
                        if (res) {
                          const newFiles = res.map(file => ({
                            url: file.url,
                            name: file.name
                          }))
                          setUploadedFiles(prev => [...prev, ...newFiles])
                          
                          field.onChange(res[0].url)
                        }
                      }}
                      onUploadError={(error: Error) => {
                        // toast({
                        
                        //   variant: "destructive",
                        //   title: "Error",
                        //   description: error instanceof Error ? error.message : "Something went wrong",
                        // })  
                      }}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 ut-uploading:cursor-not-allowed"
                    />
                  ) : (
                    <div className="space-y-4">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-medium">
                              {file.name}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFileRemove(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {uploadedFiles.length < 8 && (
                        <UploadDropzone
                          endpoint="medicalRecords"
                          onClientUploadComplete={(res) => {
                            if (res) {
                              const newFiles = res.map(file => ({
                                url: file.url,
                                name: file.name
                              }))
                              setUploadedFiles(prev => [...prev, ...newFiles])
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.error(error)
                            
                          }}
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6"
                        />
                      )}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Accepted file formats: PDF, JPG, PNG, DOCX (Max size: 1MB)
                  </p>
                </div>
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