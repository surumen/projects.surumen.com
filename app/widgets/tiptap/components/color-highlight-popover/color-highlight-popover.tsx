"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "../../hooks/useTiptapEditor"

// --- Icons ---
import { Eraser, PaletteFill } from 'react-bootstrap-icons'

// --- UI Primitives ---
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/popover"
import { Tooltip, TooltipTrigger, TooltipContent } from "../../components/tooltip"

// --- Tiptap UI ---
import type { BootstrapColor, UseColorHighlightConfig } from "../../hooks/useColorHighlight"
import { useColorHighlight, bootstrapColorMap } from "../../hooks/useColorHighlight"

export interface ColorHighlightPopoverProps
  extends Pick<
    UseColorHighlightConfig,
    "editor" | "hideWhenUnavailable" | "onToggled"
  > {
  /**
   * Optional colors to use in the highlight popover.
   * If not provided, defaults to a predefined set of colors.
   */
  colors?: BootstrapColor[]
  /**
   * Tooltip text for the highlight button
   */
  tooltip?: string
}

export function ColorHighlightPopover({
  editor: providedEditor,
  colors = ["primary", "success", "warning", "danger", "info"] as BootstrapColor[],
  hideWhenUnavailable = false,
  onToggled,
  tooltip = "Highlight text",
}: ColorHighlightPopoverProps) {
  const { editor } = useTiptapEditor(providedEditor)
  const [isOpen, setIsOpen] = React.useState(false)

  // Use the hook just for visibility and state, but not for the trigger button action
  const { isVisible, canHighlight } = useColorHighlight({
    editor,
    highlightColor: "primary", // Just for checking general highlight state
    hideWhenUnavailable,
    onToggled,
  })

  // Get remove highlight function
  const { handleRemoveHighlight } = useColorHighlight({ 
    editor, 
    highlightColor: "primary" // Just for the hook, we'll use the remove function
  })

  // Pre-create hooks for all possible colors to comply with rules of hooks
  const primaryHook = useColorHighlight({ editor, highlightColor: "primary" })
  const successHook = useColorHighlight({ editor, highlightColor: "success" })
  const warningHook = useColorHighlight({ editor, highlightColor: "warning" })
  const dangerHook = useColorHighlight({ editor, highlightColor: "danger" })
  const infoHook = useColorHighlight({ editor, highlightColor: "info" })
  const secondaryHook = useColorHighlight({ editor, highlightColor: "secondary" })
  const lightHook = useColorHighlight({ editor, highlightColor: "light" })
  const darkHook = useColorHighlight({ editor, highlightColor: "dark" })

  // Map colors to their hooks
  const colorHookMap: Record<BootstrapColor, ReturnType<typeof useColorHighlight>> = {
    primary: primaryHook,
    success: successHook,
    warning: warningHook,
    danger: dangerHook,
    info: infoHook,
    secondary: secondaryHook,
    light: lightHook,
    dark: darkHook,
  }

  // Filter to only the colors we want to display
  const colorHooks = colors.map(color => ({
    color,
    ...colorHookMap[color]
  }))

  // Close popover when any color is selected
  const handleColorToggle = React.useCallback((colorHandler: () => boolean | void) => {
    const success = colorHandler()
    if (success) {
      setIsOpen(false)
      onToggled?.()
    }
  }, [onToggled])

  const handleRemoveClick = React.useCallback(() => {
    const success = handleRemoveHighlight()
    if (success) {
      setIsOpen(false)
      onToggled?.()
    }
  }, [handleRemoveHighlight, onToggled])

  if (!isVisible) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={!canHighlight}
              className="btn btn-sm btn-icon border-0 "
              aria-label="Highlight text"
              onClick={() => setIsOpen(!isOpen)}
            >
              <PaletteFill size={14} />
            </button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
      
      <PopoverContent aria-label="Highlight colors">
        <div className="d-flex gap-2 align-items-center">
          {/* Color swatches */}
          {colorHooks.map(({ color, isActive, handleToggle }) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorToggle(handleToggle)}
              aria-label={`${color} highlight color`}
              title={`${color} highlight`}
              className={`btn d-inline-flex align-items-center justify-content-center text-decoration-none btn-sm p-0 position-relative ${
                isActive 
                  ? 'border border-primary' 
                  : 'border'
              }`}
              style={{ 
                minWidth: '1.5rem',
                minHeight: '1.5rem',
                borderRadius: '50%',
                backgroundColor: bootstrapColorMap[color],
              }}
            />
          ))}

          {/* Divider */}
          <div className="vr"></div>

          {/* Remove highlight button */}
          <button
            onClick={handleRemoveClick}
            aria-label="Remove highlight"
            title="Remove highlight"
            type="button"
            className="btn btn-ghost btn-sm d-inline-flex align-items-center justify-content-center"
            style={{ minWidth: '1.5rem', minHeight: '1.5rem' }}
          >
            <Eraser style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ColorHighlightPopover