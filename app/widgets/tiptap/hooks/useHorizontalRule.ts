"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "./useTiptapEditor"

// --- Icons ---
import { Dash } from 'react-bootstrap-icons'

// --- UI Utils ---
import {
  isExtensionAvailable,
  isNodeTypeSelected,
} from "../utils"

/**
 * Configuration for the horizontal rule functionality
 */
export interface UseHorizontalRuleConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when horizontal rule is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful insertion.
   */
  onInserted?: () => void
}

/**
 * Checks if horizontal rule can be inserted in the current editor state
 */
export function canInsertHorizontalRule(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (
    !isExtensionAvailable(editor, "horizontalRule") ||
    isNodeTypeSelected(editor, ["image"])
  )
    return false

  return editor.can().chain().focus().setHorizontalRule().run()
}

/**
 * Inserts a horizontal rule in the editor
 */
export function insertHorizontalRule(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canInsertHorizontalRule(editor)) return false

  try {
    return editor
      .chain()
      .focus()
      .setHorizontalRule()
      .run()
  } catch {
    return false
  }
}

/**
 * Determines if the horizontal rule button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, "horizontalRule")) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canInsertHorizontalRule(editor)
  }

  return true
}

/**
 * Custom hook that provides horizontal rule functionality for Tiptap editor
 */
export function useHorizontalRule(config?: UseHorizontalRuleConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState<boolean>(true)
  const canInsert = canInsertHorizontalRule(editor)

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

  const handleInsert = React.useCallback(() => {
    if (!editor) return false

    const success = insertHorizontalRule(editor)
    if (success) {
      onInserted?.()
    }
    return success
  }, [editor, onInserted])

  return {
    isVisible,
    handleInsert,
    canInsert,
    label: "Insert horizontal rule",
    Icon: Dash,
  }
}
