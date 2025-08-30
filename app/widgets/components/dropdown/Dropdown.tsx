"use client"

import * as React from "react"
import { createPopper, type Instance as PopperInstance } from '@popperjs/core'

// --- Types ---
export interface DropdownContextValue {
  // State
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  
  // Refs for positioning
  triggerRef: React.RefObject<HTMLButtonElement>
  menuRef: React.RefObject<HTMLDivElement>
}

export interface DropdownProps {
  /**
   * Children components (Trigger, Content, etc.)
   */
  children: React.ReactNode
  /**
   * Callback when dropdown opens/closes
   */
  onOpenChange?: (isOpen: boolean) => void
}

export interface DropdownTriggerProps {
  /**
   * Child element to use as trigger
   */
  children: React.ReactElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<any> }>
}

export interface DropdownContentProps {
  /**
   * Content to display in dropdown
   */
  children: React.ReactNode
  /**
   * Additional CSS class for the dropdown menu
   */
  className?: string
}

export interface DropdownItemProps {
  /**
   * Content of the dropdown item
   */
  children: React.ReactNode
  /**
   * Click handler
   */
  onClick: () => void
  /**
   * Whether the item is active/selected
   */
  active?: boolean
  /**
   * Whether the item is disabled
   */
  disabled?: boolean
  /**
   * Optional icon component
   */
  icon?: React.ComponentType<{ style?: React.CSSProperties }>
  /**
   * Additional CSS class
   */
  className?: string
}

// --- Context ---
const DropdownContext = React.createContext<DropdownContextValue | null>(null)

const useDropdownContext = () => {
  const context = React.useContext(DropdownContext)
  if (!context) {
    throw new Error('Dropdown components must be used within a Dropdown')
  }
  return context
}

// --- Root Component ---
export const Dropdown = ({ children, onOpenChange }: DropdownProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const popperRef = React.useRef<PopperInstance | null>(null)

  // Handle open/close state changes
  const handleOpenChange = React.useCallback((nextIsOpen: boolean) => {
    setIsOpen(nextIsOpen)
    onOpenChange?.(nextIsOpen)
  }, [onOpenChange])

  // Handle positioning with Popper
  React.useEffect(() => {
    if (isOpen && triggerRef.current && menuRef.current) {
      popperRef.current = createPopper(triggerRef.current, menuRef.current, {
        placement: 'bottom-end',
        strategy: 'absolute',
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['bottom-start', 'top-end', 'top-start'],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              padding: 8,
            },
          },
          {
            name: 'offset',
            options: {
              offset: [0, 4],
            },
          },
        ],
      })
    }

    return () => {
      if (popperRef.current) {
        popperRef.current.destroy()
        popperRef.current = null
      }
    }
  }, [isOpen])

  // Handle clicks outside dropdown
  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        triggerRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleOpenChange(false)
      }
    }

    // Handle escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleOpenChange(false)
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
    menuRef,
  }), [isOpen, handleOpenChange])

  return (
    <DropdownContext.Provider value={contextValue}>
      {children}
    </DropdownContext.Provider>
  )
}

// --- Trigger Component ---
export const DropdownTrigger = ({ children }: DropdownTriggerProps) => {
  const { isOpen, setIsOpen, triggerRef } = useDropdownContext()

  const handleClick = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    // Preserve any existing onClick handler
    if (children.props.onClick) {
      children.props.onClick(e as any)
    }
    setIsOpen(!isOpen)
  }, [children.props.onClick, isOpen, setIsOpen])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    // Preserve any existing keyDown handler
    if (children.props.onKeyDown) {
      children.props.onKeyDown(e as any)
    }
    
    // Handle dropdown keyboard navigation
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault()
      setIsOpen(false)
    }
  }, [children.props.onKeyDown, isOpen, setIsOpen])

  return React.cloneElement(children, {
    ...children.props,
    ref: triggerRef,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    'aria-expanded': isOpen,
    'aria-haspopup': true,
    className: [
      children.props.className,
      'dropdown-toggle',
      isOpen ? 'show' : ''
    ].filter(Boolean).join(' ').trim() || undefined,
  } as any)
}

// --- Content Component ---
export const DropdownContent = ({ children, className = '' }: DropdownContentProps) => {
  const { isOpen, menuRef } = useDropdownContext()

  if (!isOpen) return null

  return (
    <div 
      ref={menuRef}
      className={`dropdown-menu show ${className}`}
      aria-labelledby="dropdownMenuButton"
      data-popper-placement="bottom-end"
      style={{ zIndex: 1000 }}
    >
      {children}
    </div>
  )
}

// --- Item Component ---
export const DropdownItem = ({ 
  children, 
  onClick, 
  active = false, 
  disabled = false, 
  icon: IconComponent,
  className = '' 
}: DropdownItemProps) => {
  const { setIsOpen } = useDropdownContext()

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (disabled) return
    onClick()
    setIsOpen(false) // Close dropdown after click
  }, [onClick, disabled, setIsOpen])

  return (
    <a
      className={`dropdown-item small ${active ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      href="#"
      onClick={handleClick}
      style={disabled ? { pointerEvents: 'none' } : undefined}
    >
      {IconComponent && (
        <IconComponent 
          style={{ 
            width: '1rem', 
            height: '1rem',
            marginRight: '0.5rem',
            flexShrink: 0
          }} 
        />
      )}
      {children}
    </a>
  )
}

// --- Component Attachments ---
Dropdown.Trigger = DropdownTrigger
Dropdown.Content = DropdownContent
Dropdown.Item = DropdownItem

export default Dropdown
