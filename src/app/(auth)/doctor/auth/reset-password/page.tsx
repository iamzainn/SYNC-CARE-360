
import { ResetPasswordForm } from "@/components/auth/reset-password"
import { redirect } from "next/navigation"

export default function ResetPasswordPage({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const token = searchParams.token

  if (!token) {
    redirect('/doctor/auth?tab=login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <ResetPasswordForm />
    </div>
  )
}