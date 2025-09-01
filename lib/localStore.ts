// Local storage shim with SSR fallback
const ROOT_KEY = 'carecircle:v1'

// In-memory fallback for SSR
let memoryStore: Map<string, any> | null = null

function getMemoryStore(): Map<string, any> {
  if (!memoryStore) {
    memoryStore = new Map()
  }
  return memoryStore
}

// Data model types
export type Role = 'PATIENT' | 'MEMBER' | 'ADMIN'
export type Mood = 'GOOD' | 'OKAY' | 'BAD'
export type TaskStatus = 'OPEN' | 'CLAIMED' | 'COMPLETED' | 'CANCELLED'
export type AlertType = 'BAD_DAY' | 'SCHEDULE_CHANGE' | 'GENERAL'

export interface User {
  id: string
  email: string
  name?: string
}

export interface Group {
  id: string
  name: string
  description?: string
  inviteCode: string
  createdAt: string
}

export interface GroupMember {
  groupId: string
  userId: string
  role: Role
  status: 'ACTIVE' | 'PENDING' | 'REMOVED'
  joinedAt: string
}

export interface Task {
  id: string
  groupId: string
  title: string
  category: string
  details?: string
  taskDate: string
  startTime?: string
  endTime?: string
  location?: string
  slots: number
  createdBy: string
  createdAt: string
}

export interface TaskSignup {
  taskId: string
  userId: string
  notes?: string
  status: TaskStatus
  claimedAt: string
}

export interface Update {
  id: string
  groupId: string
  authorId?: string
  mood: Mood
  content?: string
  createdAt: string
  visibility: 'members'
}

export interface Donation {
  id: string
  groupId: string
  donorUserId?: string
  amountCents: number
  currency: 'USD'
  status: 'recorded'
  createdAt: string
}

export interface Invite {
  code: string
  groupId: string
  emails?: string[]
  createdAt: string
}

export interface Mail {
  id: string
  to: string[]
  subject: string
  html: string
  text?: string
  createdAt: string
  meta?: Record<string, any>
}

export interface Root {
  users: Record<string, User>
  groups: Record<string, Group>
  members: GroupMember[]
  tasks: Task[]
  signups: TaskSignup[]
  updates: Update[]
  donations: Donation[]
  invites: Invite[]
  mailbox: Mail[]
  session?: {
    userId?: string
    groupId?: string
    lastAlertAt?: string
  }
  meta: {
    seeded: boolean
    version: string
  }
}

// Storage functions
export function get<T>(key: string, fallback: T): T {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${ROOT_KEY}:${key}`)
      return stored ? JSON.parse(stored) : fallback
    } catch {
      return fallback
    }
  } else {
    // SSR fallback
    const store = getMemoryStore()
    return store.has(key) ? store.get(key) : fallback
  }
}

export function set<T>(key: string, value: T): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${ROOT_KEY}:${key}`, JSON.stringify(value))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  } else {
    // SSR fallback
    const store = getMemoryStore()
    store.set(key, value)
  }
}

export function update<T>(key: string, fn: (prev: T) => T, fallback: T): T {
  const current = get(key, fallback)
  const updated = fn(current)
  set(key, updated)
  return updated
}

// Root data management
export function getRoot(): Root {
  return get('root', {
    users: {},
    groups: {},
    members: [],
    tasks: [],
    signups: [],
    updates: [],
    donations: [],
    invites: [],
    mailbox: [],
    session: {},
    meta: {
      seeded: false,
      version: '1.0.0'
    }
  })
}

export function setRoot(root: Root): void {
  set('root', root)
}

export function updateRoot(fn: (prev: Root) => Root): Root {
  return update('root', fn, {
    users: {},
    groups: {},
    members: [],
    tasks: [],
    signups: [],
    updates: [],
    donations: [],
    invites: [],
    mailbox: [],
    session: {},
    meta: {
      seeded: false,
      version: '1.0.0'
    }
  })
}

