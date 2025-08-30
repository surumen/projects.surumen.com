"use client"

import type { Editor } from "@tiptap/react"
import { useEditorCommand } from "./useEditorCommand"
import { ArrowClockwise, ArrowCounterclockwise } from 'react-bootstrap-icons'

export type UndoRedoAction = "undo" | "redo"

export interface UseUndoRedoConfig {
  editor?: Editor | null
  action: UndoRedoAction
  hideWhenUnavailable?: boolean
  onExecuted?: () => void
}

const historyActionLabels: Record<UndoRedoAction, string> = {
  undo: "Undo",
  redo: "Redo",
}

const historyIcons = {
  undo: ArrowCounterclockwise,
  redo: ArrowClockwise,
}

const historyShortcuts: Record<UndoRedoAction, string> = {
  undo: "mod+z",
  redo: "mod+shift+z",
}

export function useUndoRedo(config: UseUndoRedoConfig) {
  const { editor, action, hideWhenUnavailable, onExecuted } = config

  const result = useEditorCommand({
    editor,
    hideWhenUnavailable,
    onToggled: onExecuted,
    shortcutKeys: historyShortcuts[action],
    canExecute: (editor: Editor) => {
      if (!editor.isEditable) return false
      return action === "undo" ? editor.can().undo() : editor.can().redo()
    },
    isActive: () => false, // Undo/redo are never "active"
    executeCommand: (editor: Editor) => {
      const chain = editor.chain().focus()
      return action === "undo" ? chain.undo().run() : chain.redo().run()
    },
    label: historyActionLabels[action],
  })

  return {
    ...result,
    Icon: historyIcons[action],
  }
}
