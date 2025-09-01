"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, Users, Plus, Copy, Calendar, MessageCircle, Clock, DollarSign, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getSession } from "@/lib/session"
import { getRoot } from "@/lib/localStore"
import { format } from "date-fns"
import { TourTrigger } from "@/components/tour/tour-trigger"

export default function DashboardPage() {
  const [session, setSession] = useState(getSession())
  const [root, setRoot] = useState(getRoot())

  useEffect(() => {
    // Refresh data on mount
    setSession(getSession())
    setRoot(getRoot())
  }, [])

  if (!session.user || !session.group) {
    return <div>Loading...</div>
  }

  // Get latest update
  const latestUpdate = root.updates
    .filter(u => u.groupId === session.group!.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

  // Get unclaimed tasks for today and tomorrow
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const unclaimedTasks = root.tasks
    .filter(t => t.groupId === session.group!.id && 
      (t.taskDate === today || t.taskDate === tomorrow))
    .filter(task => {
      const claimedSlots = root.signups
        .filter(s => s.taskId === task.id && s.status === 'CLAIMED')
        .length
      return claimedSlots < task.slots
    })
    .slice(0, 3)

  // Get recent donations
  const recentDonations = root.donations
    .filter(d => d.groupId === session.group!.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const totalDonations = root.donations
    .filter(d => d.groupId === session.group!.id)
    .reduce((sum, d) => sum + d.amountCents, 0)

  // Get active members
  const activeMembers = root.members
    .filter(m => m.groupId === session.group!.id && m.status === 'ACTIVE')
    .map(m => root.users[m.userId])
    .filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
                      <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Welcome back, {session.user.name || session.user.email}</h1>
                    <p className="text-muted-foreground">
                      Here's what's happening in your care circle today.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/">← Back to Home</Link>
                    </Button>
                    <TourTrigger page="dashboard-home" variant="outline" size="sm" />
                  </div>
                </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Latest Update */}
          {latestUpdate && (
            <Card id="patient-updates">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Latest Update
                </CardTitle>
                <CardDescription>
                  Most recent post from {root.users[latestUpdate.authorId!]?.name || 'a member'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 p-4 bg-muted/30 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {root.users[latestUpdate.authorId!]?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {root.users[latestUpdate.authorId!]?.name || 'Unknown'}
                      </span>
                      <Badge 
                        variant={latestUpdate.mood === 'GOOD' ? 'default' : 
                                latestUpdate.mood === 'OKAY' ? 'secondary' : 'destructive'}
                      >
                        {latestUpdate.mood}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(latestUpdate.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">
                      {latestUpdate.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* What's Needed Now */}
          <Card id="whats-needed-section">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                What's Needed Now
              </CardTitle>
              <CardDescription>
                Unclaimed tasks for today and tomorrow
              </CardDescription>
            </CardHeader>
            <CardContent>
              {unclaimedTasks.length > 0 ? (
                <div className="space-y-3">
                  {unclaimedTasks.map((task) => {
                    const claimedSlots = root.signups
                      .filter(s => s.taskId === task.id && s.status === 'CLAIMED')
                      .length
                    const availableSlots = task.slots - claimedSlots
                    
                    return (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {task.taskDate === today ? 'Today' : 'Tomorrow'} • {task.startTime} • {task.location}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {availableSlots} slot{availableSlots !== 1 ? 's' : ''} available
                          </p>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/dashboard/calendar?date=${task.taskDate}`}>
                            Claim
                          </Link>
                        </Button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tasks need claiming</h3>
                  <p className="text-muted-foreground mb-4">
                    All tasks are covered for now. Great job, team!
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/calendar">View Calendar</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Donations Summary */}
          <Card id="donations-summary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Donations
              </CardTitle>
              <CardDescription>Support received</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ${(totalDonations / 100).toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">Total raised</p>
              </div>
              
              {recentDonations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recent donations:</h4>
                  {recentDonations.map((donation) => (
                    <div key={donation.id} className="flex justify-between text-sm">
                      <span>{root.users[donation.donorUserId!]?.name || 'Anonymous'}</span>
                      <span>${(donation.amountCents / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <Button asChild className="w-full">
                <Link href="/donate">Make a Donation</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Circle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Circle Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Members</span>
                <span className="font-medium">{activeMembers.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Updates</span>
                <span className="font-medium">
                  {root.updates.filter(u => u.groupId === session.group!.id).length}
                </span>
              </div>

              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Invite Code</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(session.group!.inviteCode)
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-muted p-2 rounded text-center font-mono text-lg tracking-widest">
                  {session.group.inviteCode}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Share this code with family and friends</p>
              </div>
            </CardContent>
          </Card>

          {/* Circle Members */}
          <Card id="active-members">
            <CardHeader>
              <CardTitle>Circle Members</CardTitle>
              <CardDescription>Your support network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeMembers.map((member) => {
                  const memberData = root.members.find(m => 
                    m.groupId === session.group!.id && m.userId === member.id
                  )
                  
                  return (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {member.name?.split(' ').map(n => n[0]).join('') || member.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name || member.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {memberData?.role?.toLowerCase()}
                        </p>
                      </div>
                      {memberData?.role === 'PATIENT' && (
                        <Badge variant="secondary" className="text-xs">
                          Patient
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="pt-4 border-t border-border mt-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/members">Manage Members</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
