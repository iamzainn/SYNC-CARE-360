// src/app/(auth)/doctor/auth/page.tsx
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DoctorLoginForm } from "@/components/auth/doctor-login-form"
import { DoctorSignUpForm } from "@/components/auth/doctor-signup-form"
import { Card, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DoctorAuthPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'login')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Update URL without navigation
    const params = new URLSearchParams(searchParams)
    params.set('tab', value)
    router.push(`/doctor/auth?${params.toString()}`, { scroll: false })
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-[450px] p-6">
        <CardHeader className="space-y-1 flex flex-col items-center mb-4">
          <Image
            src="/logo.jpeg"
            alt="Care Sync 360"
            width={120}
            height={120}
            className="mb-2"
          />
          <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
          <p className="text-sm text-muted-foreground text-center">
            Please enter your details to get started
          </p>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <DoctorLoginForm callbackUrl={callbackUrl??''} />
          </TabsContent>
          <TabsContent value="signup">
            <DoctorSignUpForm callbackUrl={callbackUrl??''} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}