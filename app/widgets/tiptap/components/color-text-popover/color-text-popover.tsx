"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useColorTextPopover, type BootstrapColor } from "../../hooks/useColorTextPopover"

// --- Icons ---
import { Fonts } from 'react-bootstrap-icons'

// --- UI Primitives ---
import { Popover, PopoverTrigger, PopoverContent } from "../../components/popover"

// --- Types ---
export interface ColorTextPopoverProps {
  editor: Editor | null
  hideWhenUnavailable?: boolean
  onColorChanged?: (color: BootstrapColor | 'default') => void
  tooltip?: string
}

// --- Color Swatch Component ---
interface ColorTextSwatchProps {
  color: BootstrapColor | 'default'
  isActive: boolean
  onToggle: () => void
  disabled?: boolean
}

const ColorTextSwatch = React.memo<ColorTextSwatchProps>(({ 
  color, 
  isActive,
  onToggle, 
  disabled = false 
}) => {
  // Default color swatch styling
  if (color === 'default') {
    return (
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-label="Default text color"
        title="Default text color"
        className={`
          btn btn-sm p-1 position-relative border border-2 border-secondary
          bg-light text-dark fw-bold
          ${isActive ? 'border-primary bg-primary-subtle' : ''}
          ${disabled ? 'opacity-50' : 'hover:scale-110'}
        `}
        style={{ 
          minWidth: '1.75rem',
          minHeight: '1.75rem',
          borderRadius: '50%',
          transition: 'transform 0.1s ease-in-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span 
          style={{ fontSize: '0.75rem', lineHeight: 1 }}
        >
          A
        </span>
      </button>
    )
  }

  // Regular color swatch
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={`${color} text color`}
      title={`Apply ${color} text color`}
      className={`
        btn btn-sm p-1 position-relative border-0
        bg-soft-${color}
        ${isActive ? 'border border-2 border-primary' : ''}
        ${disabled ? 'opacity-50' : 'hover:scale-110'}
      `}
      style={{ 
        minWidth: '1.75rem',
        minHeight: '1.75rem',
        borderRadius: '50%',
        transition: 'transform 0.1s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <span 
        className={`fw-bold text-${color}`}
        style={{ fontSize: '0.75rem', lineHeight: 1 }}
      >
        A
      </span>
    </button>
  )
})

ColorTextSwatch.displayName = 'ColorTextSwatch'

// --- Main Component ---
export function ColorTextPopover({
  editor,
  hideWhenUnavailable = false,
  onColorChanged,
  tooltip = "Text color"
}: ColorTextPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Use the official TipTap pattern hook
  const {
    isVisible,
    canToggle,
    colorStates,
    Icon
  } = useColorTextPopover({
    editor,
    hideWhenUnavailable,
    onColorChanged
  })

  // Handle trigger button click
  const handleTriggerClick = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setIsOpen(!isOpen)
  }, [isOpen])

  // Handle color toggle with callback
  const handleColorToggle = React.useCallback((toggleFn: () => boolean) => {
    const success = toggleFn()
    if (success) {
      setIsOpen(false)
    }
  }, [])

  if (!isVisible) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={handleTriggerClick}
          title={tooltip}
          aria-label={tooltip}
          disabled={!canToggle}
          className="btn btn-sm btn-icon btn-ghost-secondary"
        >
          <Icon size={14} />
        </button>
      </PopoverTrigger>
      
      <PopoverContent aria-label="Text colors">
        <div className="d-flex align-items-center gap-2">
          {colorStates.map(({ color, isActive, handleToggle }) => (
            <ColorTextSwatch
              key={color}
              color={color}
              isActive={isActive}
              onToggle={() => handleColorToggle(handleToggle)}
              disabled={!canToggle}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ColorTextPopover
