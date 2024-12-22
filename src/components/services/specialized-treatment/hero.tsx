'use client'
// components/services/specialized-treatment/hero.tsx
import { Button } from "@/components/ui/button"
import { ArrowRight, Stethoscope, Shield, Clock } from "lucide-react"

export function ServiceHero() {
  return (
    <div className="relative bg-gradient-to-b from-blue-900 to-blue-800 text-white">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid" />
      
      <div className="relative container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Receive{" "}
              <span className="text-blue-400">
                Specialized Medical Treatments
              </span>{" "}
              at Home
            </h1>
            
            <p className="text-lg text-blue-100">
              Professional medical care delivered by verified specialists in the comfort of your home. Expert treatments with personalized attention.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Expert Doctors</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Verified Specialists</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Flexible Timing</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={() => document.getElementById('treatment-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Request Treatment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/20"
              >
                Learn More
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-3xl transform rotate-3" />
              <div className="relative bg-white/[0.02] border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-400/20 flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Professional Care</h3>
                      <p className="text-sm text-blue-200">By Verified Specialists</p>
                    </div>
                  </div>

                  {/* Add more feature highlights */}
                  <div className="space-y-2 text-sm text-blue-200">
                    <p>✓ Personalized treatment plans</p>
                    <p>✓ Modern medical equipment</p>
                    <p>✓ Follow-up consultations</p>
                    <p>✓ Safe and sterile procedures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
