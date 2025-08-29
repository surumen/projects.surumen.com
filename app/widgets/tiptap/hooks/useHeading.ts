"use client"

import * as React from "react"
import { type Editor } from "@tiptap/react"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"

// --- Icons ---
import { TypeH1, TypeH2, TypeH3 } from 'react-bootstrap-icons'

// --- Hooks ---
import { useTiptapEditor } from "./useTiptapEditor"

// --- Lib ---
import {
  findNodePosition,
  isNodeInSchema,
  isNodeTypeSelected,
  isValidPosition,
} from "../utils"

export type Level = 1 | 2 | 3 | 4 | 5 | 6

/**
 * Configuration for the heading functionality
 */
export interface UseHeadingConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * The heading level.
   */
  level: Level
  /**
   * Whether the button should hide when heading is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful heading toggle.
   */
  onToggled?: () => void
}

/**
 * Checks if heading can be toggled in the current editor state
 */
export function canToggleHeading(
  editor: Editor | null,
  level?: Level,
  turnInto: boolean = true
): boolean {
  if (!editor || !editor.isEditable) return false
  if (
    !isNodeInSchema("heading", editor) ||
    isNodeTypeSelected(editor, ["image"])
  )
    return false

  if (!turnInto) {
    return level
      ? editor.can().setNode("heading", { level })
      : editor.can().setNode("heading")
  }

  try {
    const view = editor.view
    const state = view.state
    const selection = state.selection

    if (selection.empty || selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos
      if (!isValidPosition(pos)) return false
    }

    return true
  } catch {
    return false
  }
}

/**
 * Checks if heading is currently active
 */
export function isHeadingActive(
  editor: Editor | null,
  level?: Level | Level[]
): boolean {
  if (!editor || !editor.isEditable) return false

  if (Array.isArray(level)) {
    return level.some((l) => editor.isActive("heading", { level: l }))
  }

  return level
    ? editor.isActive("heading", { level })
    : editor.isActive("heading")
}

/**
 * Toggles heading in the editor
 */
export function toggleHeading(
  editor: Editor | null,
  level: Level | Level[]
): boolean {
  if (!editor || !editor.isEditable) return false

  const levels = Array.isArray(level) ? level : [level]
  const toggleLevel = levels.find((l) => canToggleHeading(editor, l))

  if (!toggleLevel) return false

  try {
    const view = editor.view
    let state = view.state
    let tr = state.tr

    // No selection, find the cursor position
    if (state.selection.empty || state.selection instanceof TextSelection) {
      const pos = findNodePosition({
        editor,
        node: state.selection.$anchor.node(1),
      })?.pos
      if (!isValidPosition(pos)) return false

      tr = tr.setSelection(NodeSelection.create(state.doc, pos))
      view.dispatch(tr)
      state = view.state
    }

    const selection = state.selection
    let chain = editor.chain().focus()

    // Handle NodeSelection
    if (selection instanceof NodeSelection) {
      const firstChild = selection.node.firstChild?.firstChild
      const lastChild = selection.node.lastChild?.lastChild

      const from = firstChild
        ? selection.from + firstChild.nodeSize
        : selection.from + 1

      const to = lastChild
        ? selection.to - lastChild.nodeSize
        : selection.to - 1

      chain = chain.setTextSelection({ from, to }).clearNodes()
    }

    const isActive = levels.some((l) =>
      editor.isActive("heading", { level: l })
    )

    const toggle = isActive
      ? chain.setNode("paragraph")
      : chain.setNode("heading", { level: toggleLevel })

    toggle.run()

    editor.chain().focus().selectTextblockEnd().run()

    return true
  } catch {
    return false
  }
}

/**
 * Determines if the heading button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  level?: Level | Level[]
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, level, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false
  if (!isNodeInSchema("heading", editor)) return false

  if (hideWhenUnavailable && !editor.isActive("code")) {
    if (Array.isArray(level)) {
      return level.some((l) => canToggleHeading(editor, l))
    }
    return canToggleHeading(editor, level)
  }

  return true
}

/**
 * Custom hook that provides heading functionality for Tiptap editor
 */
export function useHeading(config: UseHeadingConfig) {
  const {
    editor: providedEditor,
    level,
    hideWhenUnavailable = false,
    onToggled,
  } = config

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState<boolean>(true)
  const canToggle = canToggleHeading(editor, level)
  const isActive = isHeadingActive(editor, level)

  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, level, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, level, hideWhenUnavailable])

  const handleToggle = React.useCallback(() => {
    if (!editor) return false

    const success = toggleHeading(editor, level)
    if (success) {
      onToggled?.()
    }
    return success
  }, [editor, level, onToggled])

  return {
    isVisible,
    isActive,
    handleToggle,
    canToggle,
    label: `Heading ${level}`,
    Icon: level === 1 ? TypeH1 : level === 2 ? TypeH2 : TypeH3,
  }
}
