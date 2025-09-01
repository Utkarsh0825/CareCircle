import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">CareCircle</h1>
        </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Circle</CardTitle>
            <CardDescription>Start your private support network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Your full name" className="bg-input border-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" className="bg-input border-border" />
              </div>

              <div className="space-y-3">
                <Label>I am a:</Label>
                <RadioGroup defaultValue="patient" className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="patient" id="patient" />
                    <Label htmlFor="patient" className="text-sm">
                      Cancer patient creating my support circle
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="caregiver" id="caregiver" />
                    <Label htmlFor="caregiver" className="text-sm">
                      Family member/caregiver setting up for a loved one
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full">
                Create Circle
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <p>We'll send you a secure link to complete setup</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
