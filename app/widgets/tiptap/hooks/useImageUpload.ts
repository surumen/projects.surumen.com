"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "./useTiptapEditor"

// --- Lib ---
import {
  isExtensionAvailable,
  isNodeTypeSelected,
} from "../utils"

// --- Icons ---
import { Image } from "react-bootstrap-icons"

/**
 * Configuration for the image upload functionality
 */
export interface UseImageUploadConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when insertion is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful image insertion.
   */
  onInserted?: () => void
}

/**
 * Checks if image can be inserted in the current editor state
 */
export function canInsertImage(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (
    !isExtensionAvailable(editor, "image") ||
    isNodeTypeSelected(editor, ["image"])
  )
    return false

  return editor.can().chain().focus().run()
}

/**
 * Checks if image is currently active
 */
export function isImageActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.isActive("image")
}

/**
 * Inserts an image in the editor
 */
export function insertImage(editor: Editor | null, src?: string): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canInsertImage(editor)) return false
  if (!isExtensionAvailable(editor, "image")) return false

  // If no src provided, open file picker
  if (!src) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Convert to data URL for immediate insertion
        const reader = new FileReader()
        reader.onload = (event) => {
          const imageSrc = event.target?.result as string
          if (imageSrc) {
            // Check if setImage command exists
            if ('setImage' in editor.commands && typeof editor.commands.setImage === 'function') {
              (editor.chain().focus() as any).setImage({ src: imageSrc }).run()
            }
          }
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
    return true
  }

  try {
    // Check if setImage command exists before using it
    if ('setImage' in editor.commands && typeof editor.commands.setImage === 'function') {
      return (editor
        .chain()
        .focus() as any).setImage({ src })
        .run()
    }
    return false
  } catch {
    return false
  }
}

/**
 * Determines if the image button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false
  if (!isExtensionAvailable(editor, "image")) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canInsertImage(editor)
  }

  return true
}

/**
 * Custom hook that provides image functionality for Tiptap editor
 */
export function useImageUpload(config?: UseImageUploadConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onInserted,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState<boolean>(true)
  const canInsert = canInsertImage(editor)
  const isActive = isImageActive(editor)

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

  const handleImage = React.useCallback(() => {
    if (!editor) return false

    const success = insertImage(editor)
    if (success) {
      onInserted?.()
    }
    return success
  }, [editor, onInserted])

  return {
    isVisible,
    isActive,
    handleImage,
    canInsert,
    label: "Add image",
    Icon: Image,
  }
}
