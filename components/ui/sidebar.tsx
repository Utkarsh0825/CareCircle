import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { TooltipProvider } from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

// Constants
const SIDEBAR_WIDTH = "280px"
const SIDEBAR_WIDTH_ICON = "60px"
const SIDEBAR_COOKIE_NAME = "sidebar-state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

// Context
interface SidebarContextProps {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  isMobile: boolean
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(undefined)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

// Main Sidebar Provider Component
function SidebarProvider({
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)
  const [_open, _setOpen] = React.useState(defaultOpen)
  
  const open = openProp ?? _open
  
  const setOpen = React.useCallback((value: boolean | ((value: boolean) => boolean)) => {
    const openState = typeof value === "function" ? value(open) : value
    
    if (setOpenProp) {
      setOpenProp(openState)
    } else {
      _setOpen(openState)
    }

    // Only set cookie on client side
    if (typeof document !== 'undefined') {
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    }
  }, [setOpenProp, open])

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Keyboard shortcut - only on client side
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

// Sidebar Component
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"aside"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { state, open, isMobile, openMobile } = useSidebar()

  return (
    <aside
      data-slot="sidebar"
      data-sidebar=""
      data-state={state}
      data-side={side}
      data-variant={variant}
      data-collapsible={collapsible}
      data-mobile={isMobile}
      data-mobile-open={openMobile}
      className={cn(
        "group/sidebar relative flex h-full w-full flex-col gap-4 border-r bg-sidebar text-sidebar-foreground",
        "data-[state=collapsed]:w-[var(--sidebar-width-icon)]",
        "data-[state=expanded]:w-[var(--sidebar-width)]",
        "data-[variant=inset]:border-0 data-[variant=inset]:bg-transparent",
        "data-[collapsible=icon]:data-[state=collapsed]:w-[var(--sidebar-width-icon)]",
        "data-[collapsible=icon]:data-[state=expanded]:w-[var(--sidebar-width)]",
        "data-[collapsible=offcanvas]:data-[state=collapsed]:w-0 data-[collapsible=offcanvas]:data-[state=collapsed]:border-0",
        "data-[collapsible=offcanvas]:data-[state=expanded]:w-[var(--sidebar-width)]",
        "data-[collapsible=none]:w-[var(--sidebar-width)]",
        "data-[mobile=true]:fixed data-[mobile=true]:inset-y-0 data-[mobile=true]:z-50 data-[mobile=true]:w-[var(--sidebar-width)] data-[mobile=true]:border-r data-[mobile=true]:bg-sidebar data-[mobile=true]:transition-transform",
        "data-[mobile=true]:data-[mobile-open=false]:-translate-x-full data-[mobile=true]:data-[mobile-open=true]:translate-x-0",
        "data-[side=right]:border-l data-[side=right]:border-r-0",
        "data-[side=right]:data-[mobile=true]:right-0 data-[side=right]:data-[mobile=true]:left-auto",
        "data-[side=right]:data-[mobile=true]:data-[mobile-open=false]:translate-x-full data-[side=right]:data-[mobile=true]:data-[mobile-open=true]:translate-x-0",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

// Sidebar Content
function SidebarContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn("flex h-full w-full flex-col gap-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Sidebar Header
function SidebarHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex h-[60px] items-center px-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Sidebar Footer
function SidebarFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex items-center gap-4 p-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Sidebar Group
function SidebarGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Sidebar Menu
function SidebarMenu({
  className,
  children,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex flex-col gap-2 px-3", className)}
      {...props}
    >
      {children}
    </nav>
  )
}

// Sidebar Menu Item
function SidebarMenuItem({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Sidebar Menu Button
function SidebarMenuButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  children,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

// Sidebar Menu Sub
function SidebarMenuSub({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    >
      {children}
    </ul>
  )
}

// Sidebar Menu Sub Item
function SidebarMenuSubItem({
  className,
  children,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    >
      {children}
    </li>
  )
}

// Sidebar Menu Sub Button
function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  children,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}

// Sidebar Menu Skeleton
function SidebarMenuSkeleton({
  className,
  showIcon = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  // Fixed width to prevent hydration issues
  const width = "75%"

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <div
          className="size-4 rounded-md bg-muted animate-pulse"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <div
        className="h-4 flex-1 rounded bg-muted animate-pulse"
        data-sidebar="menu-skeleton-text"
        style={{ width }}
      />
    </div>
  )
}

// Export all components
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  useSidebar,
}
