"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "./useTiptapEditor"

// --- Icons ---
import { PaletteFill } from 'react-bootstrap-icons'

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

/**
 * Configuration for the color highlight functionality
 */
export interface UseColorHighlightConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * The Bootstrap semantic color to apply when highlighting.
   */
  highlightColor: BootstrapColor
  /**
   * Whether the button should hide when the mark is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful highlight toggle.
   */
  onToggled?: () => void
}

/**
 * Bootstrap semantic color to CSS color mapping
 */
export const bootstrapColorMap: Record<BootstrapColor, string> = {
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
 * Checks if color highlight can be applied in the current editor state
 */
export function canColorHighlight(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (
    !isMarkInSchema("highlight", editor) ||
    isNodeTypeSelected(editor, ["image"])
  )
    return false

  return editor.can().setMark("highlight")
}

/**
 * Checks if color highlight is currently active
 */
export function isColorHighlightActive(
  editor: Editor | null,
  highlightColor?: BootstrapColor
): boolean {
  if (!editor || !editor.isEditable) return false
  
  if (highlightColor) {
    const cssColor = bootstrapColorMap[highlightColor]
    return editor.isActive("highlight", { color: cssColor })
  }
  
  return editor.isActive("highlight")
}

/**
 * Toggles color highlight in the editor
 */
export function toggleColorHighlight(
  editor: Editor | null,
  highlightColor: BootstrapColor
): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canColorHighlight(editor)) return false

  const cssColor = bootstrapColorMap[highlightColor]
  
  try {
    // Remove any existing stored marks first
    if (editor.state.storedMarks) {
      const highlightMarkType = editor.schema.marks.highlight
      if (highlightMarkType) {
        editor.view.dispatch(
          editor.state.tr.removeStoredMark(highlightMarkType)
        )
      }
    }

    return editor
      .chain()
      .focus()
      .toggleMark("highlight", { color: cssColor })
      .run()
  } catch {
    return false
  }
}

/**
 * Removes highlight from the editor
 */
export function removeHighlight(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canColorHighlight(editor)) return false

  return editor.chain().focus().unsetMark("highlight").run()
}

/**
 * Determines if the color highlight button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false
  if (!isMarkInSchema("highlight", editor)) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canColorHighlight(editor)
  }

  return true
}

/**
 * Custom hook that provides color highlight functionality for Tiptap editor
 */
export function useColorHighlight(config: UseColorHighlightConfig) {
  const {
    editor: providedEditor,
    highlightColor,
    hideWhenUnavailable = false,
    onToggled,
  } = config

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState<boolean>(true)
  const canHighlight = canColorHighlight(editor)
  const isActive = isColorHighlightActive(editor, highlightColor)

  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  const handleToggle = React.useCallback(() => {
    if (!editor) return false

    const success = toggleColorHighlight(editor, highlightColor)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, highlightColor, onToggled])

  const handleRemoveHighlight = React.useCallback(() => {
    if (!editor) return false

    const success = removeHighlight(editor)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, onToggled])

  return {
    isVisible,
    isActive,
    handleToggle,
    handleRemoveHighlight,
    canToggle: canHighlight,  // Renamed for ToolbarButton compatibility
    canHighlight, // Keep original for backward compatibility
    label: `Highlight ${highlightColor}`,
    Icon: PaletteFill,
  }
}
