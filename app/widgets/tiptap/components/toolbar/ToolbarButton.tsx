"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "../../hooks/useTiptapEditor"

// --- New Radix Tooltip ---
import { Tooltip, TooltipTrigger, TooltipContent } from "../../../components/tooltip"

// --- Lib ---
import { cn } from "../../utils"

export interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Hook function that provides the toolbar functionality
   */
  hook: (config?: any) => any
  /**
   * Configuration to pass to the hook
   */
  config?: any
  /**
   * Button variant - toggle buttons become primary when active
   */
  variant?: "default" | "toggle"
  /**
   * Tooltip text (defaults to empty string)
   */
  tooltip?: string
  /**
   * The Tiptap editor instance (optional, hooks usually get this internally)
   */
  editor?: Editor | null
}

export const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      hook,
      config = {},
      variant = "default", 
      tooltip = "",
      className,
      editor: providedEditor,
      onClick,
      ...props
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    
    // Handle click events - must be called before any conditional returns
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        // We'll call the actual handler in the JSX
      },
      [onClick]
    )
    
    // Get hook data
    const hookResult = hook({ 
      editor,
      ...config 
    })

    const {
      isVisible,
      isActive = false,
      handleToggle,
      canToggle,
      label,
      Icon,
    } = hookResult

    // Don't render if hook says not visible
    if (!isVisible) {
      return null
    }

    // All hooks now consistently return these properties
    const actualHandler = handleToggle
    const isDisabled = !canToggle

    // Determine button styling
    const buttonClass = cn(
      "btn btn-sm btn-icon ",
      variant === "toggle" && isActive  ? "btn-primary" : isDisabled ? "btn-ghost-white" : "btn-ghost-secondary",
      className
    )

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={ref}
            className={buttonClass}
            type="button"
            disabled={isDisabled}
            onClick={(event) => {
              handleClick(event);
              if (!event.defaultPrevented) {
                actualHandler?.();
              }
            }}
            aria-pressed={isActive}
            {...props}
          >
            <Icon size={14} />
          </button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    )
  }
)

ToolbarButton.displayName = "ToolbarButton"

export default ToolbarButton
