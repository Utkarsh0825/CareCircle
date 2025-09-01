'use client'

import React, { useEffect, useState } from 'react'
import { useTour, TourStep } from './tour-provider'
import { Button } from '@/components/ui/button'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'

export function TourTooltip() {
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
    
    let top = 0
    let left = 0

    switch (position) {
      case 'top':
        top = rect.top - 10
        left = rect.left + rect.width / 2
        break
      case 'bottom':
        top = rect.bottom + 10
        left = rect.left + rect.width / 2
        break
      case 'left':
        top = rect.top + rect.height / 2
        left = rect.left - 10
        break
      case 'right':
        top = rect.top + rect.height / 2
        left = rect.right + 10
        break
      case 'center':
        top = rect.top + rect.height / 2
        left = rect.left + rect.width / 2
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
      {/* Highlight overlay - much smaller */}
      {targetElement && (
        <div
          className="fixed z-40 border-2 border-blue-500 rounded-md shadow-lg bg-blue-50/20"
          style={{
            top: targetElement.getBoundingClientRect().top - 2,
            left: targetElement.getBoundingClientRect().left - 2,
            width: targetElement.getBoundingClientRect().width + 4,
            height: targetElement.getBoundingClientRect().height + 4,
          }}
        />
      )}

      {/* Compact tooltip */}
      <div
        className="fixed z-50 w-64 max-w-xs"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-sm text-gray-900">{currentStep.title}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="h-5 w-5 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-xs text-gray-600 mb-3 leading-relaxed">
            {currentStep.content}
          </p>
          
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>Step {tourState.currentStep + 1} of {tourState.steps.length}</span>
            <div className="flex gap-1">
              {tourState.steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${
                    index === tourState.currentStep
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousStep}
              disabled={isFirstStep}
              className="flex-1 h-7 text-xs"
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              Prev
            </Button>
            
            {isLastStep ? (
              <Button
                onClick={completeTour}
                size="sm"
                className="flex-1 h-7 text-xs bg-blue-500 hover:bg-blue-600"
              >
                <Play className="h-3 w-3 mr-1" />
                Finish
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                size="sm"
                className="flex-1 h-7 text-xs bg-blue-500 hover:bg-blue-600"
              >
                Next
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>

          {/* Skip link */}
          <div className="text-center mt-2">
            <button
              onClick={skipTour}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Skip tour
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
