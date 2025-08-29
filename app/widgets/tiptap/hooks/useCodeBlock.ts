"use client"

import type { Editor } from "@tiptap/react"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"
import { useEditorCommand } from "./useEditorCommand"
import { CodeSquare } from 'react-bootstrap-icons'
import {
  findNodePosition,
  isNodeInSchema,
  isNodeTypeSelected,
  isValidPosition,
} from "../utils"

export interface UseCodeBlockConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

/**
 * Internal utility: Toggles code block with complex selection handling
 */
function toggleCodeBlockCommand(editor: Editor): boolean {
  try {
    const view = editor.view
    let state = view.state
    let tr = state.tr

    // Handle empty or text selections by finding the node position
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

    // Toggle code block
    const toggle = editor.isActive("codeBlock")
      ? chain.setNode("paragraph")
      : chain.toggleNode("codeBlock", "paragraph")

    toggle.run()
    editor.chain().focus().selectTextblockEnd().run()

    return true
  } catch {
    return false
  }
}

export function useCodeBlock(config?: UseCodeBlockConfig) {
  const {
    editor,
    hideWhenUnavailable = false,
    onToggled,
  } = config || {}

  const result = useEditorCommand({
    editor,
    hideWhenUnavailable,
    onToggled,
    shortcutKeys: "mod+alt+c",
    canExecute: (editor: Editor) => {
      if (!editor.isEditable) return false
      if (
        !isNodeInSchema("codeBlock", editor) ||
        isNodeTypeSelected(editor, ["image"])
      ) return false

      return editor.can().toggleNode("codeBlock", "paragraph")
    },
    isActive: (editor: Editor) => {
      return editor.isActive("codeBlock")
    },
    executeCommand: (editor: Editor) => {
      return toggleCodeBlockCommand(editor)
    },
    label: "Code Block",
  })

  return {
    ...result,
    Icon: CodeSquare,
  }
}
