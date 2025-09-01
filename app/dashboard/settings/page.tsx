'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Settings, Bell, User, Shield, LogOut, Moon, Sun, HelpCircle } from 'lucide-react'
import { getSession, logout } from '@/lib/session'
import { getRoot, updateRoot } from '@/lib/localStore'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { TourTrigger } from '@/components/tour/tour-trigger'
import Link from 'next/link'

export default function SettingsPage() {
  const [session, setSession] = useState(getSession())
  const [root, setRoot] = useState(getRoot())
  const [userName, setUserName] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const currentSession = getSession()
    const currentRoot = getRoot()
    setSession(currentSession)
    setRoot(currentRoot)
    if (currentSession.user) {
      setUserName(currentSession.user.name || '')
    }
  }, [])

  if (!session.user || !session.group || !mounted) {
    return <div>Loading...</div>
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      updateRoot(prev => ({
        ...prev,
        users: {
          ...prev.users,
          [session.user!.id]: {
            ...prev.users[session.user!.id],
            name: userName.trim() || undefined
          }
        }
      }))

      setSession(getSession())
      setRoot(getRoot())
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/signin')
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'PATIENT':
        return 'You are the patient and have full control over the circle'
      case 'ADMIN':
        return 'You can manage members and moderate the circle'
      case 'MEMBER':
        return 'You can view and participate in the circle'
      default:
        return 'Standard member permissions'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and notification preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
          <TourTrigger page="settings" variant="outline" size="sm" />
        </div>
      </div>

      {/* Profile Settings */}
      <Card id="profile-settings">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={session.user.email}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                Email address cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
              />
              <p className="text-sm text-muted-foreground">
                This name will be displayed to other circle members
              </p>
            </div>

            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card id="appearance-settings">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {theme === 'dark' ? (
              <>
                <Moon className="h-4 w-4" />
                <span>Dark mode is enabled</span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                <span>Light mode is enabled</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card id="notification-settings">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Control how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications in the Dev Mailbox
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <Separator />
          
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">You'll receive emails for:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Bad day alerts from circle members</li>
              <li>Task claim confirmations</li>
              <li>Slot reopening notifications</li>
              <li>Donation receipts</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card id="account-info">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details and permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Circle</Label>
            <p className="font-medium">{session.group.name}</p>
          </div>

          <div className="space-y-2">
            <Label>Your Role</Label>
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize">{session.role?.toLowerCase()}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {getRoleDescription(session.role!)}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Member Since</Label>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sign Out</Label>
              <p className="text-sm text-muted-foreground">
                Sign out of your account
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Demo Information</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <p className="text-sm mb-2">
            This is a local demo application. All data is stored in your browser's localStorage.
          </p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Data persists across browser sessions</li>
            <li>No external services or databases are used</li>
            <li>Emails are simulated in the Dev Mailbox</li>
            <li>Donations are recorded locally only</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
