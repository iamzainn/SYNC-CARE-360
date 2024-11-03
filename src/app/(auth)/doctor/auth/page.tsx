'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DoctorLoginForm } from "@/components/auth/doctor-login-form"
import { DoctorSignUpForm } from "@/components/auth/doctor-signup-form"
import { Card, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

export default function DoctorAuthPage() {

  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'login'
  console.log('defaultTab', defaultTab)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-[450px] p-6">
        <CardHeader className="space-y-1 flex flex-col items-center mb-4">
          <Image
            src="/logo.png"
            alt="Care Sync 360"
            width={50}
            height={50}
            className="mb-2"
          />
          <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>
          <p className="text-sm text-muted-foreground text-center">
            Please enter your details to get started
          </p>
        </CardHeader>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <DoctorLoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <DoctorSignUpForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}