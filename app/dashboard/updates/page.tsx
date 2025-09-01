'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MessageCircle, Smile, Meh, Frown, AlertTriangle, HelpCircle } from 'lucide-react'
import { getSession } from '@/lib/session'
import { getRoot, updateRoot } from '@/lib/localStore'
import { format } from 'date-fns'
import { TourTrigger } from '@/components/tour/tour-trigger'

export default function UpdatesPage() {
  const [session, setSession] = useState(getSession())
  const [root, setRoot] = useState(getRoot())
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<'GOOD' | 'OKAY' | 'BAD'>('OKAY')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    setSession(getSession())
    setRoot(getRoot())
  }, [])

  if (!session.user || !session.group) {
    return <div>Loading...</div>
  }

  const updates = root.updates
    .filter(u => u.groupId === session.group!.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const newUpdate = {
        id: `update-${Date.now()}`,
        groupId: session.group!.id,
        authorId: session.user!.id,
        mood,
        content: content.trim(),
        createdAt: new Date().toISOString(),
        visibility: 'members' as const
      }

      // Add update to storage
      updateRoot(prev => ({
        ...prev,
        updates: [newUpdate, ...prev.updates]
      }))

      // Check if this is a bad day and should trigger alert
      if (mood === 'BAD') {
        const lastAlertAt = root.session?.lastAlertAt
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        
        if (!lastAlertAt || lastAlertAt < twelveHoursAgo) {
          // Send bad day alert
          const activeMembers = root.members
            .filter(m => m.groupId === session.group!.id && m.status === 'ACTIVE')
            .map(m => root.users[m.userId])
            .filter(Boolean)

          const alertMail = {
            id: `mail-${Date.now()}`,
            to: activeMembers.map(u => u!.email),
            subject: 'Bad Day Alert: Let\'s Rally Today',
            html: `
              <h2>Bad Day Alert</h2>
              <p>${session.user.name || session.user.email} is having a difficult day and could use extra support.</p>
              <p><strong>Update:</strong> ${content}</p>
              <p>Please check the calendar for any unclaimed tasks today and consider reaching out with extra support.</p>
              <p><a href="/dashboard/calendar?filter=unclaimed&date=${new Date().toISOString().split('T')[0]}">View Today's Tasks</a></p>
            `,
            text: `Bad Day Alert: ${session.user.name || session.user.email} is having a difficult day. Please check the calendar for unclaimed tasks and consider reaching out with extra support.`,
            createdAt: new Date().toISOString(),
            meta: { type: 'bad-day-alert' }
          }

          updateRoot(prev => ({
            ...prev,
            mailbox: [...prev.mailbox, alertMail],
            session: { ...prev.session, lastAlertAt: new Date().toISOString() }
          }))

          setShowAlert(true)
          setTimeout(() => setShowAlert(false), 5000)
        }
      }

      // Reset form
      setContent('')
      setMood('OKAY')
      
      // Refresh data
      setRoot(getRoot())
    } catch (error) {
      console.error('Failed to post update:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'GOOD': return <Smile className="h-4 w-4" />
      case 'OKAY': return <Meh className="h-4 w-4" />
      case 'BAD': return <Frown className="h-4 w-4" />
      default: return <Meh className="h-4 w-4" />
    }
  }

  const getMoodVariant = (mood: string) => {
    switch (mood) {
      case 'GOOD': return 'default'
      case 'OKAY': return 'secondary'
      case 'BAD': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
                      <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Daily Updates</h1>
                    <p className="text-muted-foreground">
                      Share how you're feeling and keep your support circle updated.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard">← Back to Dashboard</Link>
                    </Button>
                    <TourTrigger page="updates" variant="outline" size="sm" />
                  </div>
                </div>

      {showAlert && (
        <Alert id="bad-day-info">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Bad day alert sent to your support circle. They'll be notified to check for unclaimed tasks today.
          </AlertDescription>
        </Alert>
      )}

      {/* Post Update Form */}
      <Card id="update-composer">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Share Your Update
          </CardTitle>
          <CardDescription>
            Let your support circle know how you're doing today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div id="mood-selection" className="space-y-2">
              <Label>How are you feeling today?</Label>
              <RadioGroup value={mood} onValueChange={(value: 'GOOD' | 'OKAY' | 'BAD') => setMood(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="GOOD" id="good" />
                  <Label htmlFor="good" className="flex items-center gap-2 cursor-pointer">
                    <Smile className="h-4 w-4 text-green-600" />
                    Good
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="OKAY" id="okay" />
                  <Label htmlFor="okay" className="flex items-center gap-2 cursor-pointer">
                    <Meh className="h-4 w-4 text-yellow-600" />
                    Okay
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="BAD" id="bad" />
                  <Label htmlFor="bad" className="flex items-center gap-2 cursor-pointer">
                    <Frown className="h-4 w-4 text-red-600" />
                    Bad
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">What would you like to share?</Label>
              <Textarea
                id="content"
                placeholder="Share how you're feeling, what you need help with, or any updates..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />
            </div>

            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? 'Posting...' : 'Post Update'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Updates Feed */}
      <Card id="update-history">
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>
            Latest posts from your support circle
          </CardDescription>
        </CardHeader>
        <CardContent>
          {updates.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No updates yet</h3>
              <p className="text-muted-foreground">
                Be the first to share how you're doing today.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {updates.map((update) => {
                const author = root.users[update.authorId!]
                return (
                  <div key={update.id} className="flex gap-3 p-4 bg-muted/30 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {author?.name?.split(' ').map(n => n[0]).join('') || author?.email[0].toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {author?.name || author?.email || 'Unknown'}
                        </span>
                        <Badge variant={getMoodVariant(update.mood)} className="flex items-center gap-1">
                          {getMoodIcon(update.mood)}
                          {update.mood}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(update.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">
                        {update.content}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
