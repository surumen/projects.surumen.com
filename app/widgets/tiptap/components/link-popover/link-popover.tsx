"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "../../hooks/useTiptapEditor"

// --- Icons ---
import { ArrowReturnLeft, BoxArrowUpRight, Link, Trash } from 'react-bootstrap-icons'

// --- Tiptap UI ---
import { useLink } from "../../hooks/useLink"

// --- UI Primitives ---
import { ToolbarButton } from "../../components/toolbar-button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/popover"

export interface LinkPopoverProps {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether to hide the link popover when not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called when the link is set.
   */
  onToggled?: () => void
  /**
   * Callback for when the popover opens or closes.
   */
  onOpenChange?: (isOpen: boolean) => void
  /**
   * Whether to automatically open the popover when a link is active.
   * @default true
   */
  autoOpenOnLinkActive?: boolean
  /**
   * Click handler for the trigger button
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /**
   * Custom content for the trigger button
   */
  children?: React.ReactNode
}

/**
 * Link popover component for Tiptap editors.
 */
export const LinkPopover = React.forwardRef<
  HTMLButtonElement,
  LinkPopoverProps
>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      onToggled,
      onOpenChange,
      autoOpenOnLinkActive = true,
      onClick,
      children,
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const [isOpen, setIsOpen] = React.useState(false)
    const [url, setUrl] = React.useState("")

    const linkHook = useLink({
      editor,
      hideWhenUnavailable,
      onToggled,
    })

    // Sync URL from editor state
    React.useEffect(() => {
      setUrl(linkHook.currentUrl)
    }, [linkHook.currentUrl])

    // Handle popover open/close state changes
    const handleOnOpenChange = React.useCallback(
      (nextIsOpen: boolean) => {
        setIsOpen(nextIsOpen)
        onOpenChange?.(nextIsOpen)
      },
      [onOpenChange]
    )

    // Handle setting the link
    const handleSetLink = React.useCallback(() => {
      const success = linkHook.handleSetLink(url)
      if (success) {
        setIsOpen(false)
        onToggled?.()
      }
    }, [linkHook.handleSetLink, url, onToggled])

    // Handle removing the link
    const handleRemoveLink = React.useCallback(() => {
      const success = linkHook.handleRemoveLink()
      if (success) {
        setUrl("")
        setIsOpen(false)
        onToggled?.()
      }
    }, [linkHook.handleRemoveLink, onToggled])

    // Handle opening the link in new window
    const handleOpenLink = React.useCallback(() => {
      linkHook.handleOpenLink()
    }, [linkHook.handleOpenLink])

    // Handle trigger button click
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        setIsOpen(!isOpen)
      },
      [onClick, isOpen]
    )

    // Handle keyboard events
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault()
        handleSetLink()
      }
    }, [handleSetLink])

    // Auto-open when link becomes active
    React.useEffect(() => {
      if (autoOpenOnLinkActive && linkHook.isActive) {
        setIsOpen(true)
      }
    }, [autoOpenOnLinkActive, linkHook.isActive])

    if (!linkHook.isVisible) {
      return null
    }

    return (
      <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
        <PopoverTrigger asChild>
          <ToolbarButton
            hook={useLink}
            config={{ editor, hideWhenUnavailable, onToggled }}
            onClick={handleClick}
            ref={ref}
            tooltip="Link"
          >
            {children || <Link size={14} />}
          </ToolbarButton>
        </PopoverTrigger>

        <PopoverContent>
          <div className="d-flex gap-2 align-items-center">
            {/* URL Input */}
            <input
              type="url"
              className="form-control form-control-sm"
              placeholder="Paste a link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />

            {/* Apply Link Button */}
            <button
              type="button"
              onClick={handleSetLink}
              title="Apply link"
              disabled={!url && !linkHook.isActive}
              className="btn btn-ghost btn-sm border-0 d-inline-flex align-items-center justify-content-center"
              style={{ minWidth: '2rem', minHeight: '2rem' }}
            >
              <ArrowReturnLeft style={{ width: '1rem', height: '1rem' }} />
            </button>

            {/* Divider */}
            <div className="vr"></div>

            {/* Open Link Button */}
            <button
              type="button"
              onClick={handleOpenLink}
              title="Open in new window"
              disabled={!url && !linkHook.isActive}
              className="btn btn-ghost btn-sm border-0 d-inline-flex align-items-center justify-content-center"
              style={{ minWidth: '2rem', minHeight: '2rem' }}
            >
              <BoxArrowUpRight style={{ width: '1rem', height: '1rem' }} />
            </button>

            {/* Remove Link Button */}
            <button
              type="button"
              onClick={handleRemoveLink}
              title="Remove link"
              disabled={!url && !linkHook.isActive}
              className="btn btn-ghost btn-sm border-0 d-inline-flex align-items-center justify-content-center"
              style={{ minWidth: '2rem', minHeight: '2rem' }}
            >
              <Trash style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)

LinkPopover.displayName = "LinkPopover"

export default LinkPopover