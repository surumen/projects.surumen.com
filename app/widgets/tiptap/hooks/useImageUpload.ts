"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"
import { useEditorCommand } from "./useEditorCommand"
import { Image } from "react-bootstrap-icons"
import { isExtensionAvailable, isNodeTypeSelected } from "../utils"

export interface UseImageUploadConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onInserted?: () => void
}

/**
 * Internal utility: Handles file picker and image insertion
 */
function insertImageWithFilePicker(editor: Editor, onInserted?: () => void): boolean {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageSrc = event.target?.result as string
        if (imageSrc && 'setImage' in editor.commands) {
          const success = (editor.chain().focus() as any).setImage({ src: imageSrc }).run()
          if (success) onInserted?.()
        }
      }
      reader.readAsDataURL(file)
    }
  }
  
  input.click()
  return true
}

export function useImageUpload(config?: UseImageUploadConfig) {
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
        !isExtensionAvailable(editor, "image") ||
        isNodeTypeSelected(editor, ["image"])
      ) return false

      return Boolean('setImage' in editor.commands)
    },
    isActive: (editor: Editor) => {
      return editor.isActive("image")
    },
    executeCommand: (editor: Editor) => {
      return insertImageWithFilePicker(editor, onInserted)
    },
    label: "Add image",
  })

  const handleInsertImage = React.useCallback((src: string) => {
    if (!editor || !editor.isEditable || !src) return false

    try {
      if ('setImage' in editor.commands) {
        const success = (editor.chain().focus() as any).setImage({ src }).run()
        if (success) onInserted?.()
        return success
      }
      return false
    } catch {
      return false
    }
  }, [editor, onInserted])

  return {
    ...result,
    Icon: Image,
    handleInsertImage, // Direct image insertion with URL
  }
}
