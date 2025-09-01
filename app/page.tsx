'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Users, Calendar, Moon, Sun, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { TourTrigger } from "@/components/tour/tour-trigger"
import { TourWelcome } from "@/components/tour/tour-welcome"

export default function HomePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Show welcome modal for first-time users
    const hasSeenWelcome = localStorage.getItem('carecircle-tour-welcome-seen')
    if (!hasSeenWelcome) {
      setTimeout(() => setShowWelcome(true), 1000)
    }
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">CareCircle</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/join">Join Circle</Link>
              </Button>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 animate-pulse text-primary" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">CareCircle</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <TourTrigger page="home" variant="ghost" size="sm" />
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/join">Join Circle</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero-section" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Your Support Network, <span className="text-primary">Always There</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            A private, secure space for cancer patients to share daily updates and coordinate support from loved ones.
            Stay connected with those who care about you most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/join">Join a Circle</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features-section" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">Built for Care and Connection</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Private & Secure</CardTitle>
                <CardDescription>
                  Invite-only groups with secure authentication. Your updates stay within your trusted circle.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <Heart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Daily Check-ins</CardTitle>
                <CardDescription>
                  Share how you're feeling with mood tracking. Your circle gets notified when you need extra support.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Coordinate Help</CardTitle>
                <CardDescription>
                  Task calendar where family and friends can sign up to help with meals, rides, and daily needs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Family Updates</CardTitle>
                <CardDescription>
                  Keep everyone informed without repeating yourself. One update reaches your entire support network.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <Heart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Automatic Alerts</CardTitle>
                <CardDescription>
                  When you're having a tough day, your circle gets notified so they can offer extra support.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Secure Sharing</CardTitle>
                <CardDescription>
                  All communications are private and secure. Your health information stays within your trusted circle.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">Ready to Get Started?</h3>
          <p className="text-lg text-muted-foreground mb-8">
            Join a care circle today and experience the support you deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/join">Join a Circle</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tour Welcome Modal */}
      <TourWelcome 
        page="home" 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
    </div>
  )
}
