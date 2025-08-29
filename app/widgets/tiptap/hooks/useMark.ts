"use client"

import type { Editor } from "@tiptap/react"
import { useEditorCommand } from "./useEditorCommand"

// Icons
import { TypeBold, Code, TypeItalic, TypeStrikethrough, Subscript, Superscript, TypeUnderline } from 'react-bootstrap-icons'

export type Mark = 
  | "bold"
  | "italic" 
  | "strike"
  | "code"
  | "underline"
  | "superscript"
  | "subscript"

export const markIcons = {
  bold: TypeBold,
  italic: TypeItalic,
  underline: TypeUnderline,
  strike: TypeStrikethrough,
  code: Code,
  superscript: Superscript,
  subscript: Subscript,
}

export const MARK_SHORTCUT_KEYS: Record<Mark, string> = {
  bold: "mod+b",
  italic: "mod+i",
  underline: "mod+u",
  strike: "mod+shift+s",
  code: "mod+e",
  superscript: "mod+.",
  subscript: "mod+,",
}

/**
 * Configuration for the mark functionality
 */
export interface UseMarkConfig {
  /**
   * The Tiptap editor instance
   */
  editor?: Editor | null
  /**
   * The type of mark to toggle
   */
  type: Mark
  /**
   * Whether the button should hide when mark is not available
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful mark toggle
   */
  onToggled?: () => void
}

/**
 * Simplified mark hook using the new consolidated pattern
 */
export function useMark(config: UseMarkConfig) {
  const { editor, type, hideWhenUnavailable, onToggled } = config

  const result = useEditorCommand({
    editor,
    hideWhenUnavailable,
    onToggled,
    shortcutKeys: MARK_SHORTCUT_KEYS[type],
    canExecute: (editor: Editor) => {
      if (!editor.isEditable) return false
      return editor.can().toggleMark(type)
    },
    isActive: (editor: Editor) => {
      if (!editor.isEditable) return false
      return editor.isActive(type)
    },
    executeCommand: (editor: Editor) => {
      return editor.chain().focus().toggleMark(type).run()
    },
    label: type.charAt(0).toUpperCase() + type.slice(1),
  })

  return {
    ...result,
    Icon: markIcons[type],
  }
}
