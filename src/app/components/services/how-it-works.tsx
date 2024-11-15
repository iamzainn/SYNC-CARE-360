// components/services/how-it-works.tsx
import { FileText } from "lucide-react"
import { FaPills, FaClipboardCheck } from "react-icons/fa"
import { Card } from "@/components/ui/card"

const steps = [
  {
    id: 1,
    title: "Fill Out Your Details",
    description: "Enter your contact information and delivery address to get started.",
    icon: FileText
  },
  {
    id: 2,
    title: "Add Medicines",
    description: "Select medicines or upload your prescription.",
    icon: FaPills
  },
  {
    id: 3,
    title: "Place Order",
    description: "Submit your request and relax!",
    icon: FaClipboardCheck
  }
]

export function HowItWorks() {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
        How it works
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {steps.map((step) => {
          const Icon = step.icon
          return (
            <Card 
              key={step.id}
              className="p-6 flex flex-col items-center text-center bg-white"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {step.description}
              </p>
            </Card>
          )}
        )}
      </div>
    </section>
  )
}