// Seed data function
export function seedIfEmpty(): void {
  const root = getRoot()
  
  if (root.meta.seeded) {
    return
  }

  const now = new Date().toISOString()
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const dayAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()

  // Create demo group
  const demoGroup: Group = {
    id: 'group-1',
    name: 'Care Circle',
    description: 'A supportive community for cancer patients and their loved ones',
    inviteCode: 'CARE-1234',
    createdAt: now
  }

  // Create demo users
  const demoUsers: Record<string, User> = {
    'user-1': {
      id: 'user-1',
      email: 'sarah@example.com',
      name: 'Sarah Johnson'
    },
    'user-2': {
      id: 'user-2',
      email: 'linda@example.com',
      name: 'Linda Johnson'
    },
    'user-3': {
      id: 'user-3',
      email: 'emma@example.com',
      name: 'Emma Wilson'
    },
    'user-4': {
      id: 'user-4',
      email: 'michael@example.com',
      name: 'Michael Chen'
    }
  }

  // Create group members
  const demoMembers: GroupMember[] = [
    {
      groupId: 'group-1',
      userId: 'user-1',
      role: 'PATIENT',
      status: 'ACTIVE',
      joinedAt: now
    },
    {
      groupId: 'group-1',
      userId: 'user-2',
      role: 'MEMBER',
      status: 'ACTIVE',
      joinedAt: now
    },
    {
      groupId: 'group-1',
      userId: 'user-3',
      role: 'MEMBER',
      status: 'ACTIVE',
      joinedAt: now
    },
    {
      groupId: 'group-1',
      userId: 'user-4',
      role: 'ADMIN',
      status: 'ACTIVE',
      joinedAt: now
    }
  ]

  // Create demo tasks
  const demoTasks: Task[] = [
    {
      id: 'task-1',
      groupId: 'group-1',
      title: 'Meal delivery',
      category: 'meal',
      details: 'Please bring dinner around 6 PM',
      taskDate: tomorrow.split('T')[0],
      startTime: '18:00',
      endTime: '19:00',
      location: 'Home',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now
    },
    {
      id: 'task-2',
      groupId: 'group-1',
      title: 'Ride to doctor appointment',
      category: 'ride',
      details: 'Appointment at 2 PM, need help with transportation',
      taskDate: dayAfter.split('T')[0],
      startTime: '13:30',
      endTime: '15:30',
      location: 'Medical Center',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now
    },
    {
      id: 'task-3',
      groupId: 'group-1',
      title: 'Laundry help',
      category: 'laundry',
      details: 'Need help with washing and folding clothes',
      taskDate: tomorrow.split('T')[0],
      startTime: '10:00',
      endTime: '12:00',
      location: 'Home',
      slots: 2,
      createdBy: 'user-1',
      createdAt: now
    },
    {
      id: 'task-4',
      groupId: 'group-1',
      title: 'Medication pickup',
      category: 'meds',
      details: 'Pick up prescription from pharmacy',
      taskDate: now.split('T')[0],
      startTime: '14:00',
      endTime: '15:00',
      location: 'Local Pharmacy',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now
    },
    {
      id: 'task-5',
      groupId: 'group-1',
      title: 'Visit and chat',
      category: 'visit',
      details: 'Just need some company and conversation',
      taskDate: dayAfter.split('T')[0],
      startTime: '16:00',
      endTime: '17:00',
      location: 'Home',
      slots: 1,
      createdBy: 'user-1',
      createdAt: now
    }
  ]

  // Create demo updates
  const demoUpdates: Update[] = [
    {
      id: 'update-1',
      groupId: 'group-1',
      authorId: 'user-1',
      mood: 'OKAY',
      content: 'Feeling a bit tired today but managing okay. Thank you everyone for your support.',
      createdAt: now,
      visibility: 'members'
    },
    {
      id: 'update-2',
      groupId: 'group-1',
      authorId: 'user-1',
      mood: 'GOOD',
      content: 'Had a good day today! Energy levels were better and managed to take a short walk.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      visibility: 'members'
    }
  ]

  // Create demo donation
  const demoDonation: Donation = {
    id: 'donation-1',
    groupId: 'group-1',
    donorUserId: 'user-2',
    amountCents: 5000, // $50.00
    currency: 'USD',
    status: 'recorded',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }

  // Create demo invite
  const demoInvite: Invite = {
    code: 'CARE-1234',
    groupId: 'group-1',
    createdAt: now
  }

  // Create demo mail
  const demoMail: Mail = {
    id: 'mail-1',
    to: ['linda@example.com', 'emma@example.com', 'michael@example.com'],
    subject: 'Welcome to Care Circle',
    html: '<p>Welcome to our care circle! We\'re here to support each other.</p>',
    text: 'Welcome to our care circle! We\'re here to support each other.',
    createdAt: now,
    meta: { type: 'welcome' }
  }

  // Update root with seeded data
  setRoot({
    users: demoUsers,
    groups: { [demoGroup.id]: demoGroup },
    members: demoMembers,
    tasks: demoTasks,
    signups: [],
    updates: demoUpdates,
    donations: [demoDonation],
    invites: [demoInvite],
    mailbox: [demoMail],
    session: {},
    meta: {
      seeded: true,
      version: '1.0.0'
    }
  })
}

