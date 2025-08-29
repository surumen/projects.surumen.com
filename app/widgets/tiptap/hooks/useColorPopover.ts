"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"
import { isMarkInSchema, isNodeTypeSelected } from "../utils"
import type { BootstrapColor } from "@/widgets/tiptap/components/color-popover/ColorSwatch"

export interface UseColorPopoverConfig {
  editor: Editor | null
  variant: 'text' | 'highlight'
  hideWhenUnavailable?: boolean
  onColorChanged?: (color: BootstrapColor | null) => void
}

/**
 * Color maps for different variants
 */
const textColorMap: Record<BootstrapColor, string> = {
  primary: "var(--bs-primary)",
  secondary: "var(--bs-secondary)",
  success: "var(--bs-success)", 
  danger: "var(--bs-danger)",
  warning: "var(--bs-warning)",
  info: "var(--bs-info)",
  light: "var(--bs-light)",
  dark: "var(--bs-dark)",
}

const highlightColorMap: Record<BootstrapColor, string> = {
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
 * Variant configurations
 */
const variantConfig = {
  text: {
    markName: 'textStyle' as const,
    attributeName: 'color',
    colorMap: textColorMap,
    colors: ["primary", "secondary", "success", "danger", "warning", "info"] as BootstrapColor[],
    canExecuteTest: (editor: Editor) => editor.can().setColor("#000000"),
    setCommand: (editor: Editor, color: string) => editor.chain().focus().setColor(color).run(),
    unsetCommand: (editor: Editor) => editor.chain().focus().unsetColor().run(),
    label: "Text color",
  },
  highlight: {
    markName: 'highlight' as const,
    attributeName: 'color',
    colorMap: highlightColorMap,
    colors: ["primary", "success", "warning", "danger", "info"] as BootstrapColor[],
    canExecuteTest: (editor: Editor) => editor.can().setMark("highlight"),
    setCommand: (editor: Editor, color: string) => editor.chain().focus().toggleMark("highlight", { color }).run(),
    unsetCommand: (editor: Editor) => editor.chain().focus().unsetMark("highlight").run(),
    label: "Highlight color",
  }
}

/**
 * Generic hook for color popover functionality
 * Handles both text and highlight color variants
 */
export function useColorPopover(config: UseColorPopoverConfig) {
  const { editor, variant, hideWhenUnavailable = false, onColorChanged } = config
  
  const variantSettings = variantConfig[variant]
  
  // Check if color can be applied
  const canToggle = React.useMemo(() => {
    if (!editor || !editor.isEditable) return false
    if (
      !isMarkInSchema(variantSettings.markName, editor) ||
      isNodeTypeSelected(editor, ["image"])
    ) return false
    return variantSettings.canExecuteTest(editor)
  }, [editor, variantSettings])

  // Check visibility
  const isVisible = React.useMemo(() => {
    if (!editor || !editor.isEditable) return false
    if (!isMarkInSchema(variantSettings.markName, editor)) return false
    if (hideWhenUnavailable && !canToggle) return false
    return true
  }, [editor, hideWhenUnavailable, canToggle, variantSettings.markName])

  // Get current color
  const activeColor = React.useMemo(() => {
    if (!editor || !editor.isEditable) return null
    const attributes = editor.getAttributes(variantSettings.markName)
    return attributes[variantSettings.attributeName] || null
  }, [editor, variantSettings])

  // Handle color changes
  const handleColorChanged = React.useCallback((color: BootstrapColor | null) => {
    if (!editor || !canToggle) return false

    let success = false
    
    if (color === null) {
      // Remove color (set to default)
      success = variantSettings.unsetCommand(editor)
    } else {
      // Apply color
      const cssColor = variantSettings.colorMap[color]
      success = variantSettings.setCommand(editor, cssColor)
    }

    if (success) {
      onColorChanged?.(color)
    }
    
    return success
  }, [editor, canToggle, onColorChanged, variantSettings])

  // Create stable handler references for each color
  const colorHandlers = React.useMemo(() => {
    const handlers: Record<string, () => boolean> = {}
    
    // Color handlers for each variant color
    variantSettings.colors.forEach(color => {
      handlers[color] = () => handleColorChanged(color)
    })
    
    return handlers
  }, [handleColorChanged, variantSettings.colors])

  // Handle clearing color (eraser functionality)
  const handleClear = React.useCallback(() => {
    return handleColorChanged(null)
  }, [handleColorChanged])

  // Color states for rendering with stable handler references
  const colorStates = React.useMemo(() => {
    return variantSettings.colors.map(color => ({
      color,
      isActive: activeColor === variantSettings.colorMap[color],
      handleToggle: colorHandlers[color] // STABLE REFERENCE
    }))
  }, [activeColor, colorHandlers, variantSettings])

  return {
    isVisible,
    canToggle,
    activeColor,
    handleColorChanged,
    handleClear,
    colorStates,
    label: variantSettings.label,
  }
}

// Export color maps for backward compatibility if needed
export { textColorMap, highlightColorMap }