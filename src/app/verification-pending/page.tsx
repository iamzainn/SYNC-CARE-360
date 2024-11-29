import { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Verification Pending | CareSync360",
  description: "Your doctor verification request is being processed.",
}

export default function VerificationPendingPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl mb-2">Verification Request Submitted</CardTitle>
          <CardDescription>
            Thank you for applying to join CareSync360 as a healthcare provider.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ul className="space-y-2 text-sm">
              <li>• Our team will review your application within 2-3 business days</li>
              <li>• You will receive an email notification about the status</li>
              <li>• If approved, you will get access to the doctors dashboard</li>
              <li>• Additional information may be requested if needed</li>
            </ul>
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Have questions? Contact our support team
            </p>
            <div className="space-x-4">
              <Button asChild variant="outline">
                <Link href="/">Return Home</Link>
              </Button>
              
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}