"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"
import { Fonts, Highlighter } from 'react-bootstrap-icons'

// --- Hooks ---
import { useColorPopover, type UseColorPopoverConfig } from "../../hooks/useColorPopover"

// --- Components ---
import { ColorSwatch, type BootstrapColor } from "../shared/ColorSwatch"
import { Popover, PopoverTrigger, PopoverContent } from "../popover"

export interface ColorPopoverProps extends Omit<UseColorPopoverConfig, 'variant'> {
  variant: 'text' | 'highlight'
  tooltip?: string
}

/**
 * Variant-specific configurations
 */
const variantIcons = {
  text: Fonts,
  highlight: Highlighter,
}

const variantLabels = {
  text: "Text colors",
  highlight: "Highlight colors",
}

const variantTooltips = {
  text: "Text color",
  highlight: "Highlight text",
}

/**
 * Generic ColorPopover component that handles both text and highlight color variants
 */
export function ColorPopover({
  editor,
  variant,
  hideWhenUnavailable = false,
  onColorChanged,
  tooltip,
}: ColorPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  
  // Use the generic hook
  const {
    isVisible,
    canToggle,
    colorStates,
    label
  } = useColorPopover({
    editor,
    variant,
    hideWhenUnavailable,
    onColorChanged
  })

  const Icon = variantIcons[variant]
  const ariaLabel = variantLabels[variant]
  const defaultTooltip = variantTooltips[variant]

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
          title={tooltip || defaultTooltip}
          aria-label={tooltip || defaultTooltip}
          disabled={!canToggle}
          className="btn btn-sm btn-icon btn-ghost-secondary"
        >
          <Icon size={14} />
        </button>
      </PopoverTrigger>
      
      <PopoverContent aria-label={ariaLabel}>
        <div className="d-flex align-items-center gap-2">
          {colorStates.map(({ color, isActive, handleToggle }) => (
            <ColorSwatch
              key={color}
              color={color}
              variant={variant}
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

export default ColorPopover