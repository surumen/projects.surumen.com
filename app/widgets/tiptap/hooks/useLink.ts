"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"
import { useEditorCommand } from "./useEditorCommand"
import { Link45deg } from 'react-bootstrap-icons'
import { isMarkInSchema, sanitizeUrl } from "../utils"

export interface UseLinkConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

export function useLink(config?: UseLinkConfig) {
  const {
    editor,
    hideWhenUnavailable = false,
    onToggled,
  } = config || {}

  const result = useEditorCommand({
    editor,
    hideWhenUnavailable,
    onToggled,
    canExecute: (editor: Editor) => {
      if (!editor.isEditable) return false
      if (!isMarkInSchema("link", editor)) return false
      return editor.can().setMark("link")
    },
    isActive: (editor: Editor) => {
      return editor.isActive("link")
    },
    executeCommand: () => {
      // Link requires URL input, so we don't auto-execute
      // This will be handled by the component that uses this hook
      return true
    },
    label: "Link",
  })

  const currentUrl = React.useMemo(() => {
    if (!editor || !result.isActive) return ""
    const { href } = editor.getAttributes("link")
    return href || ""
  }, [editor, result.isActive])

  const handleSetLink = React.useCallback((url: string) => {
    if (!editor || !editor.isEditable || !url.trim()) return false

    const safeUrl = sanitizeUrl(url, window.location.href)
    if (safeUrl === "#") return false

    try {
      const { selection } = editor.state
      const isEmpty = selection.empty

      let chain = editor.chain().focus()
      chain = chain.extendMarkRange("link").setLink({ href: safeUrl })

      if (isEmpty) {
        chain = chain.insertContent({ type: "text", text: url })
      }

      const success = chain.run()
      if (success) onToggled?.()
      return success
    } catch {
      return false
    }
  }, [editor, onToggled])

  const handleRemoveLink = React.useCallback(() => {
    if (!editor || !editor.isEditable || !result.isActive) return false

    try {
      const success = editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .unsetLink()
        .setMeta("preventAutolink", true)
        .run()
      
      if (success) onToggled?.()
      return success
    } catch {
      return false
    }
  }, [editor, result.isActive, onToggled])

  const handleOpenLink = React.useCallback((target = "_blank", features = "noopener,noreferrer") => {
    if (!currentUrl) return false

    const safeUrl = sanitizeUrl(currentUrl, window.location.href)
    if (safeUrl === "#") return false

    try {
      window.open(safeUrl, target, features)
      return true
    } catch {
      return false
    }
  }, [currentUrl])

  return {
    ...result,
    Icon: Link45deg,
    currentUrl,
    handleSetLink,
    handleRemoveLink,
    handleOpenLink,
  }
}
