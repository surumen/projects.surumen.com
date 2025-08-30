"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"
import { useTiptapEditor } from "./useTiptapEditor"
import { ListUl, ListOl, ListTask } from 'react-bootstrap-icons'
import { isNodeInSchema } from "../utils"
import { ListType } from "./useList"

export interface UseListDropdownMenuConfig {
  editor?: Editor | null
  types?: ListType[]
  hideWhenUnavailable?: boolean
}

export interface ListOption {
  label: string
  type: ListType
  icon: React.ElementType
}

const listOptions: ListOption[] = [
  {
    label: "Bullet List",
    type: "bulletList",
    icon: ListUl,
  },
  {
    label: "Ordered List", 
    type: "orderedList",
    icon: ListOl,
  },
  {
    label: "Task List",
    type: "taskList", 
    icon: ListTask,
  },
]

/**
 * Gets the currently active list type
 */
function getActiveListType(
  editor: Editor | null,
  availableTypes: ListType[]
): ListType | undefined {
  if (!editor || !editor.isEditable) return undefined
  return availableTypes.find((type) => editor.isActive(type))
}

export function useListDropdownMenu(config?: UseListDropdownMenuConfig) {
  const {
    editor: providedEditor,
    types = ["bulletList", "orderedList", "taskList"],
    hideWhenUnavailable = false,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState(false)

  const filteredLists = React.useMemo(
    () => listOptions.filter((option) => types.includes(option.type)),
    [types]
  )

  const activeType = getActiveListType(editor, types)
  const isActive = Boolean(activeType)
  const activeList = filteredLists.find((option) => option.type === activeType)

  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      const listInSchema = types.some((type) => isNodeInSchema(type, editor))
      const canToggleAny = types.some((type) => {
        switch (type) {
          case "bulletList": return editor.can().toggleBulletList()
          case "orderedList": return editor.can().toggleOrderedList()
          case "taskList": return editor.can().toggleTaskList()
          default: return false
        }
      })

      if (!listInSchema || !editor) {
        setIsVisible(false)
        return
      }

      if (hideWhenUnavailable) {
        setIsVisible(canToggleAny)
      } else {
        setIsVisible(true)
      }
    }

    handleSelectionUpdate()
    editor.on("selectionUpdate", handleSelectionUpdate)
    
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable, types])

  // Generate items array for dropdown
  const items = React.useMemo(() => {
    if (!editor) return []
    
    return filteredLists.map((listOption) => ({
      text: listOption.label,
      icon: listOption.icon,
      onClick: () => {
        if (listOption.type === "bulletList") {
          editor.chain().focus().toggleBulletList().run()
        } else if (listOption.type === "orderedList") {
          editor.chain().focus().toggleOrderedList().run()
        } else if (listOption.type === "taskList") {
          editor.chain().focus().toggleTaskList().run()
        }
      },
      active: editor.isActive(listOption.type)
    }))
  }, [editor, filteredLists])

  return {
    isVisible,
    activeType,
    isActive,
    canToggle: Boolean(editor?.can().toggleBulletList()), // Test if any list can be toggled
    types,
    filteredLists,
    label: "List Options",
    displayText: activeList ? activeList.label : "List",
    Icon: activeList ? activeList.icon : ListUl,
    items,
  }
}
