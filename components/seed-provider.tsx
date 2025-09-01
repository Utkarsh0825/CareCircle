'use client'

import { useEffect } from 'react'
import { seedIfEmpty } from '@/lib/localStore'

export function SeedProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    seedIfEmpty()
  }, [])

  return <>{children}</>
}

