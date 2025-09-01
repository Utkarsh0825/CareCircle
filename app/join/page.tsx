'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, Users, ArrowRight, Moon, Sun, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { getRoot, updateRoot } from '@/lib/localStore'
import { login, addMemberToGroup, selectGroup } from '@/lib/session'
import { useTheme } from 'next-themes'
import { TourTrigger } from '@/components/tour/tour-trigger'

export default function JoinPage() {
  const [inviteCode, setInviteCode] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState<'code' | 'email'>('code')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const root = getRoot()
    
    // Check if invite code exists
    const invite = root.invites.find(i => i.code === inviteCode)
    const group = Object.values(root.groups).find(g => g.inviteCode === inviteCode)
    
    if (!invite && !group) {
      setError('Invalid invite code. Please check and try again.')
      return
    }

    setStep('email')
    setError('')
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const root = getRoot()
      const group = Object.values(root.groups).find(g => g.inviteCode === inviteCode)
      
      if (!group) {
        setError('Invalid invite code')
        return
      }

      // Login or create user
      const user = login(email)
      
      // Add user to group
      addMemberToGroup(user.id, group.id, 'MEMBER')
      
      // Select the group
      selectGroup(group.id)
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Failed to join group. Please try again.')
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
                    <TourTrigger page="join" variant="ghost" size="sm" className="ml-2" />
                  </div>

        <Card className="border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join a Care Circle</CardTitle>
            <CardDescription>
              {step === 'code' 
                ? 'Enter your invite code to join a support circle'
                : 'Enter your email to complete joining'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'code' ? (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteCode">Invite Code</Label>
                  <Input
                    id="invite-code-input"
                    type="text"
                    placeholder="e.g., CARE-1234"
                    className="bg-input border-border"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Demo: Use <code className="bg-muted px-1 rounded">CARE-1234</code>
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email-input"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-input border-border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('code')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Joining...' : 'Join Circle'}
                  </Button>
                </div>
              </form>
            )}

            {error && (
              <div className="text-center text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
