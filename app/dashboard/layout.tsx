'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, logout } from '@/lib/session'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Home, 
  Calendar, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Heart,
  Mail,
  Moon,
  Sun,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { TourTrigger } from '@/components/tour/tour-trigger'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState(getSession())
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check session on mount and redirect if needed
    const currentSession = getSession()
    setSession(currentSession)
    
    if (!currentSession.user || !currentSession.group) {
      router.push('/auth/signin')
      return
    }
    
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/auth/signin')
  }

  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-8 w-8 mx-auto mb-4 animate-pulse" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session.user || !session.group) {
    return null // Will redirect
  }

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Updates', href: '/dashboard/updates', icon: MessageSquare },
    { name: 'Members', href: '/dashboard/members', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header id="dashboard-header" className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                          <Heart className="h-6 w-6 text-primary" />
                          <span className="font-semibold text-lg">CareCircle</span>
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          {session.group.name}
                        </div>
                      </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Signed in as:</span>
                <span className="ml-1 font-medium">{session.user.name || session.user.email}</span>
              </div>
              <Button
                id="theme-toggle"
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Link href="/dev-mailbox">
                <Button id="dev-mailbox-link" variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Dev Mailbox
                </Button>
              </Link>
              <TourTrigger page="dashboard" variant="outline" size="sm" />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-card border-r">
          <nav id="sidebar-navigation" className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card py-4 px-6">
        <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div>
            <Link href="/dev-mailbox" className="hover:text-foreground">
              Developer Mailbox (Local Emails)
            </Link>
          </div>
          <div>
            CareCircle Demo - All data stored locally
          </div>
        </div>
      </footer>
    </div>
  )
}
