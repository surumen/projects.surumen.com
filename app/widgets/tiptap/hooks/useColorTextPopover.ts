"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Icons ---
import { Fonts } from 'react-bootstrap-icons'

// --- Lib ---
import { isMarkInSchema, isNodeTypeSelected } from "../utils"

export type BootstrapColor = 
  | "primary"
  | "secondary" 
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"

export interface UseColorTextPopoverConfig {
  editor: Editor | null
  hideWhenUnavailable?: boolean
  onColorChanged?: (color: BootstrapColor | 'default') => void
}

/**
 * Bootstrap semantic color to CSS color mapping for text
 */
export const textColorMap: Record<BootstrapColor, string> = {
  primary: "var(--bs-primary)",
  secondary: "var(--bs-secondary)",
  success: "var(--bs-success)", 
  danger: "var(--bs-danger)",
  warning: "var(--bs-warning)",
  info: "var(--bs-info)",
  dark: "var(--bs-dark)",
}

/**
 * Single hook following official TipTap pattern
 * Handles all text color functionality internally
 */
export function useColorTextPopover(config: UseColorTextPopoverConfig) {
  const { editor, hideWhenUnavailable = false, onColorChanged } = config
  
  // Check if text color can be applied
  const canToggle = React.useMemo(() => {
    if (!editor || !editor.isEditable) return false
    if (
      !isMarkInSchema("textStyle", editor) ||
      isNodeTypeSelected(editor, ["image"])
    ) return false
    return editor.can().setColor("#000000")
  }, [editor])

  // Check visibility
  const isVisible = React.useMemo(() => {
    if (!editor || !editor.isEditable) return false
    if (!isMarkInSchema("textStyle", editor)) return false
    if (hideWhenUnavailable && !canToggle) return false
    return true
  }, [editor, hideWhenUnavailable, canToggle])

  // Get current text color
  const activeTextStyle = React.useMemo(() => {
    if (!editor || !editor.isEditable) return { color: null }
    const attributes = editor.getAttributes("textStyle")
    return { color: attributes.color || null }
  }, [editor])

  // Handle color changes
  const handleColorChanged = React.useCallback((color: BootstrapColor | 'default') => {
    if (!editor || !canToggle) return false

    let success = false
    
    if (color === 'default') {
      // Remove color (set to default)
      success = editor.chain().focus().unsetColor().run()
    } else {
      // Apply color
      const cssColor = textColorMap[color]
      success = editor.chain().focus().setColor(cssColor).run()
    }

    if (success) {
      onColorChanged?.(color)
    }
    
    return success
  }, [editor, canToggle, onColorChanged])

  // Color states for rendering
  const colorStates = React.useMemo(() => {
    const colors: BootstrapColor[] = ["primary", "secondary", "success", "danger", "warning", "info", "dark"]
    
    return [
      // Default option first
      {
        color: 'default' as const,
        isActive: !activeTextStyle.color,
        handleToggle: () => handleColorChanged('default')
      },
      // Color options
      ...colors.map(color => ({
        color,
        isActive: activeTextStyle.color === textColorMap[color],
        handleToggle: () => handleColorChanged(color)
      }))
    ]
  }, [activeTextStyle.color, handleColorChanged])

  return {
    isVisible,
    canToggle,
    activeTextStyle,
    handleColorChanged,
    colorStates,
    label: "Text color",
    Icon: Fonts,
  }
}
