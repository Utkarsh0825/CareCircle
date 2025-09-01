'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTour } from './tour-provider'
import { Play, X, HelpCircle, Heart } from 'lucide-react'

interface TourWelcomeProps {
  page: string
  isOpen: boolean
  onClose: () => void
}

export function TourWelcome({ page, isOpen, onClose }: TourWelcomeProps) {
  const { startTour, tourState } = useTour()
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem('carecircle-tour-welcome-seen')
    if (seen) {
      setHasSeenWelcome(true)
    }
  }, [])

  const handleStartTour = () => {
    localStorage.setItem('carecircle-tour-welcome-seen', 'true')
    setHasSeenWelcome(true)
    startTour(page)
    onClose()
  }

  const handleSkipWelcome = () => {
    localStorage.setItem('carecircle-tour-welcome-seen', 'true')
    setHasSeenWelcome(true)
    onClose()
  }

  // Don't show if user has already seen the welcome or completed/skipped tour
  if (hasSeenWelcome || tourState.isCompleted || tourState.isSkipped) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-primary" />
            <DialogTitle>Welcome to CareCircle! 🎉</DialogTitle>
          </div>
          <DialogDescription>
            Let us show you around and help you get started with your care circle.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">What you'll learn:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>How to navigate the app</li>
                <li>Key features and their purpose</li>
                <li>How to help and get help</li>
                <li>Managing your care circle</li>
              </ul>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Take a quick tour to understand how CareCircle works and how it can help you stay connected with your support network.</p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleSkipWelcome}
            className="flex-1"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleStartTour}
            className="flex-1 gap-2"
          >
            <Play className="h-4 w-4" />
            Start Tour
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

