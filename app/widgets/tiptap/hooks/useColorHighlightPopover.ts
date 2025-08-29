"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Icons ---
import { Highlighter } from 'react-bootstrap-icons'

// --- Lib ---
import { isMarkInSchema, isNodeTypeSelected } from "../utils"

export type BootstrapColor = 
  | "primary"
  | "secondary" 
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark"

export interface UseColorHighlightPopoverConfig {
  editor: Editor | null
  hideWhenUnavailable?: boolean
  onColorChanged?: (color: BootstrapColor | 'default') => void
}

/**
 * Bootstrap semantic color to CSS color mapping for highlights
 */
export const highlightColorMap: Record<BootstrapColor, string> = {
  primary: "rgba(var(--bs-primary-rgb), 0.1)",
  secondary: "rgba(var(--bs-secondary-rgb), 0.1)",
  success: "rgba(var(--bs-success-rgb), 0.1)", 
  danger: "rgba(var(--bs-danger-rgb), 0.1)",
  warning: "rgba(var(--bs-warning-rgb), 0.1)",
  info: "rgba(var(--bs-info-rgb), 0.1)",
  light: "rgba(var(--bs-light-rgb), 0.1)",
  dark: "rgba(var(--bs-dark-rgb), 0.1)",
}

/**
 * Single hook following official TipTap pattern
 * Handles all highlight color functionality internally
 */
export function useColorHighlightPopover(config: UseColorHighlightPopoverConfig) {
  const { editor, hideWhenUnavailable = false, onColorChanged } = config
  
  // Check if highlight can be applied
  const canToggle = React.useMemo(() => {
    if (!editor || !editor.isEditable) return false
    if (
      !isMarkInSchema("highlight", editor) ||
      isNodeTypeSelected(editor, ["image"])
    ) return false
    return editor.can().setMark("highlight")
  }, [editor])

  // Check visibility
  const isVisible = React.useMemo(() => {
    if (!editor || !editor.isEditable) return false
    if (!isMarkInSchema("highlight", editor)) return false
    if (hideWhenUnavailable && !canToggle) return false
    return true
  }, [editor, hideWhenUnavailable, canToggle])

  // Get current highlight color
  const activeHighlight = React.useMemo(() => {
    if (!editor || !editor.isEditable) return { color: null }
    const attributes = editor.getAttributes("highlight")
    return { color: attributes.color || null }
  }, [editor])

  // Handle color changes
  const handleColorChanged = React.useCallback((color: BootstrapColor | 'default') => {
    if (!editor || !canToggle) return false

    let success = false
    
    if (color === 'default') {
      // Remove highlight
      success = editor.chain().focus().unsetMark("highlight").run()
    } else {
      // Apply highlight color
      const cssColor = highlightColorMap[color]
      success = editor.chain().focus().toggleMark("highlight", { color: cssColor }).run()
    }

    if (success) {
      onColorChanged?.(color)
    }
    
    return success
  }, [editor, canToggle, onColorChanged])

  // Color states for rendering
  const colorStates = React.useMemo(() => {
    const colors: BootstrapColor[] = ["primary", "success", "warning", "danger", "info"]
    
    return [
      // Default option first
      {
        color: 'default' as const,
        isActive: !activeHighlight.color,
        handleToggle: () => handleColorChanged('default')
      },
      // Color options
      ...colors.map(color => ({
        color,
        isActive: activeHighlight.color === highlightColorMap[color],
        handleToggle: () => handleColorChanged(color)
      }))
    ]
  }, [activeHighlight.color, handleColorChanged])

  return {
    isVisible,
    canToggle,
    activeHighlight,
    handleColorChanged,
    colorStates,
    label: "Highlight color",
    Icon: Highlighter,
  }
}
