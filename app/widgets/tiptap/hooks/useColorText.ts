"use client"

import type { Editor } from "@tiptap/react"
import { useEditorCommand } from "./useEditorCommand"
import { TypeBold } from 'react-bootstrap-icons'
import { isMarkInSchema, isNodeTypeSelected } from "../utils"
import type { BootstrapColor } from "@/widgets/tiptap/components/color-popover/ColorSwatch"

export interface UseColorTextConfig {
  editor?: Editor | null
  textColor: BootstrapColor
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

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

export function useColorText(config: UseColorTextConfig) {
  const { editor, textColor, hideWhenUnavailable, onToggled } = config

  const result = useEditorCommand({
    editor,
    hideWhenUnavailable,
    onToggled,
    canExecute: (editor: Editor) => {
      if (!editor.isEditable) return false
      if (
        !isMarkInSchema("textStyle", editor) ||
        isNodeTypeSelected(editor, ["image"])
      ) return false

      return editor.can().setColor("#000000") // Test with any color
    },
    isActive: (editor: Editor) => {
      const cssColor = textColorMap[textColor]
      return editor.isActive("textStyle", { color: cssColor })
    },
    executeCommand: (editor: Editor) => {
      const cssColor = textColorMap[textColor]
      return editor.chain().focus().setColor(cssColor).run()
    },
    label: `Text ${textColor}`,
  })

  return {
    ...result,
    Icon: TypeBold, // Will use a text color icon
    currentColor: editor ? editor.getAttributes("textStyle").color || null : null,
  }
}

// Utility functions for popover components
export { textColorMap }

export function removeTextColor(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.chain().focus().unsetColor().run()
}

export function getCurrentTextColor(editor: Editor | null): string | null {
  if (!editor || !editor.isEditable) return null
  const attributes = editor.getAttributes("textStyle")
  return attributes.color || null
}
