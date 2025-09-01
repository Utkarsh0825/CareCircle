'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Play, HelpCircle } from 'lucide-react'
import { useTour } from './tour-provider'

interface TourTriggerProps {
  page: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  showIcon?: boolean
}

export function TourTrigger({ 
  page, 
  variant = 'outline', 
  size = 'sm', 
  className = '',
  showIcon = true 
}: TourTriggerProps) {
  const { tourState, startTour, resetTour } = useTour()

  const handleClick = () => {
    if (tourState.isCompleted || tourState.isSkipped) {
      resetTour()
    }
    startTour(page)
  }

  const getButtonText = () => {
    if (tourState.isCompleted) return 'Replay Tour'
    if (tourState.isSkipped) return 'Start Tour'
    return 'Start Tour'
  }

  const getIcon = () => {
    if (tourState.isCompleted) return <Play className="h-4 w-4" />
    if (tourState.isSkipped) return <HelpCircle className="h-4 w-4" />
    return <HelpCircle className="h-4 w-4" />
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`gap-2 ${className}`}
    >
      {showIcon && getIcon()}
      {getButtonText()}
    </Button>
  )
}

