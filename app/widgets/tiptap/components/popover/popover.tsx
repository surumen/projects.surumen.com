"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { createPopper, type Instance as PopperInstance, type Placement } from '@popperjs/core'
import { cn } from "../../utils"

// --- Types ---
export interface PopoverContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement>
  contentRef: React.RefObject<HTMLDivElement>
  arrowRef: React.RefObject<HTMLDivElement>
}

export interface PopoverProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export interface PopoverTriggerProps {
  asChild?: boolean
  children: React.ReactElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<any> }>
}

export interface PopoverContentProps {
  children: React.ReactNode
  className?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  alignOffset?: number
  style?: React.CSSProperties
}

// --- Context ---
const PopoverContext = React.createContext<PopoverContextValue | null>(null)

const usePopoverContext = () => {
  const context = React.useContext(PopoverContext)
  if (!context) {
    throw new Error('Popover components must be used within a Popover')
  }
  return context
}

// --- Root Component ---
export const Popover = ({ children, open, onOpenChange }: PopoverProps) => {
  const [isOpen, setIsOpen] = React.useState(open ?? false)
  const triggerRef = React.useRef<HTMLElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const arrowRef = React.useRef<HTMLDivElement>(null)
  const popperRef = React.useRef<PopperInstance | null>(null)

  // Sync external open prop
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  // Handle open/close state changes
  const handleOpenChange = React.useCallback((nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen)
    onOpenChange?.(nextIsOpen)
  }, [onOpenChange])

  // Handle positioning with PopperJS
  React.useEffect(() => {
    if (isOpen && triggerRef.current && contentRef.current && arrowRef.current) {
      // Destroy existing popper instance
      if (popperRef.current) {
        popperRef.current.destroy()
      }

      // Create new popper instance
      popperRef.current = createPopper(triggerRef.current, contentRef.current, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8] // Increased to account for arrow
            }
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['top', 'right', 'left']
            }
          },
          {
            name: 'preventOverflow',
            options: {
              padding: 8
            }
          },
          {
            name: 'arrow',
            options: {
              element: arrowRef.current,
            },
          }
        ]
      })

      // Update popper positioning
      popperRef.current.update()
    }

    return () => {
      if (popperRef.current) {
        popperRef.current.destroy()
        popperRef.current = null
      }
    }
  }, [isOpen])

  // Handle clicks outside popover
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current && 
        triggerRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleOpenChange(false)
      }
    }

    // Handle escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleOpenChange(false)
        // Return focus to trigger
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleOpenChange])

  const contextValue = React.useMemo(() => ({
    isOpen,
    setIsOpen: handleOpenChange,
    triggerRef,
    contentRef,
    arrowRef,
  }), [isOpen, handleOpenChange])

  return (
    <PopoverContext.Provider value={contextValue}>
      {children}
    </PopoverContext.Provider>
  )
}

// --- Trigger Component ---
export const PopoverTrigger = ({ asChild = false, children }: PopoverTriggerProps) => {
  const { isOpen, setIsOpen, triggerRef } = usePopoverContext()

  const handleClick = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    // Preserve any existing onClick handler
    if (children.props.onClick) {
      children.props.onClick(e as any)
    }
    if (!e.defaultPrevented) {
      setIsOpen(!isOpen)
    }
  }, [children.props, isOpen, setIsOpen])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    // Preserve any existing keyDown handler
    if (children.props.onKeyDown) {
      children.props.onKeyDown(e as any)
    }
    
    // Handle popover keyboard navigation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault()
      setIsOpen(false)
    }
  }, [children.props, isOpen, setIsOpen])

  if (asChild) {
    return React.cloneElement(children, {
      ...children.props,
      ref: triggerRef,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      'aria-expanded': isOpen,
      'aria-haspopup': 'dialog',
    } as any)
  }

  // If not asChild, wrap in a button
  return (
    <button
      ref={triggerRef as any}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      type="button"
    >
      {children}
    </button>
  )
}

// --- Content Component ---
export const PopoverContent = ({ 
  children, 
  className = '',
  align = 'center',
  side = 'bottom', 
  sideOffset = 4,
  alignOffset = 0,
  style = {},
  ...props
}: PopoverContentProps) => {
  const { isOpen, contentRef, arrowRef } = usePopoverContext()

  // Remove the unused placement update effect since PopperJS handles this automatically
  // when the trigger or content position changes

  if (!isOpen) return null

  const popoverContent = (
    <div 
      ref={contentRef}
      className={cn("popover bs-popover-auto fade show", className)}
      role="tooltip"
      style={{ 
        zIndex: 1060,
        position: 'absolute',
        ...style
      }}
      data-popper-placement={side}
      {...props}
    >
      <div 
        ref={arrowRef}
        className="popover-arrow" 
        data-popper-arrow
        style={{
          position: 'absolute'
        }}
      />
      <div className="popover-body p-2">
        {children}
      </div>
    </div>
  )

  // Render in portal to ensure proper stacking
  return createPortal(popoverContent, document.body)
}

// --- Component Attachments (for compound component pattern) ---
Popover.Trigger = PopoverTrigger
Popover.Content = PopoverContent

export default Popover
