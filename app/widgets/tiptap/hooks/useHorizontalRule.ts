"use client"

import type { Editor } from "@tiptap/react"
import { useEditorCommand } from "./useEditorCommand"
import { Dash } from 'react-bootstrap-icons'
import { isExtensionAvailable, isNodeTypeSelected } from "../utils"

export interface UseHorizontalRuleConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onInserted?: () => void
}

export function useHorizontalRule(config?: UseHorizontalRuleConfig) {
  const {
    editor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {}

  const result = useEditorCommand({
    editor,
    hideWhenUnavailable,
    onToggled: onInserted,
    canExecute: (editor: Editor) => {
      if (!editor.isEditable) return false
      if (
        !isExtensionAvailable(editor, "horizontalRule") ||
        isNodeTypeSelected(editor, ["image"])
      ) return false
      
      return editor.can().setHorizontalRule()
    },
    isActive: () => false, // Horizontal rules are never "active"
    executeCommand: (editor: Editor) => {
      return editor.chain().focus().setHorizontalRule().run()
    },
    label: "Insert horizontal rule",
  })

  return {
    ...result,
    Icon: Dash,
  }
}
