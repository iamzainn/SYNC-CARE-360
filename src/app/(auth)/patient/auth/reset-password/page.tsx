
import { PatientResetPasswordForm } from "@/components/auth/patient-reset-password-form"
import { redirect } from "next/navigation"

export default function PatientResetPasswordPage({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const token = searchParams.token

  if (!token) {
    redirect('/patient/auth?tab=login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <PatientResetPasswordForm token={token} />
    </div>
  )
}