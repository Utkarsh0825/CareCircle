import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, CheckCircle, Mail, Home } from "lucide-react"
import Link from "next/link"

export default function DonationSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/50 text-center">
          <CardHeader className="pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-foreground">Thank You!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Your generous donation helps us keep CareCircle free for cancer patients and their families.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Receipt sent to your email</span>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">Your Impact</h3>
              <p className="text-sm text-muted-foreground">
                Thanks to supporters like you, we've helped over 2,800 families coordinate care and stay connected
                during their cancer journey.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Return to Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild className="bg-transparent">
                <Link href="/donate">Make Another Donation</Link>
              </Button>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">From all of us at CareCircle</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
