"use client"

import type { Editor } from "@tiptap/react"
import { useEditorCommand } from "./useEditorCommand"
import { TextCenter, Justify, TextLeft, TextRight } from 'react-bootstrap-icons'
import { isExtensionAvailable, isNodeTypeSelected } from "../utils"

export type TextAlign = "left" | "center" | "right" | "justify"

export interface UseTextAlignConfig {
  editor?: Editor | null
  align: TextAlign
  hideWhenUnavailable?: boolean
  onAligned?: () => void
}

const textAlignIcons = {
  left: TextLeft,
  center: TextCenter,
  right: TextRight,
  justify: Justify,
}

const textAlignLabels: Record<TextAlign, string> = {
  left: "Align left",
  center: "Align center", 
  right: "Align right",
  justify: "Align justify",
}

export function useTextAlign(config: UseTextAlignConfig) {
  const { editor, align, hideWhenUnavailable, onAligned } = config

  const result = useEditorCommand({
    editor,
    hideWhenUnavailable,
    onToggled: onAligned,
    canExecute: (editor: Editor) => {
      if (!editor.isEditable) return false
      if (
        !isExtensionAvailable(editor, "textAlign") ||
        isNodeTypeSelected(editor, ["image"])
      ) return false

      return editor.can().setTextAlign(align)
    },
    isActive: (editor: Editor) => {
      return editor.isActive({ textAlign: align })
    },
    executeCommand: (editor: Editor) => {
      return editor.chain().focus().setTextAlign(align).run()
    },
    label: textAlignLabels[align],
  })

  return {
    ...result,
    Icon: textAlignIcons[align],
  }
}
