"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"
import { useTiptapEditor } from "./useTiptapEditor"
import { Level } from "./useHeading"

export interface UseHeadingDropdownMenuConfig {
  editor?: Editor | null
  levels?: Level[]
  hideWhenUnavailable?: boolean
}

/**
 * Gets the currently active heading level
 */
function getActiveHeadingLevel(
  editor: Editor | null,
  levels: Level[] = [1, 2, 3, 4, 5, 6]
): Level | undefined {
  if (!editor || !editor.isEditable) return undefined
  return levels.find((level) => editor.isActive("heading", { level }))
}

export function useHeadingDropdownMenu(config?: UseHeadingDropdownMenuConfig) {
  const {
    editor: providedEditor,
    levels = [1, 2, 3, 4, 5, 6],
    hideWhenUnavailable = false,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = React.useState(true)

  const activeLevel = getActiveHeadingLevel(editor, levels)
  const isActive = Boolean(activeLevel)

  React.useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      if (hideWhenUnavailable) {
        setIsVisible(editor.can().setHeading({ level: 1 })) // Test if headings are available
      } else {
        setIsVisible(true)
      }
    }

    handleSelectionUpdate()
    editor.on("selectionUpdate", handleSelectionUpdate)
    
    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  // Generate items array for dropdown
  const items = React.useMemo(() => {
    if (!editor) return []
    
    const dropdownItems = [
      {
        text: "Paragraph",
        onClick: () => editor.chain().focus().setParagraph().run(),
        active: !isActive
      }
    ]
    
    levels.forEach((level) => {
      dropdownItems.push({
        text: `Heading ${level}`,
        onClick: () => editor.chain().focus().setHeading({ level }).run(),
        active: editor.isActive("heading", { level })
      })
    })
    
    return dropdownItems
  }, [editor, isActive, levels])

  return {
    isVisible,
    activeLevel,
    isActive,
    canToggle: Boolean(editor?.can().setHeading({ level: 1 })),
    levels,
    label: "Text Format",
    displayText: activeLevel ? `Heading ${activeLevel}` : "Paragraph",
    items,
  }
}
