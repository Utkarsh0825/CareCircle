// Simple test authentication system
export interface User {
  id: string
  email: string
  name: string
  role: "patient" | "caregiver"
  circleId: string
}

export interface Circle {
  id: string
  name: string
  inviteCode: string
  patientName: string
  members: User[]
}

// Test data
export const TEST_CIRCLE: Circle = {
  id: "circle-1",
  name: "Sarah's Support Circle",
  inviteCode: "123456",
  patientName: "Sarah Johnson",
  members: [
    {
      id: "user-1",
      email: "test@gmail.com",
      name: "Sarah Johnson",
      role: "patient",
      circleId: "circle-1",
    },
    {
      id: "user-2",
      email: "mom@gmail.com",
      name: "Linda Johnson",
      role: "caregiver",
      circleId: "circle-1",
    },
    {
      id: "user-3",
      email: "sister@gmail.com",
      name: "Emma Wilson",
      role: "caregiver",
      circleId: "circle-1",
    },
    {
      id: "user-4",
      email: "friend@gmail.com",
      name: "Michael Chen",
      role: "caregiver",
      circleId: "circle-1",
    },
  ],
}

export const TEST_CREDENTIALS = {
  email: "test@gmail.com",
  code: "123456",
}

// Simple auth functions
export function authenticateUser(email: string, code: string): User | null {
  if (email === TEST_CREDENTIALS.email && code === TEST_CREDENTIALS.code) {
    return TEST_CIRCLE.members[0] // Return Sarah (patient)
  }
  return null
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export function setCurrentUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}

export function getCurrentCircle(): Circle {
  return TEST_CIRCLE
}
