"use client"

import type { Editor } from "@tiptap/react"
import { NodeSelection, TextSelection } from "@tiptap/pm/state"
import { useEditorCommand } from "./useEditorCommand"
import { ListUl, ListOl, ListTask } from 'react-bootstrap-icons'
import { 
  findNodePosition, 
  isNodeInSchema, 
  isNodeTypeSelected, 
  isValidPosition 
} from "../utils"

export type ListType = "bulletList" | "orderedList" | "taskList"

export interface UseListConfig {
  editor?: Editor | null
  type: ListType
  hideWhenUnavailable?: boolean
  onToggled?: () => void
}

const listIcons = {
  bulletList: ListUl,
  orderedList: ListOl,
  taskList: ListTask,
}

const listLabels: Record<ListType, string> = {
  bulletList: "Bullet List",
  orderedList: "Ordered List", 
  taskList: "Task List",
}

/**
 * Internal utility: Toggles list with complex selection handling
 */
function toggleListCommand(editor: Editor, type: ListType): boolean {
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

    // Toggle specific list type
    if (editor.isActive(type)) {
      // Unwrap list
      chain
        .liftListItem("listItem")
        .lift("bulletList") 
        .lift("orderedList")
        .lift("taskList")
        .run()
    } else {
      // Wrap in specific list type
      switch (type) {
        case "bulletList":
          chain.toggleBulletList().run()
          break
        case "orderedList":
          chain.toggleOrderedList().run()
          break
        case "taskList":
          chain.toggleList("taskList", "taskItem").run()
          break
      }
    }

    editor.chain().focus().selectTextblockEnd().run()
    return true
  } catch {
    return false
  }
}

export function useList(config: UseListConfig) {
  const { editor, type, hideWhenUnavailable, onToggled } = config

  const result = useEditorCommand({
    editor,
    hideWhenUnavailable,
    onToggled,
    canExecute: (editor: Editor) => {
      if (!editor.isEditable) return false
      if (!isNodeInSchema(type, editor) || isNodeTypeSelected(editor, ["image"])) {
        return false
      }

      switch (type) {
        case "bulletList":
          return editor.can().toggleBulletList()
        case "orderedList":
          return editor.can().toggleOrderedList()
        case "taskList":
          return editor.can().toggleList("taskList", "taskItem")
        default:
          return false
      }
    },
    isActive: (editor: Editor) => {
      return editor.isActive(type)
    },
    executeCommand: (editor: Editor) => {
      return toggleListCommand(editor, type)
    },
    label: listLabels[type],
  })

  return {
    ...result,
    Icon: listIcons[type],
  }
}
