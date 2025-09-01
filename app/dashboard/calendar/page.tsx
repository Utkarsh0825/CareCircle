'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, CalendarDays, Clock, MapPin, Users, Plus, Download, HelpCircle } from 'lucide-react'
import { getSession } from '@/lib/session'
import { getRoot, updateRoot } from '@/lib/localStore'
import { makeIcs, downloadIcs } from '@/lib/ics'
import { format, addDays, isSameDay, parseISO } from 'date-fns'
import { TourTrigger } from '@/components/tour/tour-trigger'

const TASK_CATEGORIES = [
  'meal', 'delivery', 'laundry', 'ride', 'visit', 'meds', 'other'
]

export default function CalendarPage() {
  const [session, setSession] = useState(getSession())
  const [root, setRoot] = useState(getRoot())
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    category: 'meal',
    details: '',
    taskDate: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    location: '',
    slots: 1
  })

  useEffect(() => {
    setSession(getSession())
    setRoot(getRoot())
  }, [])

  if (!session.user || !session.group) {
    return <div>Loading...</div>
  }

  const tasks = root.tasks
    .filter(t => t.groupId === session.group!.id)
    .sort((a, b) => new Date(a.taskDate).getTime() - new Date(b.taskDate).getTime())

  const tasksForSelectedDate = tasks.filter(t => t.taskDate === selectedDate)

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    
    const task = {
      id: `task-${Date.now()}`,
      groupId: session.group!.id,
      ...newTask,
      createdBy: session.user!.id,
      createdAt: new Date().toISOString()
    }

    updateRoot(prev => ({
      ...prev,
      tasks: [...prev.tasks, task]
    }))

    setNewTask({
      title: '',
      category: 'meal',
      details: '',
      taskDate: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      location: '',
      slots: 1
    })
    setShowNewTaskDialog(false)
    setRoot(getRoot())
  }

  const handleClaimTask = (taskId: string) => {
    const task = root.tasks.find(t => t.id === taskId)
    if (!task) return

    const claimedSlots = root.signups
      .filter(s => s.taskId === taskId && s.status === 'CLAIMED')
      .length

    if (claimedSlots >= task.slots) return

    const signup = {
      taskId,
      userId: session.user!.id,
      status: 'CLAIMED' as const,
      claimedAt: new Date().toISOString()
    }

    updateRoot(prev => ({
      ...prev,
      signups: [...prev.signups, signup]
    }))

    // Send confirmation email
    const taskCreator = root.users[task.createdBy]
    if (taskCreator) {
      const icsEvent = {
        title: task.title,
        start: new Date(`${task.taskDate}T${task.startTime || '00:00'}`),
        end: new Date(`${task.taskDate}T${task.endTime || '23:59'}`),
        description: task.details,
        location: task.location
      }

      const icsContent = makeIcs(icsEvent)
      
      const confirmationMail = {
        id: `mail-${Date.now()}`,
        to: [session.user!.email],
        subject: `Task Claimed: ${task.title}`,
        html: `
          <h2>Task Claimed Successfully</h2>
          <p>You've claimed the task: <strong>${task.title}</strong></p>
          <p><strong>Date:</strong> ${format(new Date(task.taskDate), 'PPP')}</p>
          <p><strong>Time:</strong> ${task.startTime}${task.endTime ? ` - ${task.endTime}` : ''}</p>
          <p><strong>Location:</strong> ${task.location || 'Not specified'}</p>
          <p><strong>Details:</strong> ${task.details || 'No additional details'}</p>
          <p>You can download the calendar event below to add it to your calendar.</p>
        `,
        text: `Task Claimed: ${task.title} on ${format(new Date(task.taskDate), 'PPP')} at ${task.startTime}${task.endTime ? ` - ${task.endTime}` : ''}`,
        createdAt: new Date().toISOString(),
        meta: { 
          type: 'task-claimed',
          icsContent,
          taskId
        }
      }

      updateRoot(prev => ({
        ...prev,
        mailbox: [...prev.mailbox, confirmationMail]
      }))
    }

    setRoot(getRoot())
  }

  const handleUnclaimTask = (taskId: string) => {
    updateRoot(prev => ({
      ...prev,
      signups: prev.signups.filter(s => !(s.taskId === taskId && s.userId === session.user!.id))
    }))

    // Send notification email if within 12 hours of task
    const task = root.tasks.find(t => t.id === taskId)
    if (task) {
      const taskTime = new Date(`${task.taskDate}T${task.startTime || '00:00'}`)
      const now = new Date()
      const hoursUntilTask = (taskTime.getTime() - now.getTime()) / (1000 * 60 * 60)

      if (hoursUntilTask <= 12) {
        const activeMembers = root.members
          .filter(m => m.groupId === session.group!.id && m.status === 'ACTIVE' && m.userId !== session.user!.id)
          .map(m => root.users[m.userId])
          .filter(Boolean)

        const notificationMail = {
          id: `mail-${Date.now()}`,
          to: activeMembers.map(u => u!.email),
          subject: `Slot Reopened: ${task.title}`,
          html: `
            <h2>Task Slot Reopened</h2>
            <p>A slot has been reopened for: <strong>${task.title}</strong></p>
            <p><strong>Date:</strong> ${format(new Date(task.taskDate), 'PPP')}</p>
            <p><strong>Time:</strong> ${task.startTime}${task.endTime ? ` - ${task.endTime}` : ''}</p>
            <p>Please check the calendar if you can help with this task.</p>
          `,
          text: `Slot reopened for ${task.title} on ${format(new Date(task.taskDate), 'PPP')} at ${task.startTime}`,
          createdAt: new Date().toISOString(),
          meta: { type: 'slot-reopened' }
        }

        updateRoot(prev => ({
          ...prev,
          mailbox: [...prev.mailbox, notificationMail]
        }))
      }
    }

    setRoot(getRoot())
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'meal': return '🍽️'
      case 'delivery': return '📦'
      case 'laundry': return '👕'
      case 'ride': return '🚗'
      case 'visit': return '👥'
      case 'meds': return '💊'
      default: return '📋'
    }
  }

  const isTaskClaimed = (taskId: string) => {
    return root.signups.some(s => s.taskId === taskId && s.userId === session.user!.id && s.status === 'CLAIMED')
  }

  const getAvailableSlots = (taskId: string) => {
    const task = root.tasks.find(t => t.id === taskId)
    if (!task) return 0
    const claimedSlots = root.signups.filter(s => s.taskId === taskId && s.status === 'CLAIMED').length
    return task.slots - claimedSlots
  }

  return (
    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Calendar</h1>
                    <p className="text-muted-foreground">
                      View and manage tasks for your support circle
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/dashboard">← Back to Dashboard</Link>
                    </Button>
                    <TourTrigger page="calendar" variant="outline" size="sm" />
                    <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
                      <DialogTrigger asChild>
                        <Button id="create-task-button">
                          <Plus className="h-4 w-4 mr-2" />
                          New Task
                        </Button>
                      </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newTask.category} onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        <span className="mr-2">{getCategoryIcon(category)}</span>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taskDate">Date</Label>
                  <Input
                    id="taskDate"
                    type="date"
                    value={newTask.taskDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, taskDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slots">Slots</Label>
                  <Input
                    id="slots"
                    type="number"
                    min="1"
                    value={newTask.slots}
                    onChange={(e) => setNewTask(prev => ({ ...prev, slots: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newTask.startTime}
                    onChange={(e) => setNewTask(prev => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newTask.endTime}
                    onChange={(e) => setNewTask(prev => ({ ...prev, endTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newTask.location}
                  onChange={(e) => setNewTask(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="details">Details</Label>
                <Textarea
                  id="details"
                  value={newTask.details}
                  onChange={(e) => setNewTask(prev => ({ ...prev, details: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Create Task</Button>
                <Button type="button" variant="outline" onClick={() => setShowNewTaskDialog(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Date Selector */}
      <Card id="date-selector">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="date-select">Select Date:</Label>
            <Input
              id="date-select"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tasks for Selected Date */}
      <Card id="task-list">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Tasks for {format(new Date(selectedDate), 'PPP')}
          </CardTitle>
          <CardDescription>
            {tasksForSelectedDate.length} task{tasksForSelectedDate.length !== 1 ? 's' : ''} scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tasks scheduled</h3>
              <p className="text-muted-foreground mb-4">
                No tasks are scheduled for this date.
              </p>
              <Button onClick={() => setShowNewTaskDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tasksForSelectedDate.map((task) => {
                const claimedSlots = root.signups
                  .filter(s => s.taskId === task.id && s.status === 'CLAIMED')
                  .length
                const availableSlots = task.slots - claimedSlots
                const isClaimed = isTaskClaimed(task.id)
                const taskCreator = root.users[task.createdBy]

                return (
                  <div key={task.id} className={`border rounded-lg p-4 ${task.id === tasksForSelectedDate[0]?.id ? 'claim-task-example' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(task.category)}</span>
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created by {taskCreator?.name || taskCreator?.email || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={availableSlots > 0 ? 'default' : 'secondary'}>
                        {claimedSlots}/{task.slots} claimed
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                      {task.startTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{task.startTime}{task.endTime ? ` - ${task.endTime}` : ''}</span>
                        </div>
                      )}
                      {task.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{task.location}</span>
                        </div>
                      )}
                    </div>

                    {task.details && (
                      <p className="text-sm text-muted-foreground mb-3">{task.details}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">
                          {availableSlots} slot{availableSlots !== 1 ? 's' : ''} available
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {isClaimed ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUnclaimTask(task.id)}
                            >
                              Unclaim
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const icsEvent = {
                                  title: task.title,
                                  start: new Date(`${task.taskDate}T${task.startTime || '00:00'}`),
                                  end: new Date(`${task.taskDate}T${task.endTime || '23:59'}`),
                                  description: task.details,
                                  location: task.location
                                }
                                const icsContent = makeIcs(icsEvent)
                                downloadIcs(icsContent, `${task.title.replace(/\s+/g, '-')}.ics`)
                              }}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download ICS
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm"
                            disabled={availableSlots === 0}
                            onClick={() => handleClaimTask(task.id)}
                          >
                            Claim Task
                          </Button>
                        )}
                      </div>
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
