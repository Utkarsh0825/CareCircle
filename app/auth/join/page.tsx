import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function JoinPage() {
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
            <CardTitle className="text-2xl">Join a Circle</CardTitle>
            <CardDescription>Enter your invite code to join a support circle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" type="text" placeholder="Your full name" className="bg-input border-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" className="bg-input border-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-code">Invite Code</Label>
                <Input
                  id="invite-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="bg-input border-border text-center text-lg tracking-widest"
                  maxLength={6}
                />
              </div>

              <Button type="submit" className="w-full">
                Join Circle
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <p>Ask the circle owner for your invite code</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Need to create your own circle?{" "}
                <Link href="/auth/signup" className="text-primary hover:underline">
                  Get started
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
