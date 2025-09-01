'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface TourStep {
  id: string
  title: string
  content: string
  target: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  page: string
}

export interface TourState {
  isActive: boolean
  currentStep: number
  steps: TourStep[]
  isCompleted: boolean
  isSkipped: boolean
}

interface TourContextType {
  tourState: TourState
  startTour: (page: string) => void
  nextStep: () => void
  previousStep: () => void
  skipTour: () => void
  completeTour: () => void
  resetTour: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function useTour() {
  const context = useContext(TourContext)
  if (!context) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}

interface TourProviderProps {
  children: React.ReactNode
}

export function TourProvider({ children }: TourProviderProps) {
  const [tourState, setTourState] = useState<TourState>({
    isActive: false,
    currentStep: 0,
    steps: [],
    isCompleted: false,
    isSkipped: false,
  })

  // Load tour state from localStorage
  useEffect(() => {
    const savedTourState = localStorage.getItem('carecircle-tour-state')
    if (savedTourState) {
      try {
        const parsed = JSON.parse(savedTourState)
        setTourState(prev => ({ ...prev, ...parsed }))
      } catch (e) {
        console.error('Failed to parse tour state:', e)
      }
    }
  }, [])

  // Save tour state to localStorage
  useEffect(() => {
    localStorage.setItem('carecircle-tour-state', JSON.stringify({
      isCompleted: tourState.isCompleted,
      isSkipped: tourState.isSkipped,
    }))
  }, [tourState.isCompleted, tourState.isSkipped])

  const startTour = (page: string) => {
    const steps = getTourSteps(page)
    setTourState(prev => ({
      ...prev,
      isActive: true,
      currentStep: 0,
      steps,
      isCompleted: false,
      isSkipped: false,
    }))
  }

  const nextStep = () => {
    setTourState(prev => {
      if (prev.currentStep < prev.steps.length - 1) {
        return { ...prev, currentStep: prev.currentStep + 1 }
      } else {
        return { ...prev, isActive: false, isCompleted: true }
      }
    })
  }

  const previousStep = () => {
    setTourState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }))
  }

  const skipTour = () => {
    setTourState(prev => ({
      ...prev,
      isActive: false,
      isSkipped: true,
    }))
  }

  const completeTour = () => {
    setTourState(prev => ({
      ...prev,
      isActive: false,
      isCompleted: true,
    }))
  }

  const resetTour = () => {
    setTourState(prev => ({
      ...prev,
      isCompleted: false,
      isSkipped: false,
    }))
  }

  const value: TourContextType = {
    tourState,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    resetTour,
  }

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  )
}

