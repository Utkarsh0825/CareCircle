import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Always return false during SSR and initial render
  const [isMobile, setIsMobile] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    setMounted(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Always return false until mounted to prevent hydration issues
  return mounted ? isMobile : false
}
