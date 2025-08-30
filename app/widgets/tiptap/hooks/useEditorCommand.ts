"use client"

import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import type { Editor } from "@tiptap/react"
import { useTiptapEditor } from "./useTiptapEditor"

export interface EditorCommandConfig {
  /**
   * The Tiptap editor instance
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when command is not available
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful command execution
   */
  onToggled?: () => void
  /**
   * Keyboard shortcut for the command
   */
  shortcutKeys?: string
  /**
   * Function to check if the command can be executed
   */
  canExecute: (editor: Editor) => boolean
  /**
   * Function to check if the command is currently active
   */
  isActive: (editor: Editor) => boolean
  /**
   * Function to execute the command
   */
  executeCommand: (editor: Editor) => boolean
  /**
   * Label for the command (for accessibility)
   */
  label: string
}

/**
 * Consolidated hook for editor commands (marks, nodes, etc.)
 * Replaces the individual use-mark, use-heading, etc. hooks
 */
export function useEditorCommand(config: EditorCommandConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onToggled,
    shortcutKeys,
    canExecute,
    isActive,
    executeCommand,
    label,
  } = config

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState(true)

  // Check if command is available and active
  const canToggle = editor ? canExecute(editor) : false
  const isCommandActive = editor ? isActive(editor) : false

  // Update visibility based on editor state
  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      if (hideWhenUnavailable) {
        setIsVisible(canExecute(editor))
      } else {
        setIsVisible(true)
      }
    }

    handleSelectionUpdate()
    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable, canExecute])

  // Handle command execution
  const handleToggle = React.useCallback(() => {
    if (!editor) return false

    const success = executeCommand(editor)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, executeCommand, onToggled])

  // Register hotkeys (always enabled - no mobile logic)
  useHotkeys(
    shortcutKeys || "",
    (event) => {
      event.preventDefault()
      handleToggle()
    },
    {
      enabled: Boolean(shortcutKeys && isVisible && canToggle),
      enableOnContentEditable: true,
      enableOnFormTags: true,
    }
  )

  return {
    isVisible,
    isActive: isCommandActive,
    handleToggle,
    canToggle,
    label,
    shortcutKeys,
  }
}