// Tour steps for each page
function getTourSteps(page: string): TourStep[] {
  switch (page) {
    case 'home':
      return [
        {
          id: 'hero-section',
          title: 'Welcome to CareCircle',
          content: 'This is your main landing page. Learn about our key features below.',
          target: 'hero-section',
          position: 'bottom',
          page: 'home',
        },
        {
          id: 'features-grid',
          title: 'Key Features',
          content: 'These cards show our main features: privacy, daily updates, task coordination, and family support.',
          target: 'features-section',
          position: 'top',
          page: 'home',
        },
        {
          id: 'cta-buttons',
          title: 'Get Started',
          content: 'Use "Join a Circle" if you have an invite code, or "Sign In" if you already have an account.',
          target: 'cta-section',
          position: 'top',
          page: 'home',
        },
      ]
    
    case 'join':
      return [
        {
          id: 'invite-code',
          title: 'Enter Invite Code',
          content: 'Type the invite code you received. Demo: Use CARE-1234',
          target: 'invite-code-input',
          position: 'bottom',
          page: 'join',
        },
        {
          id: 'email-input',
          title: 'Add Your Email',
          content: 'Enter your email to create an account or sign in.',
          target: 'email-input',
          position: 'top',
          page: 'join',
        },
      ]
    
    case 'signin':
      return [
        {
          id: 'signin-form',
          title: 'Welcome Back',
          content: 'Enter your email to access your care circles. New users will be redirected to join a circle.',
          target: 'signin-form',
          position: 'top',
          page: 'signin',
        },
      ]
    
    case 'dashboard':
      return [
        {
          id: 'dashboard-header',
          title: 'Dashboard Header',
          content: 'See your circle name, user info, and quick access buttons.',
          target: 'dashboard-header',
          position: 'bottom',
          page: 'dashboard',
        },
        {
          id: 'sidebar-navigation',
          title: 'Navigation Menu',
          content: 'Click these to go to: Home, Calendar, Updates, Members, Settings.',
          target: 'sidebar-navigation',
          position: 'right',
          page: 'dashboard',
        },
        {
          id: 'theme-toggle',
          title: 'Theme Toggle',
          content: 'Click to switch between light and dark themes.',
          target: 'theme-toggle',
          position: 'left',
          page: 'dashboard',
        },
        {
          id: 'dev-mailbox',
          title: 'Email Inbox',
          content: 'View all simulated emails sent within the app.',
          target: 'dev-mailbox-link',
          position: 'bottom',
          page: 'dashboard',
        },
      ]
    
    case 'dashboard-home':
      return [
        {
          id: 'patient-updates',
          title: 'Patient Updates',
          content: 'See the latest mood and update from the patient.',
          target: 'patient-updates',
          position: 'bottom',
          page: 'dashboard-home',
        },
        {
          id: 'whats-needed',
          title: 'Tasks Needing Help',
          content: 'Quick view of unclaimed tasks. Click "Claim" to volunteer.',
          target: 'whats-needed-section',
          position: 'top',
          page: 'dashboard-home',
        },
        {
          id: 'donations-summary',
          title: 'Donations',
          content: 'Track financial support received by your circle.',
          target: 'donations-summary',
          position: 'top',
          page: 'dashboard-home',
        },
        {
          id: 'active-members',
          title: 'Circle Members',
          content: 'See who\'s active in your support circle.',
          target: 'active-members',
          position: 'top',
          page: 'dashboard-home',
        },
      ]
    
    case 'calendar':
      return [
        {
          id: 'date-selector',
          title: 'Pick a Date',
          content: 'Select a date to see tasks for that day.',
          target: 'date-selector',
          position: 'bottom',
          page: 'calendar',
        },
        {
          id: 'task-list',
          title: 'View Tasks',
          content: 'See all tasks for the selected date with details and available slots.',
          target: 'task-list',
          position: 'top',
          page: 'calendar',
        },
        {
          id: 'create-task',
          title: 'Add New Task',
          content: 'Click to create tasks that need help from circle members.',
          target: 'create-task-button',
          position: 'bottom',
          page: 'calendar',
        },
        {
          id: 'claim-task',
          title: 'Volunteer for Tasks',
          content: 'Click "Claim Task" to volunteer. You\'ll get a calendar file to download.',
          target: 'claim-task-example',
          position: 'left',
          page: 'calendar',
        },
      ]
    
    case 'updates':
      return [
        {
          id: 'mood-tracking',
          title: 'How Are You Feeling?',
          content: 'Select your mood: GOOD, OKAY, or BAD.',
          target: 'mood-selection',
          position: 'bottom',
          page: 'updates',
        },
        {
          id: 'update-composer',
          title: 'Share Update',
          content: 'Write about your day or what you need help with.',
          target: 'update-composer',
          position: 'top',
          page: 'updates',
        },
        {
          id: 'bad-day-alerts',
          title: 'Bad Day Alerts',
          content: 'BAD mood automatically notifies your circle for extra support.',
          target: 'bad-day-info',
          position: 'right',
          page: 'updates',
        },
        {
          id: 'update-history',
          title: 'Past Updates',
          content: 'See all updates from circle members by date and mood.',
          target: 'update-history',
          position: 'top',
          page: 'updates',
        },
      ]
    
    case 'members':
      return [
        {
          id: 'member-list',
          title: 'Circle Members',
          content: 'See all active members, their roles, and when they joined.',
          target: 'member-list',
          position: 'top',
          page: 'members',
        },
        {
          id: 'add-member',
          title: 'Add New Members',
          content: 'Invite new people by email. They\'ll get automatic access.',
          target: 'add-member-section',
          position: 'bottom',
          page: 'members',
        },
        {
          id: 'role-management',
          title: 'Manage Roles',
          content: 'Change roles: PATIENT (full control), ADMIN (manage), MEMBER (participate).',
          target: 'role-management',
          position: 'right',
          page: 'members',
        },
        {
          id: 'invite-code',
          title: 'Share Invite Code',
          content: 'Use this code to invite new members to your circle.',
          target: 'invite-code-display',
          position: 'bottom',
          page: 'members',
        },
      ]
    
    case 'settings':
      return [
        {
          id: 'profile-settings',
          title: 'Profile Settings',
          content: 'Update your display name and account info.',
          target: 'profile-settings',
          position: 'top',
          page: 'settings',
        },
        {
          id: 'appearance-settings',
          title: 'Theme Settings',
          content: 'Switch between light and dark themes.',
          target: 'appearance-settings',
          position: 'top',
          page: 'settings',
        },
        {
          id: 'notification-settings',
          title: 'Email Notifications',
          content: 'Control which emails you receive in the Dev Mailbox.',
          target: 'notification-settings',
          position: 'top',
          page: 'settings',
        },
        {
          id: 'account-info',
          title: 'Account Info',
          content: 'View your circle, role, and membership details.',
          target: 'account-info',
          position: 'top',
          page: 'settings',
        },
      ]
    
    case 'donate':
      return [
        {
          id: 'amount-selection',
          title: 'Pick Amount',
          content: 'Choose preset amount or enter custom amount.',
          target: 'amount-selection',
          position: 'top',
          page: 'donate',
        },
        {
          id: 'donation-process',
          title: 'Complete Donation',
          content: 'Your donation is recorded locally with email receipt.',
          target: 'donation-form',
          position: 'top',
          page: 'donate',
        },
      ]
    
    case 'dev-mailbox':
      return [
        {
          id: 'mailbox-overview',
          title: 'Email Inbox',
          content: 'View all simulated emails sent within the app.',
          target: 'mailbox-overview',
          position: 'top',
          page: 'dev-mailbox',
        },
        {
          id: 'email-types',
          title: 'Email Types',
          content: 'See: bad day alerts, task confirmations, slot reopenings, donation receipts.',
          target: 'email-types',
          position: 'top',
          page: 'dev-mailbox',
        },
      ]
    
    default:
      return []
  }
}
