"use client"

import type { Editor } from "@tiptap/react"
import { useEditorCommand } from "./useEditorCommand"
import { PaletteFill } from 'react-bootstrap-icons'
import { isMarkInSchema, isNodeTypeSelected } from "../utils"
import type { BootstrapColor } from "../components/shared/ColorSwatch"

export interface UseColorHighlightConfig {
  editor?: Editor | null
  highlightColor: BootstrapColor
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

const bootstrapColorMap: Record<BootstrapColor, string> = {
  primary: "rgba(var(--bs-primary-rgb), 0.1)",
  secondary: "rgba(var(--bs-secondary-rgb), 0.1)",
  success: "rgba(var(--bs-success-rgb), 0.1)", 
  danger: "rgba(var(--bs-danger-rgb), 0.1)",
  warning: "rgba(var(--bs-warning-rgb), 0.1)",
  info: "rgba(var(--bs-info-rgb), 0.1)",
  light: "rgba(var(--bs-light-rgb), 0.1)",
  dark: "rgba(var(--bs-dark-rgb), 0.1)",
}

export function useColorHighlight(config: UseColorHighlightConfig) {
  const { editor, highlightColor, hideWhenUnavailable, onToggled } = config

  const result = useEditorCommand({
    editor,
    hideWhenUnavailable,
    onToggled,
    canExecute: (editor: Editor) => {
      if (!editor.isEditable) return false
      if (
        !isMarkInSchema("highlight", editor) ||
        isNodeTypeSelected(editor, ["image"])
      ) return false

      return editor.can().setMark("highlight")
    },
    isActive: (editor: Editor) => {
      const cssColor = bootstrapColorMap[highlightColor]
      return editor.isActive("highlight", { color: cssColor })
    },
    executeCommand: (editor: Editor) => {
      const cssColor = bootstrapColorMap[highlightColor]
      return editor.chain().focus().toggleMark("highlight", { color: cssColor }).run()
    },
    label: `Highlight ${highlightColor}`,
  })

  return {
    ...result,
    Icon: PaletteFill,
    handleRemoveHighlight: () => {
      if (!editor) return false
      return editor.chain().focus().unsetMark("highlight").run()
    },
  }
}
