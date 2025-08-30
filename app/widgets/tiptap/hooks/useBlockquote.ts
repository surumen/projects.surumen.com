"use client"

import type { Editor } from "@tiptap/react"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"
import { useEditorCommand } from "./useEditorCommand"
import { Quote } from 'react-bootstrap-icons'
import { 
  findNodePosition, 
  isNodeInSchema, 
  isNodeTypeSelected, 
  isValidPosition 
} from "../utils"

export interface UseBlockquoteConfig {
  editor?: Editor | null
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

/**
 * Internal utility: Toggles blockquote with complex selection handling
 */
function toggleBlockquoteCommand(editor: Editor): boolean {
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

    // Toggle blockquote
    const toggle = editor.isActive("blockquote")
      ? chain.lift("blockquote")
      : chain.wrapIn("blockquote")

    toggle.run()
    editor.chain().focus().selectTextblockEnd().run()

    return true
  } catch {
    return false
  }
}

export function useBlockquote(config?: UseBlockquoteConfig) {
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
      if (
        !isNodeInSchema("blockquote", editor) ||
        isNodeTypeSelected(editor, ["image"])
      ) return false

      return editor.can().toggleWrap("blockquote")
    },
    isActive: (editor: Editor) => {
      return editor.isActive("blockquote")
    },
    executeCommand: (editor: Editor) => {
      return toggleBlockquoteCommand(editor)
    },
    label: "Blockquote",
  })

  return {
    ...result,
    Icon: Quote,
  }
}
