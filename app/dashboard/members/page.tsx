'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Users, Plus, Crown, User, Shield, Trash2, Mail, HelpCircle } from 'lucide-react'
import { getSession, addMemberToGroup, removeMemberFromGroup, updateMemberRole } from '@/lib/session'
import { getRoot, updateRoot } from '@/lib/localStore'
import { TourTrigger } from '@/components/tour/tour-trigger'

export default function MembersPage() {
  const [session, setSession] = useState(getSession())
  const [root, setRoot] = useState(getRoot())
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberRole, setNewMemberRole] = useState<'MEMBER' | 'ADMIN'>('MEMBER')

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

  const canManageMembers = session.role === 'PATIENT' || session.role === 'ADMIN'

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user already exists
    let user = Object.values(root.users).find(u => u.email === newMemberEmail)
    
    if (!user) {
      // Create new user
      const userId = `user-${Date.now()}`
      user = {
        id: userId,
        email: newMemberEmail,
        name: newMemberEmail.split('@')[0]
      }
      
      updateRoot(prev => ({
        ...prev,
        users: { ...prev.users, [userId]: user! }
      }))
    }

    // Add member to group
    addMemberToGroup(user.id, session.group!.id, newMemberRole)
    
    // Reset form
    setNewMemberEmail('')
    setNewMemberRole('MEMBER')
    setShowAddMemberDialog(false)
    setRoot(getRoot())
  }

  const handleRemoveMember = (userId: string) => {
    removeMemberFromGroup(userId, session.group!.id)
    setRoot(getRoot())
  }

  const handleUpdateRole = (userId: string, newRole: 'PATIENT' | 'MEMBER' | 'ADMIN') => {
    updateMemberRole(userId, session.group!.id, newRole)
    setRoot(getRoot())
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'PATIENT': return <Crown className="h-4 w-4" />
      case 'ADMIN': return <Shield className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getRoleVariant = (role: string) => {
    switch (role) {
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
              {activeMembers.map((member) => {
                const isCurrentUser = member.userId === session.user!.id
                const canEditThisMember = canManageMembers && !isCurrentUser && member.role !== 'PATIENT'
                
                return (
                  <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {member.user?.name?.split(' ').map(n => n[0]).join('') || member.user?.email[0].toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {member.user?.name || member.user?.email || 'Unknown'}
                          </span>
                          {isCurrentUser && (
                            <Badge variant="outline" className="text-xs">You</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getRoleVariant(member.role)} className="flex items-center gap-1 text-xs">
                            {getRoleIcon(member.role)}
                            {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {member.user?.email}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {canEditThisMember && (
                      <div id="role-management" className="flex items-center gap-2">
                        <Select 
                          value={member.role} 
                          onValueChange={(value: 'MEMBER' | 'ADMIN') => handleUpdateRole(member.userId, value)}
                        >
                          <SelectTrigger className="w-32">
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
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.user?.name || member.user?.email} from the circle? 
                                They will no longer have access to the group.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleRemoveMember(member.userId)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove Member
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Code Section */}
      <Card id="invite-code-display">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invite Code
          </CardTitle>
          <CardDescription>
            Share this code with people you want to invite to your circle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="bg-muted p-3 rounded-lg text-center">
                <span className="font-mono text-lg tracking-widest">
                  {session.group.inviteCode}
                </span>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(session.group!.inviteCode)
              }}
            >
              Copy Code
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Anyone with this code can join your support circle as a member.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
