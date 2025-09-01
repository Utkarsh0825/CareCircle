"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Moon, Sun, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login, getUserGroups, selectGroup } from "@/lib/session"
import { getRoot } from "@/lib/localStore"
import { useTheme } from "next-themes"
import { TourTrigger } from "@/components/tour/tour-trigger"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = login(email)
      const userGroups = getUserGroups(user.id)
      
      if (userGroups.length === 0) {
        // No groups, redirect to join
        router.push("/join")
      } else if (userGroups.length === 1) {
        // One group, auto-select and redirect to dashboard
        selectGroup(userGroups[0].id)
        router.push("/dashboard")
      } else {
        // Multiple groups, redirect to group selection
        router.push("/auth/select-group")
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Heart className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
                          {/* Logo */}
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <Heart className="h-8 w-8 text-primary" />
                      <h1 className="text-2xl font-semibold text-foreground">CareCircle</h1>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="ml-4"
                    >
                      {theme === 'dark' ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                    <TourTrigger page="signin" variant="ghost" size="sm" className="ml-2" />
                  </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your support circle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form id="signin-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-input border-border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {error && <div className="text-center text-sm text-red-500">{error}</div>}

            <div className="text-center text-sm text-muted-foreground">
              <p>Enter your email to sign in or create a new account</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/join" className="text-primary hover:underline">
                  Join a circle
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Demo: Use any email address to sign in or create an account
          </p>
        </div>
      </div>
    </div>
  )
}
