"use client"

import { Card } from "@/components/ui/card"
import { useNurseVerificationStore } from "@/store/useNurseVerificationStore"
import { ServicesSelectionForm } from "./ServicesSelectionForm"

import { cn } from "@/lib/utils"
import { ReviewStep } from "./ReviewStep"

const steps = [
  {
    id: 1,
    title: "Service Selection",
    description: "Select the services you provide",
  },
  {
    id: 2,
    title: "Review & Submit",
    description: "Review and submit your application",
  }
]

export function NurseVerificationForm() {
  const { currentStep } = useNurseVerificationStore()
  
  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        {currentStep === 1 && <ServicesSelectionForm />}
        {currentStep === 2 && <ReviewStep />}

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