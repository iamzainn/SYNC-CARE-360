import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Home, Stethoscope, Shield } from "lucide-react"

const benefits = [
  {
    title: "24/7 Availability",
    description: "Get medical assistance any time of the day or night",
    icon: Clock
  },
  {
    title: "Home Comfort",
    description: "Receive professional medical care in the comfort of your home",
    icon: Home
  },
  {
    title: "Qualified Doctors",
    description: "All our doctors are verified and highly qualified professionals",
    icon: Stethoscope
  },
  {
    title: "Safe & Secure",
    description: "Strict safety protocols and secure medical consultations",
    icon: Shield
  }
]

export function ServiceBenefits() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Why Choose Our Home Service
        </h2>
        <p className="text-muted-foreground text-lg">
          Experience healthcare that comes to you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit) => (
          <Card key={benefit.title} className="border-2">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}