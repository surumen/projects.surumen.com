"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "./useTiptapEditor"

// --- Icons ---
import { Link45deg } from 'react-bootstrap-icons'

// --- Lib ---
import { isMarkInSchema, sanitizeUrl } from "../utils"

/**
 * Configuration for the link functionality
 */
export interface UseLinkConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when link is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful link operation.
   */
  onToggled?: () => void
}

/**
 * Checks if a link can be set in the current editor state
 */
export function canSetLink(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.can().setMark("link")
}

/**
 * Checks if a link is currently active in the editor
 */
export function isLinkActive(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return editor.isActive("link")
}

/**
 * Gets the current link URL from the editor
 */
export function getCurrentLinkUrl(editor: Editor | null): string {
  if (!editor || !isLinkActive(editor)) return ""
  const { href } = editor.getAttributes("link")
  return href || ""
}

/**
 * Sets a link in the editor
 */
export function setLink(editor: Editor | null, url: string): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canSetLink(editor)) return false
  if (!url.trim()) return false

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

    return chain.run()
  } catch {
    return false
  }
}

/**
 * Removes the link from the editor
 */
export function removeLink(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!isLinkActive(editor)) return false

  try {
    return editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .unsetLink()
      .setMeta("preventAutolink", true)
      .run()
  } catch {
    return false
  }
}

/**
 * Opens the current link in a new window
 */
export function openCurrentLink(
  editor: Editor | null,
  target: string = "_blank",
  features: string = "noopener,noreferrer"
): boolean {
  const url = getCurrentLinkUrl(editor)
  if (!url) return false

  const safeUrl = sanitizeUrl(url, window.location.href)
  if (safeUrl === "#") return false

  try {
    window.open(safeUrl, target, features)
    return true
  } catch {
    return false
  }
}

/**
 * Determines if the link button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false
  if (!isMarkInSchema("link", editor)) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    return canSetLink(editor)
  }

  return true
}

/**
 * Custom hook that provides link functionality for Tiptap editor
 */
export function useLink(config?: UseLinkConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onToggled,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState<boolean>(true)
  const canSet = canSetLink(editor)
  const isActive = isLinkActive(editor)
  const currentUrl = getCurrentLinkUrl(editor)

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

  const handleSetLink = React.useCallback((url: string) => {
    if (!editor) return false

    const success = setLink(editor, url)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, onToggled])

  const handleRemoveLink = React.useCallback(() => {
    if (!editor) return false

    const success = removeLink(editor)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, onToggled])

  const handleOpenLink = React.useCallback((target?: string, features?: string) => {
    return openCurrentLink(editor, target, features)
  }, [editor])

  return {
    isVisible,
    isActive,
    canSet,
    currentUrl,
    handleSetLink,
    handleRemoveLink,
    handleOpenLink,
    label: "Link",
    Icon: Link45deg,
  }
}
