'use client'
// components/services/service-hero.tsx
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function ServiceHero() {

  const scrollToForm = () => {
    const formElement = document.getElementById('order-form')
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-3xl mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mb-12">
      {/* Background Image */}
      <div className="absolute inset-0 bg-gray-800">
        <img
          src="/images/service/mangment.png"
          alt="Medicine Delivery"
          className="w-full h-full object-cover opacity-75"
        />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40">
        <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white max-w-3xl mb-4">
            Get Your <span className="text-blue-400">Medicines</span> Delivered to Your Doorstep
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl">
            Fast, Safe, and Convenient!
          </p>
          <Button 
            size="lg"
            onClick={scrollToForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg text-lg"
          >
            Order Now
          </Button>
        </div>
      </div>
    </div>
  )
}