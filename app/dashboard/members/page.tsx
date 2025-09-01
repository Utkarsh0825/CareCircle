'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Users, Plus, Shield, User, Copy, Check } from 'lucide-react'
import { getSession } from '@/lib/session'
import { getRoot, updateRoot } from '@/lib/localStore'
import { TourTrigger } from '@/components/tour/tour-trigger'
import Link from 'next/link'

export default function MembersPage() {
  const [session, setSession] = useState(getSession())
  const [root, setRoot] = useState(getRoot())
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberRole, setNewMemberRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER')
  const [copiedInviteCode, setCopiedInviteCode] = useState(false)

  useEffect(() => {
    setSession(getSession())
    setRoot(getRoot())
  }, [])

  if (!session.user || !session.group) {
    return <div>Loading...</div>
  }

  const activeMembers = root.members
    .filter(m => m.groupId === session.group!.id && m.status === 'ACTIVE')
    .map(m => ({
      ...m,
      user: root.users[m.userId]
    }))
    .filter(m => m.user)

  const canManageMembers = session.user.role === 'ADMIN' || session.user.role === 'CAREGIVER'

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Find or create user
    let userId = Object.keys(root.users).find(id => root.users[id].email === newMemberEmail)
    
    if (!userId) {
      userId = `user-${Date.now()}`
      updateRoot(prev => ({
        ...prev,
        users: {
          ...prev.users,
          [userId]: {
            id: userId,
            email: newMemberEmail,
            name: newMemberEmail.split('@')[0],
            createdAt: new Date().toISOString()
          }
        }
      }))
    }

    // Add member to group
    const member = {
      userId,
      groupId: session.group!.id,
      role: newMemberRole,
      status: 'ACTIVE' as const,
      joinedAt: new Date().toISOString()
    }

    updateRoot(prev => ({
      ...prev,
      members: [...prev.members, member]
    }))

    setNewMemberEmail('')
    setNewMemberRole('MEMBER')
    setShowAddMemberDialog(false)
    setRoot(getRoot())
  }

  const handleRemoveMember = (memberId: string) => {
    updateRoot(prev => ({
      ...prev,
      members: prev.members.map(m => 
        m.userId === memberId && m.groupId === session.group!.id
          ? { ...m, status: 'INACTIVE' }
          : m
      )
    }))
    setRoot(getRoot())
  }

  const handleUpdateRole = (memberId: string, newRole: 'MEMBER' | 'ADMIN') => {
    updateRoot(prev => ({
      ...prev,
      members: prev.members.map(m => 
        m.userId === memberId && m.groupId === session.group!.id
          ? { ...m, role: newRole }
          : m
      )
    }))
    setRoot(getRoot())
  }

  const copyInviteCode = async () => {
    const inviteCode = session.group!.inviteCode
    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopiedInviteCode(true)
      setTimeout(() => setCopiedInviteCode(false), 2000)
    } catch (err) {
      console.error('Failed to copy invite code:', err)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'CAREGIVER': return 'default'
      case 'PATIENT': return 'default'
      case 'ADMIN': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Members</h1>
          <p className="text-muted-foreground">
            Manage your support circle members and their roles
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
          <TourTrigger page="members" variant="outline" size="sm" />
          {canManageMembers && (
            <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Member</DialogTitle>
                </DialogHeader>
                <form id="add-member-section" onSubmit={handleAddMember} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="member@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newMemberRole} onValueChange={(value: 'MEMBER' | 'ADMIN') => setNewMemberRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Member
                          </div>
                        </SelectItem>
                        <SelectItem value="ADMIN">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">Add Member</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddMemberDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Members List */}
      <Card id="member-list">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Circle Members
          </CardTitle>
          <CardDescription>
            {activeMembers.length} active member{activeMembers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No members yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding members to your support circle.
              </p>
              {canManageMembers && (
                <Button onClick={() => setShowAddMemberDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Member
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {activeMembers.map(member => (
                <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {member.user.name?.charAt(0) || member.user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{member.user.name || 'Unnamed User'}</div>
                      <div className="text-sm text-muted-foreground">{member.user.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={getRoleBadgeVariant(member.role)}>
                      {member.role === 'ADMIN' && <Shield className="h-3 w-3 mr-1" />}
                      {member.role === 'CAREGIVER' && <User className="h-3 w-3 mr-1" />}
                      {member.role === 'PATIENT' && <User className="h-3 w-3 mr-1" />}
                      {member.role}
                    </Badge>
                    
                    {canManageMembers && member.userId !== session.user.id && (
                      <div className="flex gap-2">
                        <Select 
                          value={member.role} 
                          onValueChange={(value: 'MEMBER' | 'ADMIN') => handleUpdateRole(member.userId, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MEMBER">Member</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">Remove</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.user.name || member.user.email} from the support circle? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRemoveMember(member.userId)}>
                                Remove Member
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Code */}
      <Card id="invite-code-display">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Invite New Members
          </CardTitle>
          <CardDescription>
            Share this invite code with people you want to add to your support circle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              value={session.group.inviteCode}
              readOnly
              className="font-mono"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={copyInviteCode}
              className="min-w-[100px]"
            >
              {copiedInviteCode ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            New members can use this code to join your support circle.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
