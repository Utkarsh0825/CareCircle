'use client'

import React, { useEffect, useState } from 'react'
import { useTour, TourStep } from './tour-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, ChevronLeft, ChevronRight, Play, SkipForward } from 'lucide-react'

export function TourOverlay() {
  const { tourState, nextStep, previousStep, skipTour, completeTour } = useTour()
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!tourState.isActive || tourState.steps.length === 0) {
      setTargetElement(null)
      return
    }

    const currentStep = tourState.steps[tourState.currentStep]
    if (!currentStep) return

    const element = document.getElementById(currentStep.target)
    if (element) {
      setTargetElement(element)
      updateTooltipPosition(element, currentStep.position)
    }
  }, [tourState.isActive, tourState.currentStep, tourState.steps])

  useEffect(() => {
    const handleResize = () => {
      if (targetElement && tourState.steps.length > 0) {
        const currentStep = tourState.steps[tourState.currentStep]
        updateTooltipPosition(targetElement, currentStep.position)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [targetElement, tourState.currentStep, tourState.steps])

  const updateTooltipPosition = (element: HTMLElement, position: string) => {
    const rect = element.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = rect.top + scrollTop - 20
        left = rect.left + scrollLeft + rect.width / 2
        break
      case 'bottom':
        top = rect.bottom + scrollTop + 20
        left = rect.left + scrollLeft + rect.width / 2
        break
      case 'left':
        top = rect.top + scrollTop + rect.height / 2
        left = rect.left + scrollLeft - 20
        break
      case 'right':
        top = rect.top + scrollTop + rect.height / 2
        left = rect.right + scrollLeft + 20
        break
      case 'center':
        top = rect.top + scrollTop + rect.height / 2
        left = rect.left + scrollLeft + rect.width / 2
        break
    }

    setTooltipPosition({ top, left })
  }

  if (!tourState.isActive || tourState.steps.length === 0) {
    return null
  }

  const currentStep = tourState.steps[tourState.currentStep]
  const isFirstStep = tourState.currentStep === 0
  const isLastStep = tourState.currentStep === tourState.steps.length - 1

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" />
      
      {/* Highlight overlay */}
      {targetElement && (
        <div
          className="fixed z-50 border-2 border-primary rounded-lg shadow-2xl"
          style={{
            top: targetElement.offsetTop - 4,
            left: targetElement.offsetLeft - 4,
            width: targetElement.offsetWidth + 8,
            height: targetElement.offsetHeight + 8,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-50 w-80 max-w-sm"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Card className="shadow-2xl border-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{currentStep.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              {currentStep.content}
            </p>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span>Step {tourState.currentStep + 1} of {tourState.steps.length}</span>
              <div className="flex gap-1">
                {tourState.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === tourState.currentStep
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousStep}
                disabled={isFirstStep}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              {isLastStep ? (
                <Button
                  onClick={completeTour}
                  size="sm"
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Finish Tour
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  size="sm"
                  className="flex-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>

            {/* Skip button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="w-full mt-2 text-muted-foreground hover:text-foreground"
            >
              <SkipForward className="h-4 w-4 mr-1" />
              Skip Tour
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

