"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"
import { useCurrentEditor, useEditorState } from "@tiptap/react"

/**
 * Hook that provides access to a Tiptap editor instance.
 * Simplified version with better TypeScript support.
 */
export function useTiptapEditor(providedEditor?: Editor | null): {
  editor: Editor | null
} {
  const { editor: coreEditor } = useCurrentEditor()
  const mainEditor = React.useMemo(
    () => providedEditor || coreEditor,
    [providedEditor, coreEditor]
  )

  const editorState = useEditorState({
    editor: mainEditor,
    selector(context) {
      return {
        editor: context.editor,
      }
    },
  })

  return editorState || { editor: null }
}
