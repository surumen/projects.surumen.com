"use client"

import type { Editor } from "@tiptap/react"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"
import { useEditorCommand } from "./useEditorCommand"
import { TypeH1, TypeH2, TypeH3 } from 'react-bootstrap-icons'
import { 
  findNodePosition, 
  isNodeInSchema, 
  isNodeTypeSelected, 
  isValidPosition 
} from "../utils"

export type Level = 1 | 2 | 3 | 4 | 5 | 6

export interface UseHeadingConfig {
  editor?: Editor | null
  level: Level
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

const headingShortcuts: Record<Level, string> = {
  1: "mod+alt+1",
  2: "mod+alt+2", 
  3: "mod+alt+3",
  4: "mod+alt+4",
  5: "mod+alt+5",
  6: "mod+alt+6",
}

/**
 * Internal utility: Toggles heading with complex selection handling
 */
function toggleHeadingCommand(editor: Editor, level: Level): boolean {
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

    // Toggle heading
    const isActive = editor.isActive("heading", { level })
    const toggle = isActive
      ? chain.setNode("paragraph")
      : chain.setNode("heading", { level })

    toggle.run()
    editor.chain().focus().selectTextblockEnd().run()

    return true
  } catch {
    return false
  }
}

export function useHeading(config: UseHeadingConfig) {
  const { editor, level, hideWhenUnavailable, onToggled } = config

  const result = useEditorCommand({
    editor,
    hideWhenUnavailable,
    onToggled,
    shortcutKeys: headingShortcuts[level],
    canExecute: (editor: Editor) => {
      if (!editor.isEditable) return false
      if (
        !isNodeInSchema("heading", editor) ||
        isNodeTypeSelected(editor, ["image"])
      ) return false

      return editor.can().setNode("heading", { level })
    },
    isActive: (editor: Editor) => {
      return editor.isActive("heading", { level })
    },
    executeCommand: (editor: Editor) => {
      return toggleHeadingCommand(editor, level)
    },
    label: `Heading ${level}`,
  })

  const getIcon = () => {
    switch (level) {
      case 1: return TypeH1
      case 2: return TypeH2
      case 3: return TypeH3
      default: return TypeH3
    }
  }

  return {
    ...result,
    Icon: getIcon(),
  }
}
