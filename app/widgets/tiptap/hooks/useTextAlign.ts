"use client"

import * as React from "react"
import type { ChainedCommands } from "@tiptap/react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "./useTiptapEditor"

// --- Lib ---
import {
  isExtensionAvailable,
  isNodeTypeSelected,
} from "../utils"

// --- Icons ---
import { TextCenter, Justify, TextLeft, TextRight } from 'react-bootstrap-icons'

export type TextAlign = "left" | "center" | "right" | "justify"

/**
 * Configuration for the text align functionality
 */
export interface UseTextAlignConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * The text alignment to apply.
   */
  align: TextAlign
  /**
   * Whether the button should hide when alignment is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful alignment change.
   */
  onAligned?: () => void
}

export const textAlignIcons = {
  left: TextLeft,
  center: TextCenter,
  right: TextRight,
  justify: Justify,
}

export const textAlignLabels: Record<TextAlign, string> = {
  left: "Align left",
  center: "Align center",
  right: "Align right",
  justify: "Align justify",
}

/**
 * Checks if text alignment can be performed in the current editor state
 */
export function canSetTextAlign(
  editor: Editor | null,
  align: TextAlign
): boolean {
  if (!editor || !editor.isEditable) return false
  if (
    !isExtensionAvailable(editor, "textAlign") ||
    isNodeTypeSelected(editor, ["image"])
  )
    return false

  return editor.can().setTextAlign(align)
}

export function hasSetTextAlign(
  commands: ChainedCommands
): commands is ChainedCommands & {
  setTextAlign: (align: TextAlign) => ChainedCommands
} {
  return "setTextAlign" in commands
}

/**
 * Checks if the text alignment is currently active
 */
export function isTextAlignActive(
  editor: Editor | null,
  align: TextAlign
): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.isActive({ textAlign: align })
}

/**
 * Sets text alignment in the editor
 */
export function setTextAlign(editor: Editor | null, align: TextAlign): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canSetTextAlign(editor, align)) return false

  const chain = editor.chain().focus()
  if (hasSetTextAlign(chain)) {
    return chain.setTextAlign(align).run()
  }

  return false
}

/**
 * Determines if the text align button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
  align: TextAlign
}): boolean {
  const { editor, hideWhenUnavailable, align } = props

  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, "textAlign")) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canSetTextAlign(editor, align)
  }

  return true
}

/**
 * Custom hook that provides text align functionality for Tiptap editor
 */
export function useTextAlign(config: UseTextAlignConfig) {
  const {
    editor: providedEditor,
    align,
    hideWhenUnavailable = false,
    onAligned,
  } = config

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState<boolean>(true)
  const canAlign = canSetTextAlign(editor, align)
  const isActive = isTextAlignActive(editor, align)

  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, align, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable, align])

  const handleTextAlign = React.useCallback(() => {
    if (!editor) return false

    const success = setTextAlign(editor, align)
    if (success) {
      onAligned?.()
    }
    return success
  }, [editor, align, onAligned])

  return {
    isVisible,
    isActive,
    handleTextAlign,
    canAlign,
    label: textAlignLabels[align],
    Icon: textAlignIcons[align],
  }
}
