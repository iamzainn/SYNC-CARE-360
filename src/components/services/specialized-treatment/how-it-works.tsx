
// components/services/specialized-treatment/how-it-works.tsx
import { 
  FileText, 
  UserCheck, 
  Calendar, 
  Stethoscope,
  ArrowRight 
} from "lucide-react"
import { Card } from "@/components/ui/card"

const steps = [
  {
    icon: FileText,
    title: "Submit Your Request",
    description: "Upload your prescription or describe the treatment you need. Our system will process your request promptly."
  },
  {
    icon: UserCheck,
    title: "Choose Your Specialist",
    description: "Select from our list of verified medical specialists based on their expertise and experience."
  },
  {
    icon: Calendar,
    title: "Get Confirmation",
    description: "The specialist will review your case and confirm the treatment details and schedule."
  },
  {
    icon: Stethoscope,
    title: "Receive Treatment",
    description: "Get professional medical care in the comfort of your home from your chosen specialist."
  }
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600">
            Simple steps to get the specialized medical treatment you need at home
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="relative p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 z-10 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                </div>
              )}
              
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <step.icon className="h-6 w-6 text-blue-600" />
                </div>
                
                <div>
                  <h3 className="font-medium text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-medium">
                  {index + 1}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            All our medical specialists are verified and follow strict protocols to ensure 
            your safety and comfort during the treatment process.
          </p>
        </div>
      </div>
    </section>
  )
}
